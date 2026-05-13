/******************************************************************************
 * Objetivo: Arquivo responsável pela conexãode cassa de show com cantores
 * Data: 25/04/2026
 * Autor: Davi de Alemida Santos
 * Versão: 1.0
*****************************************************************************/

const EventoArtistaDAO = require('../../model/DAO/evento_artista.js')


const DEFAULT_MESSAGES = require('../modulo/conf_message.js')


const listarEventoArtista = async function(){
    
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
       
        let resultEventoArtista = await EventoArtistaDAO.getSelectAllArtistEvent()
        
        if(resultEventoArtista){
            if(resultEventoArtista.length > 0){
            MESSAGES.HEADER.status      = MESSAGES.SUCCESS_REQUEST.status
            MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
            MESSAGES.HEADER.response.EventoArtista = resultEventoArtista

            return MESSAGES.HEADER
                return MESSAGES.ERROR_NOT_FOUND //404
            }
        }else{
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500
        }
    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}

//Retorna um EventoArtista fultrando pelo ID
const buscarEventoArtistaId = async function(id){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        //Validação da chegada do ID
        if(!isNaN(id) && id != '' && id != null && id > 0){
            let resultEventoArtista = await EventoArtistaDAO.getSelectByIdArtistEvent(Number(id))

            if(resultEventoArtista){
                if(resultEventoArtista.length > 0){
                    MESSAGES.HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                    MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                    MESSAGES.HEADER.response.EventoArtista = resultEventoArtista[0]

                    return MESSAGES.HEADER //200
                }else{
                    return MESSAGES.ERROR_NOT_FOUND //404
                }
            }else{
                return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500
            }
        }else{
            MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [ID incorreto]'
            return MESSAGES.ERROR_REQUIRED_FIELDS //400
        }

    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Insere um EventoArtista 
const inserirEventoArtista = async function(EventoArtista, contentType){

    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Validação do tipo de conteúdo da requisição (Obrigatório ser um JSON)
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            //Chama a função de validar todos os dados do EventoArtista
            let validar = await validarDadosEventoArtista(EventoArtista)

            if(!validar){
            
                //Processamento
                //Chama a função para inserir um novo EventoArtista no BD
                let resultEventoArtista = await EventoArtistaDAO.setInsertArtistEvent(EventoArtista)

                if(resultEventoArtista){
                    //Chama a função para receber o ID gerado no BD
                    let lastID = await EventoArtistaDAO.getSelectLastID()
               
                    if(lastID){
                        //Adiciona o ID no JSON com os dados do EventoArtista
                        EventoArtista.id_evento_artista = lastID
                        MESSAGES.HEADER.status          =   MESSAGES.SUCCESS_CREATED_ITEM.status
                        MESSAGES.HEADER.status_code     =   MESSAGES.SUCCESS_CREATED_ITEM.status_code
                        MESSAGES.HEADER.message         =   MESSAGES.SUCCESS_CREATED_ITEM.message
                        MESSAGES.HEADER.response         =   EventoArtista

                        return MESSAGES.HEADER //201
                    }else{
                        return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500
                    }
                    
                }else{
                    return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500
                }
            }else{
                return validar //400
            }
        }else{
            return MESSAGES.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Atualiza um EventoArtista buscando pelo ID
const atualizarEventoArtista = async function(EventoArtista, id, contentType){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Validação do tipo de conteúdo da requisição (Obrigatório ser um JSON)
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

                //Chama a função de validar todos os dados do EventoArtista
                let validar = await validarDadosEventoArtista(EventoArtista)

                if(!validar){
                
                    //Validação de ID válido, chama a função da controller que verifica no BD se o ID existe e valida o ID
                     let validarID = await buscarEventoArtistaId(id)

                    if(validarID.status_code == 200){
                        
                        //Adiciona o ID do EventoArtista no JSON de dados para ser encaminhado ao DAO
                        EventoArtista.id_evento_artista = Number(id)

                        //Chama a função para inserir um novo EventoArtista no BD
                        let resultEventoArtista = await EventoArtistaDAO.setUpdateArtistEvent(EventoArtista)

                        if(resultEventoArtista){
                            MESSAGES.HEADER.status          =   MESSAGES.SUCCESS_UPDATED_ITEM.status
                            MESSAGES.HEADER.status_code     =   MESSAGES.SUCCESS_UPDATED_ITEM.status_code
                            MESSAGES.HEADER.message         =   MESSAGES.SUCCESS_UPDATED_ITEM.message
                            MESSAGES.HEADER.response.EventoArtista     =   EventoArtista           

                            return MESSAGES.HEADER //200
                        }else{
                            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500
                        }
                    }else{
                        return validarID //A função buscargeneroID poderá retornar (400 ou 404 ou 500)
                    }    
                }else{
                    return validar //400 referente a validação dos dados
                }
            
        }else{
            return MESSAGES.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}


const excluirEventoArtista = async function(id){
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

      
        if(!isNaN(id) && id != '' && id != null && id > 0){

            let validarID = await buscarEventoArtistaId(id)

            if(validarID.status_code == 200){

                let resultEventoArtista = await EventoArtistaDAO.setDeleteArtistEvent(Number(id))

                if(resultEventoArtista){
                    
                        MESSAGES.HEADER.status      = MESSAGES.SUCCESS_DELETED_ITEM.status
                        MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_DELETED_ITEM.status_code
                        MESSAGES.HEADER.message     = MESSAGES.SUCCESS_DELETED_ITEM.message
                        MESSAGES.HEADER.response.EventoArtista = resultEventoArtista
                        delete MESSAGES.HEADER.response
                        return MESSAGES.HEADER 
            
                }else{
                    return MESSAGES.ERROR_INTERNAL_SERVER_MODEL 
                }
            }else{
                return MESSAGES.ERROR_NOT_FOUND 
            }
        }else{
            MESSAGES.ERROR_REQUIRED_FIELDS.message == '[ID incorreto]'
            return MESSAGES.ERROR_REQUIRED_FIELDS 
        }

    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER 
    }
}

const validarDadosEventoArtista = function(EventoArtista) {
    
    const gerarErro = (campo) => ({
        DEFAULT_MESSAGES, 
        message: `${DEFAULT_MESSAGES.ERROR_REQUIRED_FIELDS.message} [Campo: ${campo}]`
    });

    // Validações rápidas
   
    if (EventoArtista.artista_id == '' || EventoArtista.artista_id == null || EventoArtista.artista_id <= 0 || isNaN(EventoArtista.artista_id)) 
    return gerarErro('ID_Artista');

if (EventoArtista.evento_id == '' || EventoArtista.evento_id == null || EventoArtista.evento_id <= 0 || isNaN(EventoArtista.evento_id)) 
    return gerarErro('ID_Evento');

if (EventoArtista.cache_esperado == '' || EventoArtista.cache_esperado == null || isNaN(EventoArtista.cache_esperado)) 
    return gerarErro('cache_esperado');

if (EventoArtista.cache_ofertado == '' || EventoArtista.cache_ofertado == null || isNaN(EventoArtista.cache_ofertado)) 
    return gerarErro('cache_ofertado');

if (EventoArtista.cache_final == '' || EventoArtista.cache_final == null || isNaN(EventoArtista.cache_final)) 
    return gerarErro('cache_final');

if (EventoArtista.contra_proposta != null && isNaN(EventoArtista.contra_proposta)) 
    return gerarErro('contra_proposta');

if (EventoArtista.sobre_artista != null && EventoArtista.sobre_artista.length > 500) 
    return gerarErro('sobre_artista');

if (EventoArtista.motivo_inscricao != null && EventoArtista.motivo_inscricao.length > 500) 
    return gerarErro('motivo_inscricao');


    return false


}

module.exports = {
    listarEventoArtista,
    buscarEventoArtistaId,
    inserirEventoArtista,
    atualizarEventoArtista,
    excluirEventoArtista
}