import {Injectable, Compiler} from "@angular/core";
import {Parser} from '@angular/compiler';
import {ParseVisitorResolver} from './parse-visitor-resolver.service';
import {EvalParseVisitorResolver} from './eval-parse-visitor-resolver.service';

@Injectable()
export class A2Parse {
    private _pipesCache: Map<string, any> = new Map<string, any>();

    /**
     * Used to dependency inject the Angular 2 parser.
     */
    constructor(private _parser: Parser, private _compiler : Compiler) {
        const compiler: any = this._compiler;
        const pipeCache = compiler._delegate._metadataResolver._pipeCache;

        for (let [pipe, pipeMetadata] of pipeCache) {
            this._pipesCache.set(pipeMetadata.name, new pipe());
        }
    }

    $evalParse(parseText: string): any {
        const visitor = new EvalParseVisitorResolver(this._compiler);

        let ast = this._parser.parseInterpolation(parseText, 'A2Parse');

        if (!ast) {
            //The idea here is that the text is going to be parsable. Something like name.first
            ast = this._parser.parseBinding(parseText, 'A2Parse');
        }

        const fnBody =  ast.visit(visitor);
        const getFn = eval(`(function () { return ${fnBody};})`);

        return (context) => {
            context.$pipesCache = this._pipesCache;
            return getFn.call(context);
        };
    }

    /**
     * This is the main entry point to using the $parse type functionality.
     * This function is most like $parse(string). The resulting object represents
     * the compiled expression.  Call resolve(targetObject) to run the expression
     * on the targetObject.
     * Used when you want to do the same lookup repeatedly over many objects.
     */
    $parse(parseText: string): any {
        const visitor = new ParseVisitorResolver(this._compiler);

        let ast = this._parser.parseInterpolation(parseText, 'A2Parse');

        if (!ast) {
            //The idea here is that the text is going to be parsable. Something like name.first
            ast = this._parser.parseBinding(parseText, 'A2Parse');
        }

        return (target: any, context: any = window): any => {
            //visitor.setContext(target, context);
            return ast.visit(visitor, target);
        };
    }
}