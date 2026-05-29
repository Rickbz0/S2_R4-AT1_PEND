import pedidoRepository from "../repositories/pedidoRepository.js";
import { ItensPedido } from "../models/ItensPedido.js";
import { Pedido } from "../models/pedido.js";
import { statusPed } from "../enums/statusPedido.js";

const pedidoController = {

    criar: async (req, res) => {
        try {
            let { clienteId, itens = [] } = req.body;

            if (!clienteId) {
                return res.status(400).json({
                    error: "clienteId é obrigatório"
                });
            }

            if (!Array.isArray(itens)) { // verifica se uma variavelrealmente é um array
                itens = [];
            }

            const pedido = Pedido.criar({
                clienteId,
                status: statusPed.ABERTO
            });

            const result = await pedidoRepository.criar(pedido, itens);

            return res.status(201).json(result);

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                message: "ocorreu um erro",
                error: error.message
            });
        }
    },

    selecionar: async (req, res) => {
        try {
            const { idPedido } = req.params;

            const pedidos = await pedidoRepository.selecionar(idPedido);

            return res.json(pedidos);

        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    //adiciona um item a um pedido
    adicionarItem: async (req, res) => {
        try {
            const { pedidoId } = req.params;
            const { produtoId, quantidade } = req.body;

            if (!produtoId || !quantidade) {
                return res.status(400).json({ error: "produtoId e quantidade são obrigatórios" });
            }

            const item = ItensPedido.criar({ produtoId, quantidade });

            await pedidoRepository.adicionarItem(pedidoId, item);

            const itens = await pedidoRepository.buscarItensPorPedido(pedidoId);
            const subTotal = ItensPedido.calcularSubTotalItens(itens);

            await pedidoRepository.atualizarSubtotal(pedidoId, subTotal);

            return res.json({ message: "Item adicionado com sucesso", subTotal });

        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    //edita itens de um pedido
    editarItem: async (req, res) => {
        try {
            const { pedidoId, itemId } = req.params;
            const { quantidade } = req.body;

            if (!quantidade) {
                return res.status(400).json({ error: "quantidade é obrigatória" });
            }

            await pedidoRepository.editarItem(itemId, quantidade);

            const itens = await pedidoRepository.buscarItensPorPedido(pedidoId);
            const subTotal = ItensPedido.calcularSubTotalItens(itens);

            await pedidoRepository.atualizarSubtotal(pedidoId, subTotal);

            return res.json({ message: "Item atualizado", subTotal });

        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    deletar: async (req, res) => {
        try {
            const id = req.params.id;
          await pedidoRepository.deletar(id);
          
            return res.json({ message: "Pedido deletado com sucesso" });

        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    //atualização do status do pedido
    atualizarStatus: async (req, res) => {

        try {
            const { pedidoId } = req.params;
            const { status } = req.body;

            if (!status) {
                return res.status(400).json({
                    error: "status é obrigatório"
                });
            }

            const statusValidos = Object.values(statusPed);
            // Object.values = pega todos os valores de um objeto e transforma em um array

            if (!statusValidos.includes(status)) { // includes verifica se algo existe dentro de um array
                return res.status(400).json({
                    error: "status inválido"
                });
            }

            await pedidoRepository.atualizarStatus(pedidoId, status);

            return res.json({
                message: "Status atualizado com sucesso"
            });

        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    }
};

export default pedidoController;