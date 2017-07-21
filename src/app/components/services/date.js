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
