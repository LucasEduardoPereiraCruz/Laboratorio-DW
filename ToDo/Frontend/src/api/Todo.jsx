import axios from "axios"; 
const api = axios.create({
    baseURL:"http://localhost:5000/ToDo",
    headers:{
        "Content-Type": "application/json"
    }
})

export const getTodos=()=>api.get("/getAll");

export const CreateTodo=(payload)=>api.post("/Create", payload);

export default api; 

