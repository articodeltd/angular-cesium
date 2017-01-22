import {
    AST,
    RecursiveAstVisitor,
    PropertyRead,
    MethodCall,
    KeyedRead,
    ImplicitReceiver,
    LiteralPrimitive,
    Binary,
    Chain,
    Conditional,
    BindingPipe,
    FunctionCall,
    Interpolation,
    KeyedWrite,
    LiteralArray,
    LiteralMap,
    PrefixNot,
    PropertyWrite,
    SafePropertyRead,
    SafeMethodCall,
    Quote
} from "@angular/compiler/src/expression_parser/ast";
import {compileToJSON} from "../parse-utils/parse-utils.service";

export class ParseVisitorCompiler extends RecursiveAstVisitor {

    visitBinary(ast: Binary): any {
        const left = ast.left.visit(this);
        const right = ast.right.visit(this);

        return `${left} ${ast.operation} ${right}`;
    }

    // TODO
    visitChain(ast: Chain): any {
        return compileToJSON(this.visitAll(ast.expressions));
    }

    visitConditional(ast: Conditional): any {
        const condition = ast.condition.visit(this);
        const trueExp = ast.trueExp.visit(this);
        const falseExp = ast.falseExp.visit(this);

        return `${condition} ? ${trueExp} : ${falseExp}`;
    }

    visitPipe(ast: BindingPipe): any {
        const pipe = ast.name;
        const args = this.visitAll(ast.args);
        const value = ast.exp.visit(this);
        args.unshift(value);

        return `pipesCache.get('${pipe}').transform.apply(null, ${compileToJSON(args)})`;
    }

    // TODO
    visitFunctionCall(ast: FunctionCall): any {
        const target = ast.target.visit(this);
        const args = compileToJSON(this.visitAll(ast.args));

        return `${target}.apply(null, ${args})`;
    }

    visitImplicitReceiver(ast: ImplicitReceiver): any {
        return `context`;
    }

    visitInterpolation(ast: Interpolation): any {
        return this.visitAll(ast.expressions)[0];
    }

    visitKeyedRead(ast: KeyedRead): any {
        const obj = ast.obj.visit(this);
        let key = ast.key.visit(this);

        return `${obj}[${key}]`;
    }

    visitKeyedWrite(ast: KeyedWrite): any {
        return null;
    }

    visitLiteralArray(ast: LiteralArray): any {
        return compileToJSON(this.visitAll(ast.expressions));
    }

    visitLiteralMap(ast: LiteralMap): any {
        const result = {};
        const keys = ast.keys;
        const values = this.visitAll(ast.values);

        for (let i = 0, length = keys.length; i < length; i++) {
            result[keys[i]] = values[i];
        }

        return compileToJSON(result);
    }

    visitLiteralPrimitive(ast: LiteralPrimitive): any {
        let value  = ast.value;
        if (typeof value === 'string') {
            value = `'${value}'`
        }
        return value;
    }

    visitMethodCall(ast: MethodCall): any {
        const methodName = ast.name;
        const receiver = ast.receiver.visit(this);
        const args = compileToJSON(this.visitAll(ast.args));

        return `${receiver}['${methodName}'].apply(null, ${args})`;
    }

    visitPrefixNot(ast: PrefixNot): any {
        return ast.expression.visit(this);
    }

    visitPropertyRead(ast: PropertyRead): any {
        const property = ast.name;
        const receiver = ast.receiver.visit(this);

        return `${receiver}['${property}']`;
    }

    visitPropertyWrite(ast: PropertyWrite): any {
        return null;
    }

    visitSafePropertyRead(ast: SafePropertyRead): any {
        const property = ast.name;
        const receiver = ast.receiver.visit(this);

        return `${receiver}['${property}']`;
    }

    visitSafeMethodCall(ast: SafeMethodCall): any {
        const methodName = ast.name;
        const receiver = ast.receiver.visit(this);
        const args = compileToJSON(this.visitAll(ast.args));

        return `${receiver}['${methodName}'].apply(null, ${args})`;
    }

    visitAll(asts: AST[]): any {
        return asts.map(ast => {
            let result = ast.visit(this);

            return result;
        });
    }

    visitQuote(ast: Quote): any {
        return null;
    }
}