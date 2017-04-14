export default {
    entry: 'index.js',
    dest: 'bundles/angular-cesium.umd.js',
    sourceMap: true,
    format: 'umd',
    exports: 'named',
    onwarn: function(warning) {},
    moduleName: 'angularCesium',
    globals: {
        'rxjs/Observable': 'Rx',
        'rxjs/Subject': 'Rx',
        'rxjs/Observer': 'Rx',
        'rxjs/Subscription': 'Rx',
        'rxjs/observable/merge': 'Rx.Observable',
        'rxjs/observable/ConnectableObservable': 'Rx.Observable',
        '@angular/core' : 'ng.core',
        '@angular/common' : 'ng.common',
        'angular2parse': 'ng.parse',
        'json-string-mapper': 'jsonStringMapper',
        'geodesy': 'geodesy',
        'primitive-primitives': 'primitive_primitives'
    }
}
