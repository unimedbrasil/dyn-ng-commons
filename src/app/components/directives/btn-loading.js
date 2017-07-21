(function() {
    'use strict';

    angular
        .module('dyn.commons')
        .directive('btnLoading', btnLoading);

    /* @ngInject */
    function btnLoading() {

        var directive = {
            link: linkFunc
        };

        return directive;

        function linkFunc(scope, element, attrs) {
            scope.$watch(
                function() {
                    return scope.$eval(attrs.btnLoading);
                },
                function(value) {
                    if (value) {
                        element.button('loading');
                    } else {
                        element.button('reset');
                    }
                }
            );
        }
    }
})();
