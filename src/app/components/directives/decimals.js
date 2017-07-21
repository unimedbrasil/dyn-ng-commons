(function() {
    'use strict';

    angular
        .module('dyn.commons')
        .directive('dynDecimals', dynDecimals);

        function dynDecimals() {
            return {
                restrict: "A",
                require: "ngModel",
                scope: {
                    decimals: "@"
                },
                link: linkFn
            };

            function linkFn (scope, element, attr, ngModel) {
                var decimalsInt = parseInt(scope.decimals) || 2;

                // executa quando carrega o campo
                ngModel.$render = function() {
                    var viewVal = toView(ngModel);
                    if (viewVal) {
                        element.val(viewVal);
                    }
                };

                // Ação para quando saí do campo
                element.on('blur', function(evt) {
                    var viewVal = toView(ngModel);
                    if (viewVal) {
                        ngModel.$setViewValue(viewVal);
                        ngModel.$render();
                    }
                });

                // Ação para quando entra no campo
                element.on('focus', function(evt) {
                    var viewVal = toView(ngModel);
                    if (viewVal) {
                        ngModel.$setViewValue(viewVal);
                        ngModel.$render();
                    }
                });

                /**
                 * Aplica casas decimais no campo
                 *
                 * @param  {[ngModel]} model
                 * @return {[string]}
                 */
                function toView(model) {
                    if ((ngModel.$modelValue && ngModel.$valid) && typeof decimalsInt === 'number') {
                        return ngModel.$modelValue.toFixed(decimalsInt);
                    }
                }
            }
        }
})();
