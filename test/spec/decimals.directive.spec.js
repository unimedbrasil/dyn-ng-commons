/**
 * Testes especificos para a diretiva dynDecimals
 */
describe('dynDecimals', function() {

    var scope;
    var elementDefault;
    var element4Dec;

    beforeEach(module("dyn.commons"));

    beforeEach(
        inject(function($rootScope) {
            scope = $rootScope.$new();
        })
    );

    beforeEach(
        inject(function($compile) {
            var elementFactoryDefault = $compile('<input type="number" ng-model="valor" dyn-decimals />');
            elementDefault = elementFactoryDefault(scope);

            var elementFactory4Dec = $compile('<input type="number" ng-model="valor" dyn-decimals decimals="4"/>');
            element4Dec = elementFactory4Dec(scope);

            scope.valor = 67.1;
            scope.$apply();
        })
    );

    it('quando o attr "decimals" não for informado, deve fixar com duas casas', function() {
        expect(elementDefault.val()).toEqual('67.10');
    });

    it('quando o attr "decimals" for informado, deve fixar respeitando esse valor', function() {
        expect(element4Dec.val()).toEqual('67.1000');
    });
});
