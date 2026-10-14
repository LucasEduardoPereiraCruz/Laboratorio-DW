import "dotenv/config"; 
import express from "express";
import cors from "cors"; 
import cookieParse from "cookie-parser"; 

// Importar as rotas 
const app = express(); 
const PORT = process.env.PORT || 5000; 
app.use(cors({
    origin: process.env.FRONTEND_URL, 
    credentials: true, 
})); 
app.use(express.json()); 
app.use(cookieParse()); 

// Incluir Rotas
app.listen(PORT, ()=>{
    console.log `Servidor rodando na porta ${PORT}`;
}); 