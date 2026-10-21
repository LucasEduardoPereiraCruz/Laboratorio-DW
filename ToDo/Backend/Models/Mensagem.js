// DEFINE A ESTRUTURA DAS MENSAGENS ENVIADAS NO CHAT DE CADA TAREFA 
import mongoose from "../db/conn.js";
const {Schema} = mongoose;
const mensagemSchema = new Schema({
    tarefa:{ // Guarda o ID da tarefa à qual a mensagem pertence 
        type: Schema.Types.ObjectId, // Cria um relacionamento (vínculo) direto com a collection Tarefa.
        ref: "Tarefa", 
        required: true
    },
    remetente:{
        type:Schema.Types.ObjectId,
        ref: "Usuario", // Guarda o ID do usuário que mandou a mensagem, vinculando com a collection Usuario (ref: "Usuario").
        required: true,
    },
    texto:{ // O conteúdo escrito da mensagem (String, obrigatório, com trim: true para remover espaços em branco nas pontas).
        type: String,
        required:true,
        trim: true
    },
    lidaPor:[{ // Um array de IDs de usuários que serve para registrar quem já leu a mensagem.
        type: Schema.Types.ObjectId,
        ref: "Usuario",
    }]
},{timestamps:true}); // Cria automaticamente os campos createdAt (data de criação da mensagem) e updatedAt.
const Mensagem = mongoose.model('Mensagem', mensagemSchema);
export default Mensagem;

