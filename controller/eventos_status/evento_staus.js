/******************************************************************************
 * Objetivo: Arquivo responsável pela conexãode cassa de show com cantores
 * Data: 25/04/2026
 * Autor: Davi de Alemida Santos
 * Versão: 1.0
*****************************************************************************/

const EventoStatusDAO = require('../../model/DAO/evento_status.js')


const DEFAULT_MESSAGES = require('../modulo/conf_message.js')


const listarEventoStatus = async function(){
    
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
       
        let resultEventoStatus = await EventoStatusDAO.getSelectAllStatusEvent()
        
        if(resultEventoStatus){
            if(resultEventoStatus.length > 0){
            MESSAGES.HEADER.status      = MESSAGES.SUCCESS_REQUEST.status
            MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
            MESSAGES.HEADER.response.EventoStatus = resultEventoStatus

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

//Retorna um EventoStatus fultrando pelo ID
const buscarEventoStatusId = async function(id){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        //Validação da chegada do ID
        if(!isNaN(id) && id != '' && id != null && id > 0){
            let resultEventoStatus = await EventoStatusDAO.getSelectByIdStatusEvent(Number(id))

            if(resultEventoStatus){
                if(resultEventoStatus.length > 0){
                    MESSAGES.HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                    MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                    MESSAGES.HEADER.response.EventoStatus = resultEventoStatus[0]

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

//Insere um EventoStatus 
const inserirEventoStatus = async function(EventoStatus, contentType){

    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Validação do tipo de conteúdo da requisição (Obrigatório ser um JSON)
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            //Chama a função de validar todos os dados do EventoStatus
            let validar = await validarDadosEventoStatus(EventoStatus)

            if(!validar){
            
                //Processamento
                //Chama a função para inserir um novo EventoStatus no BD
                let resultEventoStatus = await EventoStatusDAO.setInsertStatusEvent(EventoStatus)

                if(resultEventoStatus){
                    //Chama a função para receber o ID gerado no BD
                    let lastID = await EventoStatusDAO.getSelectLastID()
               
                    if(lastID){
                        //Adiciona o ID no JSON com os dados do EventoStatus
                        EventoStatus.id_evento_status = lastID
                        MESSAGES.HEADER.status          =   MESSAGES.SUCCESS_CREATED_ITEM.status
                        MESSAGES.HEADER.status_code     =   MESSAGES.SUCCESS_CREATED_ITEM.status_code
                        MESSAGES.HEADER.message         =   MESSAGES.SUCCESS_CREATED_ITEM.message
                        MESSAGES.HEADER.response         =   EventoStatus

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

//Atualiza um EventoStatus buscando pelo ID
const atualizarEventoStatus = async function(EventoStatus, id, contentType){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Validação do tipo de conteúdo da requisição (Obrigatório ser um JSON)
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

                //Chama a função de validar todos os dados do EventoStatus
                let validar = await validarDadosEventoStatus(EventoStatus)

                if(!validar){
                
                    //Validação de ID válido, chama a função da controller que verifica no BD se o ID existe e valida o ID
                     let validarID = await buscarEventoStatusId(id)

                    if(validarID.status_code == 200){
                        
                        //Adiciona o ID do EventoStatus no JSON de dados para ser encaminhado ao DAO
                        EventoStatus.id_evento_status = Number(id)

                        //Chama a função para inserir um novo EventoStatus no BD
                        let resultEventoStatus = await EventoStatusDAO.setUpdateStatusEvent(EventoStatus)

                        if(resultEventoStatus){
                            MESSAGES.HEADER.status          =   MESSAGES.SUCCESS_UPDATED_ITEM.status
                            MESSAGES.HEADER.status_code     =   MESSAGES.SUCCESS_UPDATED_ITEM.status_code
                            MESSAGES.HEADER.message         =   MESSAGES.SUCCESS_UPDATED_ITEM.message
                            MESSAGES.HEADER.response.EventoStatus     =   EventoStatus           

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


const excluirEventoStatus = async function(id){
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

      
        if(!isNaN(id) && id != '' && id != null && id > 0){

            let validarID = await buscarEventoStatusId(id)

            if(validarID.status_code == 200){

                let resultEventoStatus = await EventoStatusDAO.setDeleteStatusEvent(Number(id))

                if(resultEventoStatus){
                    
                        MESSAGES.HEADER.status      = MESSAGES.SUCCESS_DELETED_ITEM.status
                        MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_DELETED_ITEM.status_code
                        MESSAGES.HEADER.message     = MESSAGES.SUCCESS_DELETED_ITEM.message
                        MESSAGES.HEADER.response.EventoStatus = resultEventoStatus
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

const validarDadosEventoStatus = function(EventoStatus) {
    
    const gerarErro = (campo) => ({
        DEFAULT_MESSAGES, 
        message: `${DEFAULT_MESSAGES.ERROR_REQUIRED_FIELDS.message} [Campo: ${campo}]`
    });

    // Validações rápidas
    if (EventoStatus.evento_id == Number && EventoStatus.evento_id != '' && EventoStatus.evento_id != null && EventoStatus.evento_id > 0) 
        return gerarErro('ID_Evento');
    
     if (EventoStatus.status_id == Number && EventoStatus.status_id != '' && EventoStatus.status_id != null && EventoStatus.status_id > 0) 
        return gerarErro('ID_Status');

    if (EventoStatus.data_hora.length > 255) 
        return gerarErro('data_hora');



    return false


}


module.exports = {
    listarEventoStatus,
    buscarEventoStatusId,
    inserirEventoStatus,
    atualizarEventoStatus,
    excluirEventoStatus
}