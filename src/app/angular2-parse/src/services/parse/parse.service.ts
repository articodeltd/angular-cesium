import {Injectable, Compiler} from "@angular/core";
import {Parser, Lexer} from '@angular/compiler';
import {ParseVisitorResolver} from '../parse-visitor-resolver/parse-visitor-resolver.service';
import {ParseVisitorCompiler} from '../parse-visitor-compiler/parse-visitor-compiler.service';

@Injectable()
export class Parse {
    private _parser: Parser = new Parser(new Lexer());
    private _pipesCache: Map<string, any> = new Map<string, any>();

    /**
     * Used to dependency inject the Angular 2 parser.
     */
    constructor(private _compiler : Compiler) {
        const compiler: any = this._compiler;
        const pipeCache = compiler._delegate._metadataResolver._pipeCache;

        for (let [pipe, pipeMetadata] of pipeCache) {
            this._pipesCache.set(pipeMetadata.name, new pipe());
        }
    }

    $evalParse(parseText: string): any {
        const visitor = new ParseVisitorCompiler();

        let ast = this._parser.parseInterpolation(parseText, 'A2Parse');

        if (!ast) {
            ast = this._parser.parseBinding(parseText, 'A2Parse');
        }

        const fnBody =  ast.visit(visitor);
        const getFn = eval(`(function evalParse() { return ${fnBody};})`);

        return (context) => {
            context.$pipesCache = this._pipesCache;
            return getFn.call(context);
        };
    }

    $parse(parseText: string): any {
        const visitor = new ParseVisitorResolver(this._pipesCache);

        let ast = this._parser.parseInterpolation(parseText, 'A2Parse');

        if (!ast) {
            ast = this._parser.parseBinding(parseText, 'A2Parse');
        }

        return (context: any): any => {
            return ast.visit(visitor, context);
        };
    }
}