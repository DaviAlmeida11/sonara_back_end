/******************************************************************************
 * Objetivo: Arquivo responsável pela conexãode cassa de show com cantores
 * Data: 11/05/2026
 * Autor: Davi de Alemida Santos
 * Versão: 1.0
*****************************************************************************/

const eventoFotoDAO = require('../../model/DAO/evento_foto.js')


const DEFAULT_MESSAGES = require('../modulo/conf_message.js')


const listareventoFoto = async function(){
    
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
       
        let resulteventoFoto = await eventoFotoDAO.getSelectAllPhotoEvent()
        
        if(resulteventoFoto){
            if(resulteventoFoto.length > 0){
            MESSAGES.HEADER.status      = MESSAGES.SUCCESS_REQUEST.status
            MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
            MESSAGES.HEADER.response.EventoFoto = resulteventoFoto

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

//Retorna um eventoFoto fultrando pelo ID
const buscareventoFotoId = async function(id){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        //Validação da chegada do ID
        if(!isNaN(id) && id != '' && id != null && id > 0){
            let resulteventoFoto = await eventoFotoDAO.getSelectByIdPhotoEvent(Number(id))

            if(resulteventoFoto){
                if(resulteventoFoto.length > 0){
                    MESSAGES.HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                    MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                    MESSAGES.HEADER.response.eventoFoto = resulteventoFoto[0]

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

//Insere um eventoFoto 
const inserireventoFoto = async function(eventoFoto, contentType){

    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Validação do tipo de conteúdo da requisição (Obrigatório ser um JSON)
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            //Chama a função de validar todos os dados do eventoFoto
            let validar = await validarDadoseventoFoto(eventoFoto)

            if(!validar){
            
                //Processamento
                //Chama a função para inserir um novo eventoFoto no BD
                let resulteventoFoto = await eventoFotoDAO.setInsertPhotoEvent(eventoFoto)
                
                if(resulteventoFoto){
                    //Chama a função para receber o ID gerado no BD
                    let lastID = await eventoFotoDAO.getSelectLastID()
               
                    if(lastID){
                        //Adiciona o ID no JSON com os dados do eventoFoto
                        eventoFoto.id_evento_foto = lastID
                        MESSAGES.HEADER.status          =   MESSAGES.SUCCESS_CREATED_ITEM.status
                        MESSAGES.HEADER.status_code     =   MESSAGES.SUCCESS_CREATED_ITEM.status_code
                        MESSAGES.HEADER.message         =   MESSAGES.SUCCESS_CREATED_ITEM.message
                        MESSAGES.HEADER.response         =   eventoFoto

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

//Atualiza um eventoFoto buscando pelo ID
const atualizareventoFoto = async function(eventoFoto, id, contentType){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Validação do tipo de conteúdo da requisição (Obrigatório ser um JSON)
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

                //Chama a função de validar todos os dados do eventoFoto
                let validar = await validarDadoseventoFoto(eventoFoto)

                if(!validar){
                
                    //Validação de ID válido, chama a função da controller que verifica no BD se o ID existe e valida o ID
                     let validarID = await buscareventoFotoId(id)

                    if(validarID.status_code == 200){
                        
                        //Adiciona o ID do eventoFoto no JSON de dados para ser encaminhado ao DAO
                        eventoFoto.id_evento_foto = Number(id)

                        //Chama a função para inserir um novo eventoFoto no BD
                        let resulteventoFoto = await eventoFotoDAO.setUpdatePhotoEvent(eventoFoto)

                        if(resulteventoFoto){
                            MESSAGES.HEADER.status          =   MESSAGES.SUCCESS_UPDATED_ITEM.status
                            MESSAGES.HEADER.status_code     =   MESSAGES.SUCCESS_UPDATED_ITEM.status_code
                            MESSAGES.HEADER.message         =   MESSAGES.SUCCESS_UPDATED_ITEM.message
                            MESSAGES.HEADER.response.eventoFoto     =   eventoFoto           

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


const excluireventoFoto = async function(id){
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

      
        if(!isNaN(id) && id != '' && id != null && id > 0){

            let validarID = await buscareventoFotoId(id)

            if(validarID.status_code == 200){

                let resulteventoFoto = await eventoFotoDAO.setDeletePhotoEvent(Number(id))

                if(resulteventoFoto){
                    
                        MESSAGES.HEADER.status      = MESSAGES.SUCCESS_DELETED_ITEM.status
                        MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_DELETED_ITEM.status_code
                        MESSAGES.HEADER.message     = MESSAGES.SUCCESS_DELETED_ITEM.message
                        MESSAGES.HEADER.response.eventoFoto = resulteventoFoto
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

const validarDadoseventoFoto = function(eventoFoto) {
    
    const gerarErro = (campo) => ({
        DEFAULT_MESSAGES, 
        message: `${DEFAULT_MESSAGES.ERROR_REQUIRED_FIELDS.message} [Campo: ${campo}]`
    });

    // Validações rápidas
    if (eventoFoto.foto_id == Number && eventoFoto.foto_id != '' && eventoFoto.foto_id != null && eventoFoto.foto_id > 0) 
        return gerarErro('ID_Foto');
    
     if (eventoFoto.evento_id == Number && eventoFoto.evento_id != '' && eventoFoto.evento_id != null && eventoFoto.evento_id > 0) 
        return gerarErro('ID_Evento');

    if ( eventoFoto.data_hora.length > 255) 
        return gerarErro('data_hora');



    return false


}


module.exports = {
    listareventoFoto,
    buscareventoFotoId,
    inserireventoFoto,
    atualizareventoFoto,
    excluireventoFoto
}