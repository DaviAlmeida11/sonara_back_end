/******************************************************************************
 * Objetivo: Arquivo responsável pela conexãode cassa de show com cantores
 * Data: 25/04/2026
 * Autor: Davi de Alemida Santos
 * Versão: 1.0
*****************************************************************************/

const  eventoOrganizadorDAO = require('../../model/DAO/evento_organizador.js')


const DEFAULT_MESSAGES = require('../modulo/conf_message.js')


const listarEventoOrganizador = async function(){
    
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
       
        let resulteventoOrganizador = await eventoOrganizadorDAO.getSelectAllOrganizerEvent()
      
        if(resulteventoOrganizador){
            if(resulteventoOrganizador.length > 0){
            MESSAGES.HEADER.status      = MESSAGES.SUCCESS_REQUEST.status
            MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
            MESSAGES.HEADER.response.eventoOrganizador = resulteventoOrganizador

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

//Retorna um eventoOrganizador fultrando pelo ID
const buscarEventoOrganizadorId = async function(id){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        //Validação da chegada do ID
        if(!isNaN(id) && id != '' && id != null && id > 0){
            let resulteventoOrganizador = await eventoOrganizadorDAO.getSelectByIdOrganizerEvent(Number(id))

            if(resulteventoOrganizador){
                if(resulteventoOrganizador.length > 0){
                    MESSAGES.HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                    MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                    MESSAGES.HEADER.response.eventoOrganizador = resulteventoOrganizador[0]

                    return MESSAGES.HEADER //200
                }else{
                    return MESSAGES.ERROR_NOT_FOUND //404
                }
            }else{
                return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500
            }
        }else{
            MESSAGES.ERROR_REQUIRED_FIELDS.message == ' [ID incorreto]'
            return MESSAGES.ERROR_REQUIRED_FIELDS //400
        }

    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Insere um  eventoOrganizador
const inserirEventoOrganizador = async function(eventoOrganizador, contentType){

    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Validação do tipo de conteúdo da requisição (Obrigatório ser um JSON)
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            //Chama a função de validar todos os dados do eventoOrganizador
            let validar = await validarDadosEventoOrganizador(eventoOrganizador)

            if(!validar){
            
                //Processamento
                //Chama a função para inserir um novo eventoOrganizador no BD
                let resulteventoOrganizador = await eventoOrganizadorDAO.setInsertOrganizerEvent(eventoOrganizador)

                if(resulteventoOrganizador){
                    //Chama a função para receber o ID gerado no BD
                    let lastID = await eventoOrganizadorDAO.getSelectLastID()
         
                    if(lastID){
                        //Adiciona o ID no JSON com os dados do eventoOrganizador
                        eventoOrganizador.id_artista_genero = lastID
                        MESSAGES.HEADER.status          =   MESSAGES.SUCCESS_CREATED_ITEM.status
                        MESSAGES.HEADER.status_code     =   MESSAGES.SUCCESS_CREATED_ITEM.status_code
                        MESSAGES.HEADER.message         =   MESSAGES.SUCCESS_CREATED_ITEM.message
                        MESSAGES.HEADER.response         =   eventoOrganizador

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

//Atualiza um eventoOrganizador buscando pelo ID
const atualizarEventoOrganizador = async function(eventoOrganizador, id, contentType){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Validação do tipo de conteúdo da requisição (Obrigatório ser um JSON)
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

                //Chama a função de validar todos os dados do eventoOrganizador
                let validar = await validarDadosEventoOrganizador(eventoOrganizador)

                if(!validar){
                
                    //Validação de ID válido, chama a função da controller que verifica no BD se o ID existe e valida o ID
                     let validarID = await buscarEventoOrganizadorId(id)
                  
                    if(validarID.status_code == 200){
                        
                        //Adiciona o ID do eventoOrganizador no JSON de dados para ser encaminhado ao DAO
                        eventoOrganizador.id_evento_organizador = Number(id)


                        //Chama a função para inserir um novo eventoOrganizador no BD
                        let resulteventoOrganizador = await eventoOrganizadorDAO.setUpdateOrganizerEvent(eventoOrganizador)

                        if(resulteventoOrganizador){
                            MESSAGES.HEADER.status          =   MESSAGES.SUCCESS_UPDATED_ITEM.status
                            MESSAGES.HEADER.status_code     =   MESSAGES.SUCCESS_UPDATED_ITEM.status_code
                            MESSAGES.HEADER.message         =   MESSAGES.SUCCESS_UPDATED_ITEM.message
                            MESSAGES.HEADER.response.eventoOrganizador     =   eventoOrganizador           

                            return MESSAGES.HEADER //200
                        }else{
                            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500
                        }
                    }else{
                        return validarID //A função buscareventoOrganizadorID poderá retornar (400 ou 404 ou 500)
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


const excluirEventoOrganizador = async function(id){
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

      
        if(!isNaN(id) && id != '' && id != null && id > 0){

            let validarID = await buscarEventoOrganizadorId(id)

            if(validarID.status_code == 200){

                let resulteventoOrganizador = await eventoOrganizadorDAO.setDeleteOrganizerEvent(Number(id))

                if(resulteventoOrganizador){
                    
                        MESSAGES.HEADER.status      = MESSAGES.SUCCESS_DELETED_ITEM.status
                        MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_DELETED_ITEM.status_code
                        MESSAGES.HEADER.message     = MESSAGES.SUCCESS_DELETED_ITEM.message
                        MESSAGES.HEADER.response.eventoOrganizador = resulteventoOrganizador
                        delete MESSAGES.HEADER.response
                        return MESSAGES.HEADER 
            
                }else{
                    return MESSAGES.ERROR_INTERNAL_SERVER_MODEL 
                }
            }else{
                return MESSAGES.ERROR_NOT_FOUND 
            }
        }else{
            MESSAGES.ERROR_REQUIRED_FIELDS.message == ' [ID incorreto]'
            return MESSAGES.ERROR_REQUIRED_FIELDS 
        }

    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER 
    }
}


const validarDadosEventoOrganizador = function(eventoOrganizador) {
    
    const gerarErro = (campo) => ({
        DEFAULT_MESSAGES, 
        message: `${DEFAULT_MESSAGES.ERROR_REQUIRED_FIELDS.message} [Campo: ${campo}]`
    });

    // Validações rápidas
     if (eventoOrganizador.evento_id == Number && eventoOrganizador.evento_id!= '' && eventoOrganizador.tipo_id != null && eventoOrganizador.evento_id > 0) 
        return gerarErro('id_tipo_redes_sociais');
    
    if (eventoOrganizador.organizador_id == Number && eventoOrganizador.organizador_id != '' && eventoOrganizador.organizador_id != null && eventoOrganizador.organizador_id > 0) 
        return gerarErro('ID_Organizador');



    return false; 
}
module.exports = {
    listarEventoOrganizador,
    buscarEventoOrganizadorId,
    inserirEventoOrganizador,
    atualizarEventoOrganizador,
    excluirEventoOrganizador
}