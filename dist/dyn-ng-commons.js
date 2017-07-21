(function() {
    'use strict';

    angular
        .module('dyn.commons', [
            'ngStorage'
        ]);
})();

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

(function() {
    'use strict';

    angular
        .module('dyn.commons')
        .service('DateHelper', DateHelper)
        .run(configureDateHelper);

    DateHelper.$inject = [];

    /* @ngInject */
    function DateHelper() {

        var _this = this;

        // Attributes
        _this.TIMEZONE_AMERICA_SAO_PAULO = 'America/Sao_Paulo';
        _this.ISO8601 = 'YYYY-MM-DDTHH:mmZZ'; //@deprecated
        _this.ISO_LOCAL_DATE = 'YYYY-MM-DD';
        _this.ISO_LOCAL_DATE_TIME = 'YYYY-MM-DDTHH:mm:ss';
        _this.ISO_ZONED_DATE_TIME = 'YYYY-MM-DDTHH:mm:ssZ';
        _this.ISO_RFC822_ZONED_DATE_TIME = 'YYYY-MM-DDTHH:mm:ssZZ';

        // Public methods
        _this.parse = parse;
        _this.format = format;
        _this.parseObjectDateStringsToDates = parseObjectDateStringsToDates;
        _this.setEndOfDay = setEndOfDay;

        /**
         * Efetua o parser da data no padrão especificado.
         * @param  {String}     value           Valor da data em string
         * @param  {String}     format          Formato a data.
         * @param  {Boolean}    standardMode    Indica se a validação será em modo standard ou strinct.
         *                                      Por padrão, a validação usará o modo strict onde o pattern
         *                                      deve estar exatamente igual ao valor a ser parseado.
         *
         * @return {Date}                       Objeto Date criado.
         */
        function parse(value, format, standardMode) {
            var strictMode = standardMode ? false : true;
            if (typeof value === 'string' && moment(value, format, strictMode).isValid()) {
                return moment(value, format).toDate();
            }
            return value;
        }

        /**
         * Efetua o format da data no padrão especificado.
         * @param  {Date}   value  Objeto Date a ser formatado
         * @param  {String} format Formato a data.
         * @return {String}        String formatada no padrão especificado.
         */
        function format(value, format) {
            if (Object.prototype.toString.call(value) === '[object Date]') {
                return moment(value).format(format);
            } else if (moment.isMoment(value)) {
                return value.format(format);
            }
        }

        /**
         * Varre o objeto a procura de propriedades no formato String que sejam datas no padrão ISO 8601.
         * Uma vez encontrada, a string é convertida para um objeto Date.
         * @param  {Object} input  Objeto com as propriedades a serem verificadas.
         */
        function parseObjectDateStringsToDates(input) {
            parseObjectDateStringsWithFormatToDates(input, _this.TIMEZONE_AMERICA_SAO_PAULO, _this.FORMAT_ISO8601);
        }

        /**
         * Varre o objeto a procura de propriedades no formato String que sejam datas com o formato especificado.
         * Uma vez encontrada, a string é convertida para um objeto Date.
         * @param  {Object} input       Objeto com as propriedades a serem verificadas.
         * @param  {String} timezone    Timezone a ser considerada na conversão.
         * @param  {String} format      Pattern da data a ser procurada e convertida.
         */
        function parseObjectDateStringsWithFormatToDates(input, timezone, format) {
            // Ignore things that aren't objects.
            if (typeof input !== 'object') return input;
            for (var key in input) {
                // Check angular $state objects
                if (!input.hasOwnProperty(key) || key.charAt(0) === '$') continue;
                var value = input[key];
                // Check if string is in date format
                if (typeof value === 'string' && moment(value, format, true).isValid()) {
                    input[key] = moment(value, format).tz(timezone).toDate();
                } else if (typeof value === 'object') {
                    parseObjectDateStringsWithFormatToDates(value, timezone, format);
                }
            }
        }

        /**
         * Retorna a data atual setada para o final do dia
         *
         * @param {[type]} date [description]
         */
        function setEndOfDay(date) {
            var nDate = new Date(date.getTime());
            nDate.setHours(23, 59, 59, 999);
            return nDate;
        }
    }

    /**
     * Injeta as dependeicas.
     * @type {Array}
     */
    configureDateHelper.$inject = ['DateHelper'];

    /**
     * Configura padrões de data que serão usados em todo o sistema.
     * @TODO Fazer alguma configuração de formato, se vai ser em UTC ou não.
     */
    function configureDateHelper(DateHelper) {

        // Override das datas do Moment em JSON.
        moment.fn.toJSON = function() {
            return this.utc().format(DateHelper.FORMAT_ISO8601);
        };

        // Override das datas do Javascript em JSON.
        Date.prototype.toJSON = function() {
            return moment(this).utc().format(DateHelper.FORMAT_ISO8601);
        };
    }

})();

(function() {
    'use strict';

    angular
        .module('dyn.commons')
        .run(uiRouterPlugin);

    uiRouterPlugin.$inject = ['$rootScope', 'dynViewStorage'];

    /**
     *
     * @param  {[type]} $rootScope [description]
     * @return {[type]}            [description]
     */
    function uiRouterPlugin($rootScope, dynViewStorage) {

        var statesActives = [];

        _run();

        function _run() {
            $rootScope.$on('$stateChangeStart', storageCleaner);
        }

        /**
         * Efetua a limpeza das view's de acordo com o configurado na rota
         *
         * @param  {[Object]} event      [description]
         * @param  {[Object]} toState    [description]
         * @param  {[Object]} toParams   [description]
         * @param  {[Object]} fromState  [description]
         * @param  {[Object]} fromParams [description]
         * @param  {[Object]} options    [description]
         * @return {[void]}
         */
        function storageCleaner(event, toState, toParams, fromState, fromParams, options) {
            var viewStorageConfig = fromState.dynViewStorage;

            if (!viewStorageConfig || !viewStorageConfig.linkedStates) {
                _clearActives();
                return;
            }

            var cleaned = _storageCleaner(fromState);

            _clearActives();

            if (!cleaned && !existsActiveState(fromState.name)) {
                statesActives.push(fromState);
            }

            /**
             * Realiza a limpeza, caso necessário, e retorna se foi ou não
             * realiada.
             *
             * @param  {[type]} state     [description]
             * @return {[type]}           [description]
             */
            function _storageCleaner(fromState) {
                var viewStorageConfig = fromState.dynViewStorage;

                var isLinked = viewStorageConfig.linkedStates.some(function(linkedState) {
                    return linkedState === toState.name;
                });

                if (isLinked || fromState.name === toState.name) {
                    return false;
                }

                if (viewStorageConfig.viewsMapped) {
                    viewStorageConfig.viewsMapped.forEach(dynViewStorage.removeView);
                } else {
                    dynViewStorage.removeView(fromState.name);
                }

                return true;
            }

            /**
             * Efetua a limpeza, caso necessário, de estados que ainda ativos
             *
             * @return {[type]} [description]
             */
            function _clearActives() {
                statesActives.forEach(function(state) {
                    if (_storageCleaner(state)) {
                        removeActiveState(state.name);
                    }
                });
            }
        }

       /**
        * Remove o state da tabela de ativos consideando o nome do state
        *
        * @param  {[type]} stateName [description]
        * @return {[type]}           [description]
        */
        function removeActiveState(stateName) {
            statesActives.some(function(state, index) {
                if (state.name === stateName) {
                    statesActives.splice(index, 1);
                    return true;
                }
            });
        }

        /**
        * Remove o state da tabela de ativos consideando o nome do state
        *
        * @param  {[type]} stateName [description]
        * @return {[type]}           [description]
        */
        function existsActiveState(stateName) {
            return statesActives.some(function(state) {
                return state.name === stateName;
            });
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('dyn.commons')
        .factory('dynViewStorage', dynViewStorage);

    dynViewStorage.$inject = ['$sessionStorage', 'DateHelper'];

    /**
     *
     * @param  {[type]} $sessionStorage [description]
     * @param  {[type]} DateHelper      [description]
     * @return {[type]}                 [description]
     */
    function dynViewStorage($sessionStorage, DateHelper) {

        return {
            set: set,
            get: get,
            remove: remove,
            has: has,
            hasView: hasView,
            removeView: removeView
        };

        function set(viewId, key, value) {
            var view = getView(viewId) || {};
            view[key] = value;
            $sessionStorage[viewId] = view;
        }

        function get(viewId, key) {
            if (!hasView(viewId)) {
                return;
            }
            return getView(viewId)[key];
        }

        function has(viewId, key) {
            var valOfKey = get(viewId, key);
            return valOfKey !== undefined && valOfKey !== null;
        }

        function hasView(viewId) {
            var view = getView(viewId);
            return view !== undefined && view !== null;
        }

        function remove(viewId, key) {
            return set(viewId, key, undefined);
        }

        function removeView(viewId) {
            $sessionStorage[viewId] = null;
        }

        /**
         * Retorna o objeto que represeta a view dentro do sessionStorage
         *
         * @param  {[type]} viewId [description]
         * @return {[type]}        [description]
         */
        function getView(viewId) {
            if (!viewId) {
                throw new Error('viewId não possui um valor válido: ' + viewId);
            }
            return $sessionStorage[viewId];
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('dyn.commons')
        .filter('cutString', cutString);

    /**
     * Corta a string de acordo com o limit informado e aplica a conclusão desejada
     *
     * @return {[type]} [description]
     */
    function cutString() {
        return fn;

        function fn(val, limit, conclusion) {
            if (!val || !limit) return '';
            if (val.length <= limit) {
                return val;
            }
            return val.substring(0, limit) + (conclusion || ' ...');
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('dyn.commons')
        .filter('htmlScape', htmlScape);

    /**
     * Replica os scapes vindos do servidor para padrão html
     *
     * @return {[type]} [description]
     */
    function htmlScape() {
        var entityMap = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': '&quot;',
            "'": '&#39;',
            "/": '&#x2F;'
        };
        return fn;

        function fn(string) {
            return String(string).replace(/[&<>"'\/]/g, function (s) {
                return entityMap[s];
            });
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('dyn.commons')
        .filter('keyValue', keyValueFilter);

    /**
     * Cria o filtro para unimed
     * @return {[type]} [description]
     */
    function keyValueFilter() {
        return fn;

        /**
         *
         *
         * @param  {[Object]}   objecto         objeto complexo
         * @param  {[String]}   keyParam        campo que representa a 'key'
         * @param  {[String]}   valueParam      campo que representa o 'value'
         * @param  {[String]}   whenEmptyParam  valor retornado quando vazio
         * @return {[String]}                   resultado no formato 'key - value'
         */
        function fn(obj, keyParam, valueParam, whenEmptyParam) {

            var whenEmpty = whenEmptyParam;
            if (whenEmpty === undefined || whenEmpty === null) {
                whenEmpty = '-';
            }

            if (!obj) {
                return whenEmpty;
            }

            var key = keyParam || 'key';
            var value = valueParam || 'value';

            var resultArr = [];
            if (obj[key]) {
                resultArr.push(obj[key]);
            }
            if (obj[value]) {
                resultArr.push(obj[value]);
            }
            return resultArr.join(' - ') || whenEmpty;
        }
    }
})();
