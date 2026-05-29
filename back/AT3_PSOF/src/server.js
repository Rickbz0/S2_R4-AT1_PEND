import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import produtoRoutes from './routes/produtoRoutes.js';
import pedidoRoutes from './routes/pedidoRoutes.js';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/produtos', produtoRoutes);
app.use('/pedidos', pedidoRoutes);

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Servidor rodando em: http://localhost:${process.env.SERVER_PORT}`);
});

