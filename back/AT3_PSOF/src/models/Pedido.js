
export class Pedido {
    #id;
    #clienteId;
    #subTotal;
    #status;
    #dataCad;

    //constructor
    constructor(pClienteId, pSubTotal, pStatus, pId){
        this.#clienteId = pClienteId;
        this.#subTotal = pSubTotal;
        this.#status = pStatus;
        this.#id = pId;
    }

    //getters
    get id() {
        return this.#id;
    }
    get clienteId() {
        return this.#clienteId;
    }
    get subTotal() {
        return this.#subTotal;
    }
    get status() {
        return this.#status;
    }
    //setters
    set id(value) {
        this.#validarId(value);
        this.#id=value;
    }
    set clienteId(value) {
        this.#validarClienteId(value);
        this.#clienteId=value;
    }
    set subTotal(value) {
        this.#validarSubTotal(value);
        this.#subTotal=value;
    }
    set status(value) {
        this.#status=value;
    }

    //metodos auxiliares
    #validarId(value) {
        if (value && value <= 0) {
            throw new Error("verifique o Id informado");
        }
    }
    #validarClienteId(value) {
        if (value && value <= 0) {
            throw new Error("verifique o Id do clienteinformado");
        }
    }
    #validarSubTotal(value) {
        if (!value || value <= 0) {
            throw new Error("não foi possivel obter o subtotal");
        }
    }
    //design pattern
    static criar(dados){
        return new Pedido(dados.clienteId, dados.subTotal, dados.status, null);
    }
    static editar(dados, id){
        return new Pedido(dados.clienteId, dados.subTotal, dados.status, id);
    }
}

