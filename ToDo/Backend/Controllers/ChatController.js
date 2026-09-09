import Mensagem from "../Models/Mensagem.js"; 

export default class ChatController{
    static async getHistory(req, res){
        try {
            const {tarefaId} = req.params; 
            const mensagens = await Mensagem.find({Tarefa:tarefaId})
                .populate("remetente", "nome email") // Tipo um JOIN 
                .sort({createAt: 1});
            return res.status(200).json({mensagens})    
        } catch (error) {
            return res.status(500).json({message:"Problema ao buscar o histórico de mensagens", error});
        }
    } // fim do getHistory
    static async sendSaveMessage(io, socket, data){
        try {
            const {tarefaId, remetente, texto} = data; 
            const novaMensagem = await Mensagem.create({Tarefa:tarefaId, remetente:remetenteId, texto}); 
            const mensagemPopulada = await Mensagem.findById(novaMensagem._id)
                .populate("remetente", "nome email"); 
            io.to(`tarefa_${tarefaId}`).emit("receive_message", mensagemPopulada)    
        } catch (error) {
            console.error("Erro ao salvar/enviar mensagem no socket", error);
            socket.emit("chat_error", {message: "Erro ao processar mensagem"});
        }
    }
} // fim da classe 