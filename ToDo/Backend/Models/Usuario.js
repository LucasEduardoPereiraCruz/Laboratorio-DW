// DEFINE A ESTRUTURA DE CADASTRO DOS USUÁRIOS NO SISTEMA
import mongoose from "../db/conn.js";
const {Schema} = mongoose;
const usuarioSchema = new Schema({
    nome:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type:String,
        required: true,
        unique: true, // MongoDB não permite que dois usuários tenham o mesmo e-mail 
        trim:true,
        lowercase:true // Salva sempre em letras minúsculas para evitar problemas de maiúsculas/minúsculas no login.
    },
    // Diz ao Mongoose para esconder a senha por padrão quando fizermos consultas (ex: Usuario.find()),
    // evitando que a senha viaje acidentalmente nas respostas da API. Para usá-la (como no Login), precisamos forçar com .select('+senha').
    senha:{
        type:String,
        required:true,
        select:false
    },
    // Armazenam temporariamente o token criptografado e a data de validade (1 hora) para a recuperação de senha.
    // Também possuem select: false por segurança. (ISSO É PARA OS DOIS resetToken E resetTokenExpiry)
    resetToken:{
        type:String,
        select:false,
    },
    resetTokenExpiry:{
        type:Date,
        select:false,
    }
},{timestamps:true}); // Registra quando o usuário foi criado e atualizado
const Usuario = mongoose.model('Usuario', usuarioSchema);
export default Usuario;