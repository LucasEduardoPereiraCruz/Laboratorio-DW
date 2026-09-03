import Tarefa from "../Models/Tarefa.js";
import {Types} from "mongoose";
export default class TarefaController{
    static async Create(req, res){
        const{titulo, descricao, dataLimite, situacao, participam} = req.body;
        const usuarioLogado = req.user.id; // Pegar o usuário logado (é aquele no CriadoPor)
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
                participam: Array.isArray(participam)? participam : (participam ? [participam] : []) // Verifica se participam é um array, se ele estiver preenchido ele joga o participam dentro do array, se estiver vazio, ele retorna um array vazio

            });
            const novaTarefa = await tarefa.save();
            const tarefaPopulada = await Tarefa.findById(novaTarefa._Id).populate("criadoPor", "nome email").populate("participam", "nome email") // Vai buscar o Id da tarefa
            res.status(200).json({message:"Tarefa inserida com sucesso", novaTarefa:tarefaPopulada});
            return;
        } catch (error) {
            return res.status(500).json({message:"Problema ao inserir uma tarefa", error});
        }
    }//fim create
    static async getAll(req, res){
        const usuarioLogado = req.user.id; 
        try {
            const tarefas = await Tarefa.find(
                {
                    $or:[
                        {criadoPor:usuarioLogado}, 
                        {participam:usuarioLogado}
                    ]
                }
            )
            .populate("criadoPor", "nome").populate("participam", "nome").sort({createAt: -1}) // o -1 ele mostra os mais recentes para depois mostrar os demais
            return res.status(200).json({message:"Buscar tarefas com sucesso", tarefas});
        } catch (error) {
            return res.status(500).json({message:"Erro ao buscar todas tarefas", error});
        }

    }//fim getAll
}