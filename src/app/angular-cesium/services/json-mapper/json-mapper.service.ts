import {Injectable} from "@angular/core";
import {Parser, Lexer} from '@angular/compiler';
import {LiteralMap} from '@angular/compiler/src/expression_parser/ast';
import {JsonMapperVisitor} from "../json-mapper-visitor/json-mapper-visitor.service";

@Injectable()
export class JsonMapper {
    private _parser: Parser = new Parser(new Lexer());

    map(expression: string): any {
        const visitor = new JsonMapperVisitor();

        let ast = this._parser.parseInterpolation(expression, 'JsonMapper');

        if (ast) {
            throw new Error(`JsonMapperVisitor ERROR: given expression must be json expression.`);
        }
        else {
            ast = this._parser.parseBinding(expression, 'Parse');
        }

        if (!(ast.ast instanceof LiteralMap)) {
            throw new Error(`JsonMapper ERROR: given expression must be json expression.`);
        }

        return ast.visit(visitor, true);
    }
}