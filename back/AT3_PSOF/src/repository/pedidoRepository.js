import { connection } from "../config/database.js";

const pedidoRepository = {

    calcularSubTotal: async (conn, itens = []) => {

        let subTotal = 0;

        for (const item of itens) { //for...of, pega todos os itens do pedido, seu valores e calcula o subTotal 

            //produtoRows utilizado para guardar o resultado obtido do BD
            const [produtoRows] = await conn.execute(
                'SELECT valor FROM produtos WHERE idProduto = ?',
                [item.produtoId]
            );

            if (!produtoRows || produtoRows.length === 0) {
                throw new Error(`Produto ${item.produtoId} não encontrado`);
            }

            const valorItem = produtoRows[0].valor;
            const quantidade = item.quantidade ?? 0;

            subTotal += valorItem * quantidade;
        }

        return subTotal;
    },

    criarPedido: async (conn, pedido, subTotal) => {

        const sqlPed = `
            INSERT INTO pedidos (clienteId, SubTotal, Status)
            VALUES (?, ?, ?)
        `;

        const valuesPed = [
            pedido.clienteId ?? null,
            subTotal ?? 0,
            pedido.status ?? 'ABERTO'
        ];

        const [rowsPed] = await conn.execute(sqlPed, valuesPed);

        return rowsPed.insertId;
    },

    criar: async (pedido, itens) => {

        const conn = await connection.getConnection();

        try {

            await conn.beginTransaction();

            itens = itens || [];

            // calcula subtotal
            const subTotal = await pedidoRepository.calcularSubTotal(
                conn,
                itens
            );

            // cria pedido
            const pedidoId = await pedidoRepository.criarPedido(
                conn,
                pedido,
                subTotal
            );

            // cria itens do pedido
            for (const item of itens) {

                const [produtoRows] = await conn.execute(
                    'SELECT valor FROM produtos WHERE idProduto = ?',
                    [item.produtoId]
                );

                if (!produtoRows || produtoRows.length === 0) {
                    throw new Error(`Produto ${item.produtoId} não encontrado`);
                }

                const valorItem = produtoRows[0].valor;

                const sqlItens = `
                    INSERT INTO itens_pedidos
                    (PedidoId, ProdutoId, Quantidade, ValorItem)
                    VALUES (?, ?, ?, ?)
                `;

                await conn.execute(sqlItens, [
                    pedidoId,
                    item.produtoId,
                    item.quantidade ?? 0,
                    valorItem
                ]);
            }

            await conn.commit();

            return {
                pedidoId,
                subTotal
            };

        } catch (error) {

            await conn.rollback();
            throw error;

        } finally {

            conn.release();
        }
    },

    selecionar: async (idPedido) => {
        const conn = await connection.getConnection();

        try {
            let sql = `
            SELECT *
            FROM pedidos AS p
            INNER JOIN clientes AS c
                ON p.ClienteId = c.idCliente  
            LEFT JOIN itens_pedidos AS i
                ON i.PedidoId = p.id
        `;

            const params = [];

            if (idPedido) {
                sql = sql + " WHERE p.id = ?";
                params.push(idPedido);
            }

            const [rows] = await conn.execute(sql, params);

            return rows;

        } finally {
            conn.release();
        }
    },

    adicionarItem: async (pedidoId, item) => {
        const conn = await connection.getConnection();

        try {
            await conn.beginTransaction();

            const [produtoRows] = await conn.execute(
                'SELECT valor FROM produtos WHERE idProduto = ?',
                [item.produtoId]
            );

            if (!produtoRows || produtoRows.length === 0) {
                throw new Error(`Produto ${item.produtoId} não encontrado`);
            }

            const valorItem = produtoRows[0].valor;

            const sql = `
                INSERT INTO itens_pedidos
                (PedidoId, ProdutoId, Quantidade, ValorItem)
                VALUES (?, ?, ?, ?)
            `;

            await conn.execute(sql, [
                pedidoId,
                item.produtoId,
                item.quantidade ?? 0,
                valorItem
            ]);

            await conn.commit();

        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    },

    editar: async (pedidoId, status) => {
        const conn = await connection.getConnection();

        try {
            await conn.beginTransaction();

            const sql = `UPDATE pedidos SET Status = ? WHERE id = ?`;

            await conn.execute(sql, [status, pedidoId]);

            await conn.commit();

            return { message: "Pedido atualizado com sucesso" };

        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    },

    buscarPorId: async (id) => {
        const sql = 'SELECT * FROM pedidos WHERE id = ?';
        const [rows] = await connection.execute(sql, [id]);

        return rows.length > 0 ? rows[0] : null;
    },

    buscarItensPorPedido: async (pedidoId) => {
        const sql = `SELECT * FROM itens_pedidos WHERE PedidoId = ?`;
        const [rows] = await connection.execute(sql, [pedidoId]);
        return rows;
    },

    deletar: async (pedidoId) => {
        const conn = await connection.getConnection();

        try {
            await conn.beginTransaction();

            await conn.execute(
                "DELETE FROM itens_pedido WHERE PedidoId = ?",
                [pedidoId]
            );

            // remove pedidos
            await conn.execute(
                "DELETE FROM pedidos WHERE id = ?",
                [pedidoId]
            );

            await conn.commit();

        } catch (error) {
            await conn.rollback();
            throw error;

        } finally {
            conn.release();
        }
    },

    //atualização automatica do subtotal do pedido
    atualizarSubTotal: async (pedidoId, subTotal) => {
        const sql = `
        UPDATE pedidos
        SET SubTotal = ?
        WHERE idPedido = ?
    `;
        await connection.execute(sql, [subTotal, pedidoId]);
    },

    //atualização do status do pedido
    atualizarStatus: async (pedidoId, status) => {

        const sql = `
        UPDATE pedidos
        SET Status = ?
        WHERE idPedido = ?
    `;
        await connection.execute(sql, [status, pedidoId]);
    },
};

export default pedidoRepository;

