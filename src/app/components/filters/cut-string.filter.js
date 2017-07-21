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
