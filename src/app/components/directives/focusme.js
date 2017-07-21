(function() {
    'use strict';

    angular
        .module('dyn.commons')
        .directive('focusMe', focusMe);

    /* @ngInject */
    function focusMe() {

        var directive = {
            scope: {
                trigger: '=focusMe'
            },
            link: linkFunc
        };

        return directive;

        function linkFunc(scope, el, attr, ctrl) {
            scope.$watch('trigger', function(value) {
                if (value === true) {
                    el[0].focus();
                    scope.trigger = false;
                }
            });
        }
    }
})();
