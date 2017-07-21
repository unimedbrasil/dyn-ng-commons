(function() {
    'use strict';

    angular
        .module('dyn.commons')
        .directive('dynOnEnter', dynOnEnter);

    function dynOnEnter() {

        return {
            restrict: 'A',
            link: linkFn
        };

        function linkFn(scope, element, attrs) {
            element.bind('keydown keypress', function(event) {
                if (event.which === 13) {
                    scope.$apply(function() {
                        scope.$eval(attrs.dynOnEnter, {
                            'event': event
                        });
                    });
                    event.preventDefault();
                }
            });
        }
    }
})();
