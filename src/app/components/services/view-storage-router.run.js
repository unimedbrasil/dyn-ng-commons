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
