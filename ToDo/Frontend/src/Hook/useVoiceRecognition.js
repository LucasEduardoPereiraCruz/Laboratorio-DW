import {useState, useEffect, useRef} from "react"; 
// Função tratar conversões data falada 
function interpretarDataVoz(texto){
    const fala = texto.toLowerCase().trim(); 
    const hoje = new Date()
    if(fala.includes("hoje")){
        return hoje.toISOString().split("T")[0] //Pega só indice 0, que é somente a data
    }
    if(fala.includes("amanhã") || fala.includes("amanha")){
        const amanha = new Date(); 
        amanha.setDate(hoje.getDate()+1); 
        return amanha.toISOString().split("T")[0]; 
    }
    if(fala.includes("depois de amanhã") || fala.includes("depois de amanhã")){
        const depoisAmanha = new Date(); 
        depoisAmanha.setDate(hoje.getDate()+2); 
        return depoisAmanha.toISOString().split("T")[0]; 
    }
    const matchDias = fala.match(/daqui a (\d+) dias/); 
    if(matchDias){
        const dias = parseInt(matchDias[1], 10); 
        const dataFutura = new Date();
        dataFutura.setDate(hoje.getDate() + dias)
        return depoisAmanha.toISOString().split("T")[0]; 
    }
    return ""; 
} // Fim da função 

export function useVoiceRecognition(){
    const [textoOuvido, setTextoOuvido] = useState(""); 
    const [ouvindo, setOuvindo] = useState("false"); 
    const [suportado, setSuportado] = useState("true");
    const recognitionRef = useRef(null) 
    useEffect(()=>{
        // Verifica se a API está disponível no navegador 
        if(typeof window !== "undefined"){
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        }
        if(SpeechRecognition){
            const recognition = new SpeechRecognition(); 
            //microfone ficar contínuo 
            recognition.continuous = true; 
            recognition.interimResults = true; 
            recognition.lang = "pt-BR"
            // Converte em texto após o áudio 
            recognition.onresult = (event) => {
                let transcricaoFinal = ""; 
                // Acumula todos os trechos da fala confirmados durante a sessão ativa 
                for(let i = event.resultIndex; i < event.result.length; i++){
                    if(event.results[i].isFinal){
                        transcricaoFinal += event.results[i][0].transcript + ""; 
                    }
                }
                if(transcricaoFinal){
                    setTextoOuvido(transcricaoFinal.trim()); 
                }
            };
            // evento erro 
            recognition.onerror = (event) => {
                console.error("Erro no conhecimento de voz", event.error); 
                setOuvindo(false); 
            };
            // fim da fala
            recognition.onend = () =>{
                setOuvindo(false); 
            };
            recognition.current = recognition; 
        }
        else
        {
            setSuportado(false); 
        }
    }, []); 
    // Inicia ou interrompe a gravação (liga/desliga)
    const iniciarEscuta = ()=>{
        if(!recognitionRef.current) return; 
        if(ouvindo){
            // se já estiver ouvindo o click manual encerra a gravação 
            recognitionRef.current.stop(); 
            setOuvindo(false); 
        }
        else 
        {
            // limpa textos e inicia a escuta 
            setTextoOuvido(""); 
            setOuvindo(true)
            recognitionRef.current.start(); 
        }
    }; 
    // Função para parar gravação manualmente 
    const pararEscuta = ()=>{
        if(recognitionRef.current && ouvindo){
            recognitionRef.current.stop(); 
            setOuvindo(false); 
        }
    }; 
    // Processar a frase capturada e atualiza o estado correspondente baseado na palavra-chave
    const processarComandoVoz = (
        fala, 
        setTitulo,
        setDescricao, 
        setDataLimite, 
        usuarios = [], 
        handleCheckBoxChange)=>{
            // expressões 
            const regexTitulo = /(?:título|titulo)\s+(.+)/i;
            const regexDescricao = /(?:descrição|descricao)\s+(.+)/i;
            const regexData = /(?:data|data limite|prazo)\s+(.+)/i;
            const regexParticipante = /(?:participante|participantes|adicionar|incluir)\s+(.+)/i;
            // comando do participante 
            const matchParticipante = fala.match(regexParticipante);
            if(matchParticipante && matchParticipante[1] && handleCheckChange){
                const nomeFalado = matchParticipante[1].trim.toLowerCase(); 
                // Buscar na lista de usuários um nome equivalente ao que foi falado 
                const usuarioEncontrado = usuarios.find(u =>u.nome.toLowerCase().includes(nomeFalado))
                if(usuarioEncontrado){
                    const id = usuarioEncontrado._id || usuarioEncontrado.id;
                    handleCheckBoxChange(id); 
                } else {
                    console.warn("Usuário não encontrado na lista", nomeFalado);
                }
                return;
            }
            // Comando de TÍTULO
            const matchTitulo = fala.match(regexTitulo); 
            if(matchTitulo && matchTitulo[1]){
                setTitulo(matchTitulo[1].trim()); 
                return; 
            }
            // Comando de DESCRIÇÃO
            const matchDescricao = fala.match(regexDescricao); 
            if(matchDescricao && matchDescricao[1]){
                setDescricao(matchDescricao[1].trim()); 
                return; 
            }
            // Comando de DATA
            const matchData = fala.match(regexData); 
            if(matchData && matchData[1]){
                const dataFormatada = interpretarDataVoz(matchData[1]);
                if(dataFormatada){
                    setDataLimite(dataFormatada); 
                    
                }
                return; 
            }
            // Não deu nenhum match 
        };
        return{
            textoOuvido, 
            setTextoOuvido, 
            ouvindo, 
            iniciarEscuta, 
            pararEscuta, 
            processarComandoVoz, 
            suportado
        } 
}