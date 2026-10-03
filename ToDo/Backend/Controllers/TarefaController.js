import Tarefa from "../Models/Tarefa.js";
import {Types} from "mongoose";
export default class TarefaController{
    static async Create(req, res){
        const{titulo, descricao, dataLimite, situacao, participam} = req.body;
        const usuarioLogado = req.user.id;
        if(!titulo || !descricao || !dataLimite || !situacao)
        {
            return res.status(422).json({message: "Todos os dados são obrigatórios"});
        }
        try {
            const tarefa = new Tarefa({
                titulo,
                descricao,
                dataLimite,
                situacao,
                criadoPor: usuarioLogado,
                participam: Array.isArray(participam)? 
                participam : (participam ? [participam] : [])

            });
            const novaTarefa = await tarefa.save();
            const tarefaPopulada = await Tarefa.findById(
                novaTarefa._id)
                .populate("criadoPor", "nome email")
                .populate("participam", "nome email");
            res.status(200).json({message:"Tarefa inserida com sucesso", novaTarefa:tarefaPopulada});
            return;
        } catch (error) {
            return res.status(500).json({message:"Problema ao inserir uma tarefa", error});
        }
    }//fim create
    static async getAll(req, res){
        const usuarioLogado = req.user.id;
        try {
            const tarefas = await Tarefa.find({
                    $or:[
                        {criadoPor:usuarioLogado},
                        {participam: usuarioLogado}
                    ]
                })
                .populate("criadoPor", "nome")
                .populate("participam", "nome")
                .sort({ createdAt: -1 });
            
            return res.status(200).json({message:"Buscar tarefas com sucesso", tarefas});
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
            // Procura a tarefa pelo ID e altera sua situação
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