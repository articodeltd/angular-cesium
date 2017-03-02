import { Injectable } from '@angular/core';
import { Parser, Lexer } from '@angular/compiler';
import { JsonMapperVisitor } from '../json-mapper-visitor/json-mapper-visitor.service';

@Injectable()
export class JsonMapper {
	private _parser: Parser = new Parser(new Lexer());
	private _cache: Map<string, any> = new Map<string, any>();

	map(expression: string): Map<string, string> {
		let ast: any = null;
		const visitor = new JsonMapperVisitor();

		if (this._cache.has(expression)) {
			ast = this._cache.get(expression);
		}
		else {
			ast = this._parser.parseInterpolation(expression, 'JsonMapper');

			if (ast) {
				throw new Error(`JsonMapperVisitor ERROR: given expression must be json expression.`);
			}
			else {
				ast = this._parser.parseBinding(expression, 'Parse');
			}

			if (!(ast.ast && ast.ast.hasOwnProperty('keys') && ast.ast.hasOwnProperty('values'))) {
				throw new Error(`JsonMapper ERROR: given expression must be json expression.`);
			}

			this._cache.set(expression, ast);
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
