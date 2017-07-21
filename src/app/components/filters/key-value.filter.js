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
