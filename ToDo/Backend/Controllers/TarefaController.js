// ESTE CONTROLLER LIDA COM O CICLO DE VIDA DAS TAREFAS (CRIAÇÃO, LISTAGEM E ALTERAÇÃO DA SITUAÇÃO)
import Tarefa from "../Models/Tarefa.js";
import {Types} from "mongoose";
export default class TarefaController{
    // Cadastrar uma nova tarefa associada ao usuário autenticado 
    static async Create(req, res){
        const{titulo, descricao, dataLimite, situacao, participam} = req.body; // Extrai titulo, descricao... do corpo da requisição (req.body)
        const usuarioLogado = req.user.id; // Obtém o ID do usuário logado a partir do Middleware de Autenticação
        if(!titulo || !descricao || !dataLimite || !situacao)
        {
            return res.status(422).json({message: "Todos os dados são obrigatórios"}); // Checa se os campos obrigatórios estão preenchidos, caso contrário ele retorna (422)
        }
        try {
            const tarefa = new Tarefa({
                titulo,
                descricao,
                dataLimite,
                situacao,
                criadoPor: usuarioLogado,
                participam: Array.isArray(participam)? 
                participam : (participam ? [participam] : []) // garante que ele sempre seja armazenado como um Array de IDs, mesmo que venha apenas um elemento ou nada.

            });
            const novaTarefa = await tarefa.save(); // Cria e salva a instância de Tarefa no banco com criadoPor: usuarioLogado.
            const tarefaPopulada = await Tarefa.findById(
                novaTarefa._id)
                //Realiza o .populate() nos campos criadoPor e participam para devolver o objeto formatado com nome e e-mail.
                .populate("criadoPor", "nome email")
                .populate("participam", "nome email");
            res.status(200).json({message:"Tarefa inserida com sucesso", novaTarefa:tarefaPopulada}); // Retorna status 200 OK com a tarefa recém-criada.
            return;
        } catch (error) {
            return res.status(500).json({message:"Problema ao inserir uma tarefa", error});
        }
    }//fim create

    // Buscar todas as tarefas que o usuário logado criou ou as que ele participa 
    static async getAll(req, res){
        const usuarioLogado = req.user.id; // Obtém o ID do usuário logado 
        try {
            const tarefas = await Tarefa.find({ // Executa a busca no Mongoose usando o operador $or
                    $or:[
                        {criadoPor:usuarioLogado},
                        {participam: usuarioLogado}
                    ]
                })
                // Aplica o populate para trazer o nome do criado e dos participantes 
                .populate("criadoPor", "nome")
                .populate("participam", "nome")
                .sort({ createdAt: -1 }); // Ordenado pela mais recente 
            
            return res.status(200).json({message:"Buscar tarefas com sucesso", tarefas}); // Retorna o array de tarefas encontradas com status 200 OK
        } catch (error) {
            return res.status(500).json({message:"Erro ao buscar todas tarefas", error});
        }

    }//fim getAll



    //TAREFA VÂNIA
    // ALTERA A SITUAÇÃO DE UMA TAREFA 
    static async UpdateSituacao(req, res){

        // Pega o ID da tarefa que veio pela URL 
        const { id } = req.params; 
        
        // Pega a nova situação enviada pelo frontend
        const { situacao } = req.body;  

        // Verifica se a situação foi informada
        if (!situacao){
            return res.status(422).json({message: "A situação é obrigatória"});
        }

        // Situações permitidas para a tarefa
        const situacoesPermitidas = [
            "PENDENTE",
            "CANCELADA",
            "FINALIZADA"
        ];

        if(!situacoesPermitidas.includes(situacao)){
            return res.status(422).json({message: "Situação inválida"}); 
        }

        // Verifica se o ID é válido
        if(!Types.ObjectId.isValid(id)){
            return res.status(422).json({message: "ID da tarefa inválido"});
        }

        try {
            // Procura a tarefa pelo ID e altera sua situação no banco
            const tarefa = await Tarefa.findByIdAndUpdate(
                id, 
                { situacao },
                { new: true }
            )
            .populate("criadoPor", "nome")
            .populate("participam", "nome");

            // Caso a tarefa não exista
            if(!tarefa){
                return res.status(404).json({message: "Tarefa não encontrada"});
            }

            return res.status(200).json({message: "Situação da tarefa alterada com sucesso", tarefa});
        } catch (error) {
            return res.status(500).json({message: "Erro ao alterar situação da tarefa"});
        }

    }
}