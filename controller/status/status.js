/******************************************************************************
 * Objetivo: Arquivo responsável pela conexãode cassa de show com cantores
 * Data: 25/04/2026
 * Autor: Davi de Alemida Santos
 * Versão: 1.0
*****************************************************************************/

const statusDAO = require('../../model/DAO/status.js')


const DEFAULT_MESSAGES = require('../modulo/conf_message.js')


const listarStatuss = async function(){
    
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
       
        let resultStatuss = await statusDAO.getSelectAllStatus()
        
        if(resultStatuss){
            if(resultStatuss.length > 0){
            MESSAGES.HEADER.status      = MESSAGES.SUCCESS_REQUEST.status
            MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
            MESSAGES.HEADER.response.Statuss = resultStatuss

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

//Retorna um Status fultrando pelo ID
const buscarStatusId = async function(id){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        //Validação da chegada do ID
        if(!isNaN(id) && id != '' && id != null && id > 0){
            let resultStatuss = await statusDAO.getSelectByIdStatus(Number(id))

            if(resultStatuss){
                if(resultStatuss.length > 0){
                    MESSAGES.HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                    MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                    MESSAGES.HEADER.response.Statuss = resultStatuss

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

//Insere um Status 
const inserirStatus = async function(status, contentType){

    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Validação do tipo de conteúdo da requisição (Obrigatório ser um JSON)
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            //Chama a função de validar todos os dados do Status
            let validar = await validarDadosStatus(status)

            if(!validar){
            
                //Processamento
                //Chama a função para inserir um novo Status no BD
                let resultStatus = await statusDAO.setInsertStatus(status)

                if(resultStatus){
                    //Chama a função para receber o ID gerado no BD
                    let lastID = await statusDAO.getSelectLastID()
               
                    if(lastID){
                        //Adiciona o ID no JSON com os dados do Status
                        status.id_status = lastID
                        MESSAGES.HEADER.status          =   MESSAGES.SUCCESS_CREATED_ITEM.status
                        MESSAGES.HEADER.status_code     =   MESSAGES.SUCCESS_CREATED_ITEM.status_code
                        MESSAGES.HEADER.message         =   MESSAGES.SUCCESS_CREATED_ITEM.message
                        MESSAGES.HEADER.response         =   status

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

//Atualiza um Status buscando pelo ID
const atualizarStatus = async function(status, id, contentType){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Validação do tipo de conteúdo da requisição (Obrigatório ser um JSON)
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

                //Chama a função de validar todos os dados do Status
                let validar = await validarDadosStatus(status)

                if(!validar){
                
                    //Validação de ID válido, chama a função da controller que verifica no BD se o ID existe e valida o ID
                     let validarID = await buscarStatusId(id)

                    if(validarID.status_code == 200){
                        
                        //Adiciona o ID do Status no JSON de dados para ser encaminhado ao DAO
                        status.id_status = Number(id)

                        //Chama a função para inserir um novo Status no BD
                        let resultStatus = await statusDAO.setUpdateStatus(status)

                        if(resultStatus){
                            MESSAGES.HEADER.status          =   MESSAGES.SUCCESS_UPDATED_ITEM.status
                            MESSAGES.HEADER.status_code     =   MESSAGES.SUCCESS_UPDATED_ITEM.status_code
                            MESSAGES.HEADER.message         =   MESSAGES.SUCCESS_UPDATED_ITEM.message
                           MESSAGES.HEADER.response.status  = status    

                            return MESSAGES.HEADER //200
                        }else{
                            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500
                        }
                    }else{
                        return validarID //A função buscarStatusID poderá retornar (400 ou 404 ou 500)
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


const excluirStatus = async function(id){
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

      
        if(!isNaN(id) && id != '' && id != null && id > 0){

            let validarID = await buscarStatusId(id)

            if(validarID.status_code == 200){

                let resultStatuss = await statusDAO.setDeleteStatus(Number(id))

                if(resultStatuss){
                    
                        MESSAGES.HEADER.status      = MESSAGES.SUCCESS_DELETED_ITEM.status
                        MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_DELETED_ITEM.status_code
                        MESSAGES.HEADER.message     = MESSAGES.SUCCESS_DELETED_ITEM.message
                        MESSAGES.HEADER.response.Status = resultStatuss
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


const validarDadosStatus = async function(Status){
    
    
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    if(Status.nome == '' || Status.nome == undefined || Status.nome == null || Status.nome.length > 100){
        MESSAGES.ERROR_REQUIRED_FIELDS.message == '[Nome incorreto]' 
        return MESSAGES.ERROR_REQUIRED_FIELDS

    
    }else{
        return false
    }
}

module.exports = {
    listarStatuss,
    buscarStatusId,
    inserirStatus,
    atualizarStatus,
    excluirStatus
}