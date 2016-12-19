import {
    AST, RecursiveAstVisitor, PropertyRead, MethodCall, KeyedRead,
    ImplicitReceiver, LiteralPrimitive, Binary, Chain, Conditional,
    BindingPipe, FunctionCall, Interpolation, KeyedWrite, LiteralArray,
    LiteralMap, PrefixNot, PropertyWrite, SafePropertyRead, SafeMethodCall, Quote
} from '@angular/compiler/src/expression_parser/ast';

function isPresent(obj) {
    return obj != null;
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
    /**
     * This is the main object to resolve the parsed string against.
     */
    target:any;

    /**
     * This is the context to witch variables in the string are resolved against.
     * The resolver defaults this to the window.
     */
    context:any;
    contextResolver:ParseVisitorResolver;

    pipes: Map<string, any> = new Map<string, any>();

    constructor(private _compiler: any, main: boolean = true) {
        super();
        if (main) {
            this.contextResolver = new ParseVisitorResolver(this._compiler, false);
        }

        const pipeCache = this._compiler._delegate._metadataResolver._pipeCache;

        for (let [pipe, pipeMetadata] of pipeCache) {
            this.pipes.set(pipeMetadata.name, new pipe());
        }
    };

    /**
     * Updates the target and context objects to resolve visit.
     * @param target - The main object
     * @param context - The object to resolve disconnected variables against.
     */
    setContext(target:any, context:any) {
        this.target = target;
        this.context = context;
        if (this.contextResolver != null) {
            this.contextResolver.setContext(this.context, undefined);
        }
    }

    visitBinary(ast: Binary, context: any): any {
        const execFn = BinaryOperations.get(ast.operation);

        if (!execFn) {
            throw new Error(`Unknown operator ${ast.operation}`);
        }

        return execFn(ast.left.visit(this, context), ast.right.visit(this, context));
    }

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

        const value = ast.exp.visit(this, context);
        const pipeArgs = this.visitAll(ast.args, context);

        if (!pipe.transform) {
            throw new Error(`Invalid pipe.`);
        }

        pipeArgs.unshift(value);

        return pipe.transform.apply(null, pipeArgs);
    }

    // TODO
    visitFunctionCall(ast: FunctionCall, context: any): any {
        ast.target.visit(this);
        this.visitAll(ast.args, context);
        return null;
    }

    visitImplicitReceiver(ast: ImplicitReceiver, context: any): any {
        return context;
    }

    // TODO
    visitInterpolation(ast: Interpolation, context: any): any {
        return this.visitAll(ast.expressions, context);
    }

    // TODO
    visitKeyedRead(ast: KeyedRead, context: any): any {
        ast.obj.visit(this);
        ast.key.visit(this);
        return null;
    }

    // TODO
    visitKeyedWrite(ast: KeyedWrite, context: any): any {
        ast.obj.visit(this);
        ast.key.visit(this);
        ast.value.visit(this);
        return null;
    }

    // TODO
    visitLiteralArray(ast: LiteralArray, context:    any): any {
        return this.visitAll(ast.expressions, context);
    }

    // TODO
    visitLiteralMap(ast: LiteralMap, context: any): any {
        let values = this.visitAll(ast.values, context);
        let keys = ast.keys;
        let resultObject = {};
        for(let i=0; i<keys.length; i++){
            resultObject[keys[i]] = values[i];
        }
        return resultObject;
    }

    visitLiteralPrimitive(ast: LiteralPrimitive, context: any): any {
        return ast.value;
    }

    visitMethodCall(ast: MethodCall, context: any): any {
        let functionContext = ast.receiver.visit(this, context);

        if (!isJsObject(functionContext) || !isFunction(functionContext[ast.name])) {
            return null;
        }

        const args = this.visitAll(ast.args, context);
        return functionContext[ast.name].apply(context, args);
    }

    visitPrefixNot(ast: PrefixNot, context: any): any {
        ast.expression.visit(this);
        return null;
    }

    visitPropertyRead(ast: PropertyRead, context: any): any {
        const obj = ast.receiver.visit(this, context);

        if (!isJsObject(obj)) {
            return null;
        }

        return obj[ast.name];
    }

    visitPropertyWrite(ast: PropertyWrite, context: any): any {
        ast.receiver.visit(this);
        ast.value.visit(this);
        return null;
    }

    visitSafePropertyRead(ast: SafePropertyRead, context: any): any {
        ast.receiver.visit(this);
        return null;
    }

    visitSafeMethodCall(ast: SafeMethodCall, context: any): any {
        ast.receiver.visit(this);
        return this.visitAll(ast.args, context);
    }

    visitAll(asts: AST[], context: any): any {
        return asts.map(ast => ast.visit(this, context));
    }

    visitQuote(ast: Quote, context: any): any {
        return null;
    }
}