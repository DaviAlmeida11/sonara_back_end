/******************************************************************************
 * Objetivo: Arquivo responsável pela conexãode cassa de show com cantores
 * Data: 25/04/2026
 * Autor: Davi de Alemida Santos
 * Versão: 1.0
*****************************************************************************/

const EventoArtistaStatusDAO = require('../../model/DAO/evento_artista_status.js')
const { buscarEventoArtistaId } = require('../evento_artista/evento_artista.js')


const DEFAULT_MESSAGES = require('../modulo/conf_message.js')


const listarEventoArtistaStatus = async function(){
    
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
       
        let resultEventoArtistaStatus = await EventoArtistaStatusDAO.getSelectAllArtistEventStatus()
        
        if(resultEventoArtistaStatus){
            if(resultEventoArtistaStatus.length > 0){
            MESSAGES.HEADER.status      = MESSAGES.SUCCESS_REQUEST.status
            MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
            MESSAGES.HEADER.response.EventoArtistaStatus = resultEventoArtistaStatus

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

//Retorna um EventoArtistaStatus fultrando pelo ID
const buscarEventoArtistaStatusId = async function(id){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        //Validação da chegada do ID
        if(!isNaN(id) && id != '' && id != null && id > 0){
            let resultEventoArtistaStatus = await EventoArtistaStatusDAO.getSelectByIdArtistEventStatus(Number(id))

            if(resultEventoArtistaStatus){
                if(resultEventoArtistaStatus.length > 0){
                    MESSAGES.HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                    MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                    MESSAGES.HEADER.response.EventoArtistaStatus = resultEventoArtistaStatus[0]

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

//Insere um EventoArtistaStatus 
const inserirEventoArtistaStatus = async function(EventoArtistaStatus, contentType){

    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Validação do tipo de conteúdo da requisição (Obrigatório ser um JSON)
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            //Chama a função de validar todos os dados do EventoArtistaStatus
            let validar = await validarDadosEventoArtistaStatus(EventoArtistaStatus)

            if(!validar){
            
                //Processamento
                //Chama a função para inserir um novo EventoArtistaStatus no BD
                let resultEventoArtistaStatus = await EventoArtistaStatusDAO.setInsertArtistEventStatus(EventoArtistaStatus)

                if(resultEventoArtistaStatus){
                    //Chama a função para receber o ID gerado no BD
                    let lastID = await EventoArtistaStatusDAO.getSelectLastID()
               
                    if(lastID){
                        //Adiciona o ID no JSON com os dados do EventoArtistaStatus
                        EventoArtistaStatus.id_evento_artista_status = lastID
                        MESSAGES.HEADER.status          =   MESSAGES.SUCCESS_CREATED_ITEM.status
                        MESSAGES.HEADER.status_code     =   MESSAGES.SUCCESS_CREATED_ITEM.status_code
                        MESSAGES.HEADER.message         =   MESSAGES.SUCCESS_CREATED_ITEM.message
                        MESSAGES.HEADER.response         =   EventoArtistaStatus

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

//Atualiza um EventoArtistaStatus buscando pelo ID
const atualizarEventoArtistaStatus = async function(EventoArtistaStatus, id, contentType){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Validação do tipo de conteúdo da requisição (Obrigatório ser um JSON)
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

                //Chama a função de validar todos os dados do EventoArtistaStatus
                let validar = await validarDadosEventoArtistaStatus(EventoArtistaStatus)

                if(!validar){
                
                    //Validação de ID válido, chama a função da controller que verifica no BD se o ID existe e valida o ID
                     let validarID = await buscarEventoArtistaStatusId(id)

                    if(validarID.status_code == 200){
                        
                        //Adiciona o ID do EventoArtistaStatus no JSON de dados para ser encaminhado ao DAO
                        EventoArtistaStatus.id_evento_artista_status = Number(id)

                        //Chama a função para inserir um novo EventoArtistaStatus no BD
                        let resultEventoArtistaStatus = await EventoArtistaStatusDAO.setUpdateArtistEventStatus(EventoArtistaStatus)

                        if(resultEventoArtistaStatus){
                            MESSAGES.HEADER.status          =   MESSAGES.SUCCESS_UPDATED_ITEM.status
                            MESSAGES.HEADER.status_code     =   MESSAGES.SUCCESS_UPDATED_ITEM.status_code
                            MESSAGES.HEADER.message         =   MESSAGES.SUCCESS_UPDATED_ITEM.message
                            MESSAGES.HEADER.response.EventoArtistaStatus     =   EventoArtistaStatus           

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


const excluirEventoArtistaStatus = async function(id){
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

      
        if(!isNaN(id) && id != '' && id != null && id > 0){

            let validarID = await buscarEventoArtistaStatusId(id)

            if(validarID.status_code == 200){

                let resultEventoArtistaStatus = await EventoArtistaStatusDAO.setDeleteArtistEventStatus(Number(id))

                if(resultEventoArtistaStatus){
                    
                        MESSAGES.HEADER.status      = MESSAGES.SUCCESS_DELETED_ITEM.status
                        MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_DELETED_ITEM.status_code
                        MESSAGES.HEADER.message     = MESSAGES.SUCCESS_DELETED_ITEM.message
                        MESSAGES.HEADER.response.EventoArtistaStatus = resultEventoArtistaStatus
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

const validarDadosEventoArtistaStatus = function (EventoArtistaStatus) {

    const gerarErro = (campo) => ({
        DEFAULT_MESSAGES,
        message: `${DEFAULT_MESSAGES.ERROR_REQUIRED_FIELDS.message} [Campo: ${campo}]`
    });

    
    if (
        EventoArtistaStatus.evento_artista_id == '' ||
        EventoArtistaStatus.evento_artista_id == null ||
        EventoArtistaStatus.evento_artista_id <= 0 ||
        isNaN(EventoArtistaStatus.evento_artista_id)
    ) {
        return gerarErro('evento_artista_id');
    }

  
    if (
        EventoArtistaStatus.status_id == '' ||
        EventoArtistaStatus.status_id == null ||
        EventoArtistaStatus.status_id <= 0 ||
        isNaN(EventoArtistaStatus.status_id)
    ) {
        return gerarErro('status_id');
    }

  
    if ( EventoArtistaStatus.data_hora.length > 255) 
        return gerarErro('data_hora');


    return false;
};
module.exports = {
    listarEventoArtistaStatus,
    buscarEventoArtistaStatusId,
    inserirEventoArtistaStatus,
    atualizarEventoArtistaStatus,
    excluirEventoArtistaStatus
}