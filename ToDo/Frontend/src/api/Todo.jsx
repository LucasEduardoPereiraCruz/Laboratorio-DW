// IMPORTAÇÃO E CRIAÇÃO DA INSTÂNCIA DO AXIOS
   // Faz a importação da biblioteca Axios (usada para fazer requisições HTTP) e cria uma instância personalizada chamada api.
import axios from "axios";
const api = axios.create({
    baseURL:"http://localhost:5000/ToDo", // Endereço base do backend
    withCredentials: true, // Permite o envio de cookies e sessões, diz para o navegador incluir os tokens e cookies de sessão e autenticação. 
    headers:{
        "Content-Type": "application/json" // Define todos os dados enviados no corpo das requisições estarão no formato JSON
    }
})

// FUNÇÕES DE TAREFAS
export const  getTodos=()=>api.get("/getAll"); // Faz uma requisição do tipo GET para buscar todas as tarefas cadastradas
export const  createTodo=(payload)=>api.post("/create", payload); // Faz uma requisição do tipo POST para criar uma tarefa nova, enviando os dados dela (payload) no corpo da requisição para a rota /create
export const  updateSituacao=(id, situacao)=>api.put(`/updateSituacao/${id}`, {situacao}); // Faz uma requisição do tipo PUT para alterar o status da tarefa buscando pelo id, mandando o novo status no objeto { situacao }

// FUNÇÕES DE AUTENTICAÇÃO E USUÁRIOS
export const  createUser=(payload)=>api.post("/createUsuario", payload); // Envia os dados do cadastro (payload) via POST para o /createUsuario
export const  login=(payload)=>api.post("/login", payload);  // Envia as credenciais de acesso (payload) via POST para o /login (onde o back valida e devolve o cookie da sessão)
export const  logout=()=>api.post("/logout"); // Chama a rota POST /logout para limpar o cookie de autenticação do usuário
export const  reset=(payload)=>api.post("/resetPassword", payload); // Rotas para gerenciar a recuperação e redefinição de senha 
export const  forgot=(payload)=>api.post("/forgotPassword", payload); // Rotas para gerenciar a recuperação e redefinição de senha
export const  getProfile = () => api.get("/me"); // Faz um GET em /me para buscar os dados do usuário que está atualmente logado (através do token/cookie).
export const  getUsers = () => api.get("/getAllUsers"); // Busca todos os usuários cadastrados através da rota /getAllUsers

// FUNÇÃO DE HISTÓRICO DE CHAT E EXPORTAÇÃO PADRÃO 
export const  getChatTodoHistory = (tarefaId) => // Faz um GET passando o ID de uma tarefa específica (tarefaId) para resgatar o histórico de mensagens do chat daquela tarefa.
  api.get(`/getHistory/${tarefaId}`);


export default api; // Exporta a instância configurada do Axios para que outros arquivos do projeto possam importá-la e usá-la facilmente.