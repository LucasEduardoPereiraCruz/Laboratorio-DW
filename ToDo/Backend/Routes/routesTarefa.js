import {Router} from "express"; 
import TarefaController from "../Controllers/TarefaController.js"

const routesTarefa = new Router()

routesTarefa.post("/create", TarefaController.Create); // Após o ponto temos que usar o verbo/requisição HTTP
routesTarefa.get("/getAll", TarefaController.getAll); 


export default routesTarefa; 

/*

=== VERBOS HTTP ===
- GET 
- POST
- DELETE
- PUT = ALTERAR TUDO 
- PATCH = ALTERAR PARTE

*/
