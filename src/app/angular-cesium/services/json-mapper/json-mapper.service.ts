import {Injectable} from "@angular/core";
import {Parser, Lexer} from '@angular/compiler';
import {LiteralMap} from '@angular/compiler/src/expression_parser/ast';
import {JsonMapperVisitor} from "../json-mapper-visitor/json-mapper-visitor.service";

@Injectable()
export class JsonMapper {
    private _parser: Parser = new Parser(new Lexer());

    map(expression: string): Map<string, string> {
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

        const jsonMap = new Map<string, string>();
        const resultObj = ast.visit(visitor, true);
        const keys = Object.keys(resultObj);

        for (let i = 0, length = keys.length; i < length; i++) {
            jsonMap.set(keys[i], resultObj[keys[i]]);
        }

        return jsonMap;
    }
}