import { Router } from "express";
import pedidoController from "../controllers/pedidoController.js";

//rotas
const pedidoRoutes = Router();

pedidoRoutes.post('/', pedidoController.criar);
pedidoRoutes.get('/', pedidoController.selecionar);
pedidoRoutes.post("/:pedidoId/itens", pedidoController.adicionarItem);
pedidoRoutes.put("/:itemId", pedidoController.editarItem);
pedidoRoutes.delete("/:Id", pedidoController.deletar);
pedidoRoutes.put("/:pedidoId/status", pedidoController.atualizarStatus);

export default pedidoRoutes;