import {Router} from "express"; 
import UsuarioController from "../Controllers/UsuarioController.js"

const routesUsuario = new Router()

routesUsuario.post("/createUsuario", UsuarioController.Create); // Após o ponto temos que usar o verbo/requisição HTTP
export default routesUsuario; 