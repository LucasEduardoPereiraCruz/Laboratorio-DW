// ESSE CONTROLLER GERENCIA O HISTÓRICO DE CONVERSAS DO CHAT VIA HTTP E O ENVIO DE MENSAGENS EM TEMPO REAL VIA SOCKET.IO 
import Mensagem from "../Models/Mensagem.js";
export default class ChatController{
    // Busca todas as mensagens salvas no banco de dados de uma determinada tarefa
    static async getHistory(req, res){
        try {
            const {tarefaId} = req.params; // Extrai o ID da tarefa dos parâmetros da URL (req.params)
            const mensagens = await Mensagem.find({tarefa:tarefaId}) // Executa a consulta 
                .populate("remetente", "nome email") // Usado para substituir o ID do remetente pelos dados reais do usuário (nome e e-mail)
                .sort({createdAt: 1}); // Ordena por data de criação CRESCENTE, trás da mensagem mais antiga para a mais recente  
            return res.status(200).json({mensagens}); // Retorna o array de mensagens com status 200 OK
        } catch (error) {
            return res.status(500).json({message:"Problema ao buscar o histórico das mensagens", error}); // Retorna um erro caso não encontre a mensagem 
        }
    }

    // Salvar uma nova mensagem no banco e transmiti-la via WebSocket para todos os conectados na sala daquela tarefa    
    static async sendSaveMessage(io, socket, data){
        try {
            const {tarefaId, remetenteId, texto} =  data; // Recebe o evento do SOCKET 
            const novaMensagem = await Mensagem.create({ // Cria e salva o registro no banco 
                tarefa: tarefaId,
                remetente: remetenteId,
                texto
            });
            const mensagemPopulada = await Mensagem.findById(novaMensagem._id)
                .populate("remetente", "nome email"); // Rebusca a mensagem criada executando para anexar o nome e e-mail de quem enviou.
            io.to(`tarefa_${tarefaId}`).emit("receive_message", mensagemPopulada); // Transmite a mensagem em tempo real para a "sala" da tarefa usando

        } catch (error) {
            console.error("Erro ao salvar/enviar mensagem no socket:", error);
            socket.emit("chat_error",{message: "Erro ao processar mensagem"}); // Em caso de falha, emite um evento de erro direto para o cliente 
        }
    }
}//fim da classe