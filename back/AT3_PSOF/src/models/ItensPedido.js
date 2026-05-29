export class ItensPedido {
    #id;
    #pedidoId;
    #produtoId;
    #quantidade;
    #valorItem;

    //constructor
    constructor(pProdutoId, pQuantidade, pValorItem, pId, pPedidoId){
        this.produtoId = pProdutoId;
        this.#quantidade = pQuantidade;
        this.#valorItem = pValorItem;
        this.#id = pId;
        this.#pedidoId = pPedidoId;
    }

    //getters
    get id() {
        return this.#id;
    }
    get pedidoId() {
        return this.#pedidoId;
    }
    get produtoId() {
        return this.#produtoId;
    }
    get quantidade() {
        return this.#quantidade;
    }
    get valorItem() {
        return this.#valorItem;
    }

    //setters
    set id(value) {
        this.#validarId(value);
        this.#id=value;
    }
    set pedidoId(value) {
        this.#validarPedidoId(value);
        this.#pedidoId=value;
    }
    set produtoId(value) {
        this.#validarProdutoId(value);
        this.#produtoId=value;
    }
    set quantidade(value) {
        this.#validarQuantidade(value);
        this.#quantidade=value;
    }
    set valorItem(value) {
        this.#validarValorItem(value);
        this.#valorItem=value 
    }

    //metodos auxiliares
    #validarId(value) {
        if (value && value <= 0) {
            throw new Error("verifique o Id informado");
        }
    }
    #validarPedidoId(value) {
        if (!value || value <= 0) {
            throw new Error("verifique o Id do pedido informado");
        }
    }
    #validarProdutoId(value) {
        if (!value || value <= 0) {
            throw new Error("varifique o Id do produto informado");
        }
    }
    #validarQuantidade(value) {
        if (!value || value <= 0) {
            throw new Error("não foi possivel obter a quantidade");
        }
    }
    #validarValorItem(value) {
        if (!value || value <= 0) {
            throw new Error("informe um valorpara o item");
        }
    }
    static calcularSubTotalItens(itens){
        return(itens.reduce(
            (total, item) => total + (item.valorItem * item.quantidade), 0
        ));
    }

    //design pattern
    static criar(dados){
        return new ItensPedido(dados.produtoId, dados.quantidade, dados.valorItem, null, null);
    }
    static editar(dados, id){
        return new ItensPedido(dados.produtoId, dados.quantidade, dados.valorItem, id, dados.pedidoId);
    }
}
