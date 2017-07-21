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
