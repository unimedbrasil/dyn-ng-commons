/**
 * Testes especificos para a diretiva dynDecimals
 */
describe('viewStorageService', function() {

    var dynViewStorage;

    beforeEach(module("dyn.commons"));

    beforeEach(
        inject(function(_dynViewStorage_) {
            dynViewStorage = _dynViewStorage_;

            dynViewStorage.set('view1', 'key1', { prop1: "teste1", prop2: "teste2" });
            dynViewStorage.set('view1', 'key2', { date: new Date() });
        })
    );

    it('deve gravar e retornar o objetos', function() {
        var obj = dynViewStorage.get('view1', 'key1');

        expect(obj.hasOwnProperty('prop1')).toBe(true);
        expect(obj.hasOwnProperty('prop2')).toBe(true);

        expect(obj.prop1).toBe('teste1');
        expect(obj.prop2).toBe('teste2');
    });

    it('deve retornar objetos tipo Date corretamente', function() {
        var obj = dynViewStorage.get('view1', 'key2');

        expect(obj.date instanceof Date).toBe(true);
    });

    it('deve validar a existencia da view com o hasView antes e depois de remover', function() {
        expect(dynViewStorage.hasView('view1')).toBe(true);
        dynViewStorage.removeView('view1');
        expect(dynViewStorage.hasView('view1')).toBe(false);
    });

    it('deve validar a existencia da chave com o has antes e depois de remover', function() {
        expect(dynViewStorage.has('view1', 'key1')).toBe(true);
        dynViewStorage.remove('view1', 'key1');
        expect(dynViewStorage.has('view1', 'key1')).toBe(false);
    });
});
