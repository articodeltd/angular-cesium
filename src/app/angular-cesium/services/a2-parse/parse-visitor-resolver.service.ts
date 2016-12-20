import {
    AST, RecursiveAstVisitor, PropertyRead, MethodCall, KeyedRead,
    ImplicitReceiver, LiteralPrimitive, Binary, Chain, Conditional,
    BindingPipe, FunctionCall, Interpolation, KeyedWrite, LiteralArray,
    LiteralMap, PrefixNot, PropertyWrite, SafePropertyRead, SafeMethodCall, Quote
} from '@angular/compiler/src/expression_parser/ast';

function isPresent(obj) {
    return obj !== null && obj !== undefined;
}

function isBlank(obj) {
    return obj == null;
}

function isJsObject(obj) {
    return obj !== null && (typeof obj === 'function' || typeof obj === 'object');
}

export function isPrimitive(obj) {
    return !isJsObject(obj);
}

function isFunction(val) {
    return typeof val === 'function';
}

const BinaryOperations = new Map<string, any>([
    ['==', (left, right) => left == right],
    ['===', (left, right) => left === right],
    ['!=', (left, right) => left != right],
    ['!==', (left, right) => left !== right],
    ['&&', (left, right) => left && right],
    ['||', (left, right) => left || right],
    ['+', (left, right) => left + right],
    ['-', (left, right) => left - right],
    ['/', (left, right) => left / right],
    ['*', (left, right) => left * right],
    ['%', (left, right) => left % right],
    ['<', (left, right) => left < right],
    ['<=', (left, right) => left <= right],
    ['>', (left, right) => left > right],
    ['>=', (left, right) => left >= right],
]);

export class ParseVisitorResolver extends RecursiveAstVisitor {

    pipes: Map<string, any> = new Map<string, any>();

    constructor(private _compiler: any) {
        super();

        const pipeCache = this._compiler._delegate._metadataResolver._pipeCache;

        for (let [pipe, pipeMetadata] of pipeCache) {
            this.pipes.set(pipeMetadata.name, new pipe());
        }
    };

    visitBinary(ast: Binary, context: any): any {
        const execFn = BinaryOperations.get(ast.operation);

        if (!execFn) {
            throw new Error(`Parse ERROR: on visitBinary, unknown operator ${ast.operation}`);
        }

        return execFn(ast.left.visit(this, context), ast.right.visit(this, context));
    }

    // TODO
    visitChain(ast: Chain, context: any): any {
        return this.visitAll(ast.expressions, context);
    }

    visitConditional(ast: Conditional, context: any): any {
        if (ast.condition.visit(this)) {
            return ast.trueExp.visit(this);
        } else if (isPresent(ast.falseExp)) {
            return ast.falseExp.visit(this);
        }

        return null;
    }

    visitPipe(ast: BindingPipe, context: any): any {
        const pipe = this.pipes.get(ast.name);

        if (!pipe) {
            throw new Error(`pipe ${ast.name} not found.`);
        }

        if (!pipe.transform) {
            throw new Error(`Parse ERROR: on visitPipe, transform method doesn't exist on pipe ${ast.name}.`);
        }

        const value = ast.exp.visit(this, context);
        const pipeArgs = this.visitAll(ast.args, context);

        pipeArgs.unshift(value);

        return pipe.transform.apply(null, pipeArgs);
    }

    // TODO
    visitFunctionCall(ast: FunctionCall, context: any): any {
        const target = ast.target.visit(this, context);

        if (!isFunction(target)) {
            throw new Error(`Parse ERROR: on visitFunctionCall, target is not a function.`);
        }

        const args = this.visitAll(ast.args, context);
        return target.apply(null, args);
    }

    // TODO
    visitImplicitReceiver(ast: ImplicitReceiver, context: any): any {
        return context;
    }

    visitInterpolation(ast: Interpolation, context: any): any {
        return this.visitAll(ast.expressions, context)[0];
    }

    visitKeyedRead(ast: KeyedRead, context: any): any {
        const obj = ast.obj.visit(this, context);
        const key = ast.key.visit(this);
        return obj[key];
    }

    visitKeyedWrite(ast: KeyedWrite, context: any): any {
        const obj = ast.obj.visit(this, context);
        const key = ast.key.visit(this, context);
        const value = ast.value.visit(this, context);
        obj[key] = value;
        return null;
    }

    visitLiteralArray(ast: LiteralArray, context: any): any {
        return this.visitAll(ast.expressions, context);
    }

    visitLiteralMap(ast: LiteralMap, context: any): any {
        const result = {};
        const keys = this.visitAll(ast.keys, context);
        const values = this.visitAll(ast.values, context);

        for (let i = 0, length = keys.length; i < length; i++) {
            result[keys[i]] = values[i];
        }

        return result;
    }

    visitLiteralPrimitive(ast: LiteralPrimitive, context: any): any {
        return ast.value;
    }

    visitMethodCall(ast: MethodCall, context: any): any {
        const receiver = ast.receiver.visit(this, context);

        if (!isJsObject(receiver)) {
            throw new Error(`Parse ERROR: on visitMethodCall, invalid method receiver.`);
        }

        const method = receiver[ast.name];

        if (!isFunction(method)) {
            throw new Error(`Parse ERROR: on visitMethodCall, method ${ast.name} doesn't exist on receiver.`);
        }

        const args = this.visitAll(ast.args, context);
        return method.apply(receiver, args);
    }

    visitPrefixNot(ast: PrefixNot, context: any): any {
        return ast.expression.visit(this, context);
    }

    visitPropertyRead(ast: PropertyRead, context: any): any {
        const receiver = ast.receiver.visit(this, context);

        if (!isJsObject(receiver)) {
            throw new Error(`Parse ERROR: on visitPropertyRead, invalid property receiver.`);
        }

        return receiver[ast.name];
    }

    visitPropertyWrite(ast: PropertyWrite, context: any): any {
        const receiver = ast.receiver.visit(this, context);

        if (!isJsObject(receiver)) {
            throw new Error(`Parse ERROR: on visitPropertyRead, invalid property receiver.`);
        }

        receiver[ast.name] = ast.value.visit(this, context);
        return null;
    }

    visitSafePropertyRead(ast: SafePropertyRead, context: any): any {
        const receiver = ast.receiver.visit(this, context);

        if (!isJsObject(receiver)) {
            throw new Error(`Parse ERROR: on visitSafePropertyRead, invalid property receiver.`);
        }

        return receiver[ast.name];
    }

    visitSafeMethodCall(ast: SafeMethodCall, context: any): any {
        const receiver = ast.receiver.visit(this, context);

        if (!isJsObject(receiver)) {
            throw new Error(`Parse ERROR: on visitSafeMethodCall, invalid method receiver.`);
        }

        const method = receiver[ast.name];

        if (!isFunction(method)) {
            throw new Error(`Parse ERROR: on visitSafeMethodCall, method ${ast.name} doesn't exist on receiver.`);
        }

        const args = this.visitAll(ast.args, context);
        return method.apply(receiver, args);
    }

    visitAll(asts: AST[], context: any): any {
        return asts.map(ast => ast.visit(this, context));
    }

    visitQuote(ast: Quote, context: any): any {
        throw new Error(`Parse ERROR: on visitQuote, quote expression not allowed.`);
    }
}