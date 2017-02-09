import { Injectable } from '@angular/core';
import { Parser, Lexer } from '@angular/compiler';
import { LiteralMap, LiteralArray, ASTWithSource, ParseSpan } from '@angular/compiler/src/expression_parser/ast';
import { JsonMapperVisitor } from '../json-mapper-visitor/json-mapper-visitor.service';

@Injectable()
export class JsonMapper {
	private _parser: Parser = new Parser(new Lexer());
	private _cache: Map<string, ASTWithSource> = new Map<string, ASTWithSource>();

	map(expression: string): Map<string, string> {
		let ast: ASTWithSource = null;
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

			console.log(LiteralMap);
			if (!(ast.ast instanceof LiteralMap)) {
				// throw new Error(`JsonMapper ERROR: given expression must be json expression.`);
				console.log(LiteralMap)
			}

			if (this._parser instanceof Parser) {
				console.log('OH YEAH');
				console.log(typeof this._parser);
			}

			let blat = new LiteralArray(<ParseSpan>{end: 2, start: 1}, ['blat']);

			if (blat instanceof LiteralArray) {
				console.log('Ad Matay');
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