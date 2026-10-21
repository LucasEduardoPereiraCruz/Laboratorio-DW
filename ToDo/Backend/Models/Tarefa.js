// DEFINE OS DADOS DE UMA TAREFA NO SISTEMA
import mongoose from "../db/conn.js";
const {Schema} = mongoose;
const tarefaSchema = new Schema({
    titulo:{
        type: String,
        required: true,
    },
    descricao:{
        type:String,
        required: true,
    },
    dataLimite:{
        type:Date,
        required:true,
    },
    //TAREFA DA VÂNIA   
    // Situação da tarefa, toda tarefa começa como pendente e depois será permitido finalizar ou cancelar ela. \\
    situacao:{
        type:String,
        enum: ["PENDENTE", "CANCELADA", "FINALIZADA"],
        default: "PENDENTE",
        required:true,
    },
    criadoPor:{ // ID do usuário dono/criador da tarefa (vinculado ao Usuario).
        type: Schema.Types.ObjectId,
        ref: "Usuario",
        required: true,
    },
    participam:[{ // Um array de IDs de outros usuários convidados a participar/colaborar na tarefa.
        type: Schema.Types.ObjectId,
        ref:"Usuario"
    }]
},{timestamps:true}); // Gera automaticamente as datas de criação e atualização da tarefa.
const Tarefa = mongoose.model('Tarefa', tarefaSchema);
export default Tarefa;