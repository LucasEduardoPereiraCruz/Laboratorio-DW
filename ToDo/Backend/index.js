import express from "express"; 
import cors from "cors"; 
// Incluir as rotas 


const app = new express();
// comunicação entre front e back usar json 
app.use(express.json);
app.use(cors({
    credentials: true, 
    origin: "http://localhost:3000"
})); 

// Ligar express com as rotas
app.listen(5000); // Em qual porta o back vai rodar 
