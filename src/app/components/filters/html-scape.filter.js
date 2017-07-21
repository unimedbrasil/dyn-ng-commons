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
