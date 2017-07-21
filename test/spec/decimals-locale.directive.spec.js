/**
 * Testes especificos para a diretiva dynDecimalsLocale
 */
describe('dynDecimalsLocale', function() {

    var scope;
    var element;
    var elementDefault;

    beforeEach(module("dyn.commons"));

    beforeEach(
        inject(function($rootScope) {
            scope = $rootScope.$new();
        })
    );

    beforeEach(
        inject(function($compile) {
            element = angular.element('<input type="text" ng-model="valor" dyn-decimals-locale />');
            elementDefault = $compile(element)(scope);
        })
    );
    
    it('deve chamar o evento focus', function() {
        spyOn(element[0], 'focus');
        element[0].focus();
        
        expect(element[0].focus).toHaveBeenCalled();
    });
    
    it('deve chamar o evento blur', function() {
        spyOn(element[0], 'blur');
        element[0].blur();
        
        expect(element[0].blur).toHaveBeenCalled();
    });

    it('deve converter de acordo com o locale', function() {
        scope.valor = 67.1;
        scope.$apply();

        expect(elementDefault.val()).toEqual('67,10');
    });

    it('deve converter de acordo com o locale e incluir zeros de acordo com as casas definidas', function() {
        scope.valor = 60000044;
        scope.$apply();

        expect(elementDefault.val()).toEqual('60000044,00');
    });

    it('deve converter de acordo com o locale permitindo valores negativos', function() {
        scope.valor = -1234569875.99;
        scope.$apply();

        expect(elementDefault.val()).toEqual('-1234569875,99');
    });
});
