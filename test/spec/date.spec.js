/**
 * Testes especificos para a serviço de date.
 */
describe('dateService', function() {

    var LOCAL_DATE_TIME = '2016-07-26T14:26:58.67';
    var OBJ_DATE_TIME = new Date(2016, 7 - 1, 26, 14, 26, 58);

    var mDateHelper;

    beforeEach(module('dyn.commons'));

    beforeEach(
        inject(function(DateHelper) {
            mDateHelper = DateHelper;
            // Mock date timezone to GMT -03:00
            Date.prototype.getTimezoneOffset = function() {
                return 180;
            };
        })
    );

    it('quando o parâmetro "standardMode" do "parse" não for informado, não deve parsear um valor diferente do pattern', function() {
        var parsedValue = mDateHelper.parse(LOCAL_DATE_TIME, mDateHelper.ISO_LOCAL_DATE_TIME);
        expect(parsedValue).toEqual(LOCAL_DATE_TIME);
    });

    it('quando o parâmetro "standardMode" do "parse" for informado como true, deve parsear um valor diferente do pattern', function() {
        var parsedValue = mDateHelper.parse(LOCAL_DATE_TIME, mDateHelper.ISO_LOCAL_DATE_TIME, true);
        expect(parsedValue).toEqual(OBJ_DATE_TIME);
    });

    it('deve formatar corretamente com o pattern ISO_LOCAL_DATE', function() {
        var parsedValue = mDateHelper.format(OBJ_DATE_TIME, mDateHelper.ISO_LOCAL_DATE);
        expect(parsedValue).toEqual('2016-07-26');
    });

    it('deve formatar corretamente com o pattern ISO_LOCAL_DATE_TIME', function() {
        var parsedValue = mDateHelper.format(OBJ_DATE_TIME, mDateHelper.ISO_LOCAL_DATE_TIME);
        expect(parsedValue).toEqual('2016-07-26T14:26:58');
    });

    it('deve formatar corretamente com o pattern ISO_ZONED_DATE_TIME', function() {
        var parsedValue = mDateHelper.format(OBJ_DATE_TIME, mDateHelper.ISO_ZONED_DATE_TIME);
        expect(parsedValue).toEqual('2016-07-26T14:26:58-03:00');
    });

    it('deve formatar corretamente com o pattern ISO_RFC822_ZONED_DATE_TIME', function() {
        var parsedValue = mDateHelper.format(OBJ_DATE_TIME, mDateHelper.ISO_RFC822_ZONED_DATE_TIME);
        expect(parsedValue).toEqual('2016-07-26T14:26:58-0300');
    });
});
