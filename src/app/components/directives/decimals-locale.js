(function() {
    'use strict';

    angular
        .module('dyn.commons')
        .directive('dynDecimalsLocale', dynDecimalsLocale);

        dynDecimalsLocale.$inject = ['$locale'];

        function dynDecimalsLocale($locale) {
            return {
                restrict: 'A',
                require: 'ngModel',
                scope: {
                    precision: '@',
                    scale: '@'
                },
                link: linkFn
            };

            function linkFn (scope, element, attr, ngModel) {

                var decimalSeparator = $locale.NUMBER_FORMATS.DECIMAL_SEP || ',';
                var groupSeparator = $locale.NUMBER_FORMATS.GROUP_SEP || '.';

                var precision = scope.precision || 12;
                var scale = scope.scale || 2;

                var regex = '^-?[0-9]{1,'+(precision - scale)+'}\\'+decimalSeparator+'?([0-9]{1,'+scale+'})?';
                var regExp = new RegExp(regex);
                var lastCorrect = '';

                ngModel.$parsers.push(parse);
                ngModel.$formatters.push(format);

                // ação para quando saí do campo
                element.on('blur', formatEvent);
                // ação para quando entra no campo
                element.on('focus', formatEvent);

                /**
                 * Aplica a visualização de view
                 *
                 * @param  {[ngModel]} model
                 * @return {[string]}
                 */
                function toView(value) {
                    var valueLocale = value.toLocaleString(undefined, { minimumFractionDigits: scale })
                        .split(groupSeparator).join('');
                    var valueSplitted = valueLocale.split(decimalSeparator);

                    var decimalsInValue = '';
                    if (valueSplitted.length > 1) {
                        decimalsInValue = valueSplitted[1];
                    }

                    var diff = scale - decimalsInValue.length;
                    for (; diff > 0; diff--) {
                        decimalsInValue += '0';
                    }
                    return valueSplitted[0] + decimalSeparator + decimalsInValue;
                }

                /**
                 * Efetua o parse para o Model realizando as validações necessárias
                 *
                 * @param  {[type]} inputValue [description]
                 * @return {[type]}            [description]
                 */
                function parse(inputValue) {
                    if (inputValue === '' || inputValue === '-') {
                        lastCorrect = inputValue;
                        return inputValue;
                    }

                    var transformedInput = regExp.exec(inputValue);

                    if (transformedInput !== null) {
                        transformedInput = transformedInput[0];

                        var intPart = transformedInput.split(',')[0];
                        var intPartQtd = (precision - scale);

                        if (intPart[0] === '-') {
                            intPartQtd++;
                        }

                        if (intPart.length <= intPartQtd) {
                            lastCorrect = transformedInput;
                        } else {
                            transformedInput = lastCorrect;
                        }

                    } else {
                        transformedInput = lastCorrect;
                    }

                    if (transformedInput != inputValue) {
                        ngModel.$setViewValue(transformedInput);
                        ngModel.$render();
                    }
                    return toNumber(transformedInput);
                }

                /**
                 * Convert um valor numerico string de acordo com o locale para number
                 *
                 * @param  {[type]} value [description]
                 * @return {[type]}       [description]
                 */
                function toNumber(inputValue) {
                    if (!inputValue || typeof inputValue === 'number') {
                        return inputValue;
                    }
                    return Number(inputValue.split(groupSeparator).join('').replace(decimalSeparator, '.'));
                }

                /**
                 * Realiza a conversão do model para a view
                 *
                 * @return {[type]} [description]
                 */
                function format() {
                    if (!ngModel.$modelValue || ngModel.$invalid) {
                        return;
                    }
                    return toView(ngModel.$modelValue);
                }

                /**
                 *
                 * @return {[type]} [description]
                 */
                function formatEvent() {
                    if (!ngModel.$modelValue || ngModel.$invalid) {
                        return;
                    }
                    var viewVal = toView(ngModel.$modelValue);
                    if (viewVal) {
                        ngModel.$setViewValue(viewVal);
                        ngModel.$render();
                    }
                }
            }
        }
})();
