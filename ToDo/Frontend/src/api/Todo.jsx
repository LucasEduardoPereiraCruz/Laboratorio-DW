// Arquivos de rotas do backend 
import axios from "axios";
const api = axios.create({
    baseURL:"http://localhost:5000/ToDo",
    withCredentials: true, // Permite o envio de cookies e sessões
    headers:{
        "Content-Type": "application/json"
    }
})
export const  getTodos=()=>api.get("/getAll");
export const  createTodo=(payload)=>api.post("/createTarefa", payload);
export const  createUser=(payload)=>api.post("/createUsuario", payload); // Criar pag no front - TAREFA!! 
export const  login=(payload)=>api.post("/login", payload);
export const  logout=()=>api.post("/logout"); // Está no app.jsx
export const  reset=(payload)=>api.post("/resetPassword", payload); // Criar pag no front - TAREFA!! 
export const  forgot=(payload)=>api.post("/forgotPassword", payload);
export const  getProfile = () => api.get("/me");
export const  getUsers = () => api.get("/getAllUsers");

export default api;