import ChatController from "../Controllers/ChatController.js";

export default function registerChatSocket(io, socket){
    // Entrar em uma sala específica (de uma tarefa)
    socket.on("Join_task", (tarefaId)=>{
        socket.join(`tarefa_${tarefaId}`), 
        console.log(`socket ${socket.id} entrou no chat da terafa_ ${tarefaId}`)
    }); 

    // Enviar mensagem 
    socket.on("send_message", (data)=>{
        ChatController.sendSaveMessage(io, socket, data);
    });
    
    //Sair do chat 
    socket.on("leave_task", (tarefaId)=>{
        socket.leave(`tarefa_${tarefaId}`);
    });
}