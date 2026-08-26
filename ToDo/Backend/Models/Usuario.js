import mongoose from "../db/conn.js";
const {Schema} = mongoose;
const usuarioSchema = new Schema({
    nome:{
        type: String, 
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true, //Retira espaços que o usuário pode ter batido sem querer 
        lowercase: true, // Escrever em minusculo ou maiusculo dá certo 

    },
    senha:{
        type: String,
        required: true, 
        select: false, // Quando vc procura um usuário ele não trás a senha na consulta

    },
    resetToken:{
        type: String, 
        select: false, 

    }, 
    resetTokenExpiry:{
        type: Date, 
        select: false, 

    }
    
}, {timestamps: true}); // ele faz o controle de data - criadoem, alteradoem
const Usuario = mongoose.model('Usuario', usuarioSchema); 
export default Usuario;