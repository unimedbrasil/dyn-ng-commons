# Dynamix Angular Commons

## Pacotes requeridos
- moment e moment-timezone são requeridos para funcionamento do serviço de datas;
- ngstorage é requerido para o serviço de guarda de informações para view 'dynViewStorage';

## Recursos

#### JS
- Serviço para formatação de datas;
- Diretivas para input de números decimais;
- Diretiva para focus;
- Diretiva para botão de loading;
- Directiva para detectar o evento de Enter em inputs;
- Serviço para guardar informações usando webstorage e baseado em views.

#### CSS
- Helper com algumas cores aplicadas em links e texto;
- Estilos para tornar sensível elementos internos às validações do bootstrap (has-(error|warning|success))
- Workaround para tratamento de um bug com IE10;

## Uso:

### dynViewStorage

#### Intro

O serviço é baseado em agrupamentos, chamados de VIEW, onde todo item guardado possui uma chave e identificador de view associado.

- Exemplo:

```javascript
// gravando valor
dynViewStorage.set(VIEW_ID, key, value);

// buscando pela chave
dynViewStorage.get(VIEW_ID, key);

// removendo pela chave
dynViewStorage.remove(VIEW_ID, key);

// removendo a view completamente
dynViewStorage.remove(VIEW_ID, key);
```

#### Limpeza automática

A limpeza é feita através de um plugin para o ui-router, onde algumas configurações se fazem necessária para o state desejado.

Para a configuração, deve-se informar os estados ligados ao estado atual, e pode-se informar as views mapeadas*.

Durante  a troca de estados será vericado se o estado origem está ligado ao estado destino, caso não, a limpeza das views mapeadas será feita. Caso os estados estejam ligados, o estado origem será mantido como estado ativo e passará pela mesma validação a cada troca de estado, sendo considerada como estado origem.

- Exemplo:

```javascript
.state('estado.qualquer', {
    // algum codigo aqui
    dynViewStorage: {
        linkedStates: [
            'outro.estado'
        ],
        viewsMapped: [
            'alguma.view',
            'alguma.outra.view'
        ]
    }
    // talvez algum codigo aqui
})
```
*caso não sejam informadas as views mapeadas, o nome da rota atual será considerada como nome da view.*

## Deploy
bower register dyn-ng-commons {{repositorio git}}
