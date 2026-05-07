/******************************************************************************
 * Objetivo: Arquivo responsável pela conexãode cassa de show com cantores
 * Data: 25/04/2026
 * Autor: Davi de Alemida Santos
 * Versão: 1.0
*****************************************************************************/

const  usuarioFotoDAO = require('../../model/DAO/usuario_foto.js')


const DEFAULT_MESSAGES = require('../modulo/conf_message.js')


const listarUsuarioFoto = async function(){
    
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
       
        let resultusuarioFoto = await usuarioFotoDAO.getSelectAllPhotoUser()
      
        if(resultusuarioFoto){
            if(resultusuarioFoto.length > 0){
            MESSAGES.HEADER.status      = MESSAGES.SUCCESS_REQUEST.status
            MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
            MESSAGES.HEADER.response.usuarioFoto = resultusuarioFoto

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

//Retorna um usuarioFoto fultrando pelo ID
const buscarUsuarioFotoId = async function(id){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        //Validação da chegada do ID
        if(!isNaN(id) && id != '' && id != null && id > 0){
            let resultusuarioFoto = await usuarioFotoDAO.getSelectByIdPhotoUser(Number(id))

            if(resultusuarioFoto){
                if(resultusuarioFoto.length > 0){
                    MESSAGES.HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                    MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                    MESSAGES.HEADER.response.usuarioFoto = resultusuarioFoto[0]

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

//Insere um  usuarioFoto
const inserirUsuarioFoto = async function(usuarioFoto, contentType){

    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Validação do tipo de conteúdo da requisição (Obrigatório ser um JSON)
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            //Chama a função de validar todos os dados do usuarioFoto
            let validar = await validarDadosUsuarioFoto(usuarioFoto)

            if(!validar){
            
                //Processamento
                //Chama a função para inserir um novo usuarioFoto no BD
                let resultusuarioFoto = await usuarioFotoDAO.setInsertPhotoUser(usuarioFoto)

                if(resultusuarioFoto){
                    //Chama a função para receber o ID gerado no BD
                    let lastID = await usuarioFotoDAO.getSelectLastID()
         
                    if(lastID){
                        //Adiciona o ID no JSON com os dados do usuarioFoto
                        usuarioFoto.id_usuario_foto = lastID
                        MESSAGES.HEADER.status          =   MESSAGES.SUCCESS_CREATED_ITEM.status
                        MESSAGES.HEADER.status_code     =   MESSAGES.SUCCESS_CREATED_ITEM.status_code
                        MESSAGES.HEADER.message         =   MESSAGES.SUCCESS_CREATED_ITEM.message
                        MESSAGES.HEADER.response         =   usuarioFoto

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

//Atualiza um usuarioFoto buscando pelo ID
const atualizarUsuarioFoto = async function(usuarioFoto, id, contentType){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Validação do tipo de conteúdo da requisição (Obrigatório ser um JSON)
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

                //Chama a função de validar todos os dados do usuarioFoto
                let validar = await validarDadosUsuarioFoto(usuarioFoto)

                if(!validar){
                
                    //Validação de ID válido, chama a função da controller que verifica no BD se o ID existe e valida o ID
                     let validarID = await buscarUsuarioFotoId(id)
                  
                    if(validarID.status_code == 200){
                        
                        //Adiciona o ID do usuarioFoto no JSON de dados para ser encaminhado ao DAO
                        usuarioFoto.id_usuario_foto = Number(id)

                        //Chama a função para inserir um novo usuarioFoto no BD
                        let resultusuarioFoto = await usuarioFotoDAO.setUpdatePhotoUser(usuarioFoto)

                        if(resultusuarioFoto){
                            MESSAGES.HEADER.status          =   MESSAGES.SUCCESS_UPDATED_ITEM.status
                            MESSAGES.HEADER.status_code     =   MESSAGES.SUCCESS_UPDATED_ITEM.status_code
                            MESSAGES.HEADER.message         =   MESSAGES.SUCCESS_UPDATED_ITEM.message
                            MESSAGES.HEADER.response.usuarioFoto     =   usuarioFoto           

                            return MESSAGES.HEADER //200
                        }else{
                            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500
                        }
                    }else{
                        return validarID //A função buscarusuarioFotoID poderá retornar (400 ou 404 ou 500)
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


const excluirUsuarioFoto = async function(id){
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

      
        if(!isNaN(id) && id != '' && id != null && id > 0){

            let validarID = await buscarUsuarioFotoId(id)

            if(validarID.status_code == 200){

                let resultusuarioFoto = await usuarioFotoDAO.setDeletePhotoUser(Number(id))

                if(resultusuarioFoto){
                    
                        MESSAGES.HEADER.status      = MESSAGES.SUCCESS_DELETED_ITEM.status
                        MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_DELETED_ITEM.status_code
                        MESSAGES.HEADER.message     = MESSAGES.SUCCESS_DELETED_ITEM.message
                        MESSAGES.HEADER.response.usuarioFoto = resultusuarioFoto
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


const validarDadosUsuarioFoto = function(usuarioFoto) {
    
    const gerarErro = (campo) => ({
        DEFAULT_MESSAGES, 
        message: `${DEFAULT_MESSAGES.ERROR_REQUIRED_FIELDS.message} [Campo: ${campo}]`
    });

    // Validações rápidas
     if (usuarioFoto.foto_id == Number && usuarioFoto.foto_id!= '' && usuarioFoto.tipo_id != null && usuarioFoto.foto_id > 0) 
        return gerarErro('id_foto');
    
    if (usuarioFoto.usuario_id == Number && usuarioFoto.usuario_id != '' && usuarioFoto.usuario_id != null && usuarioFoto.usuario_id > 0) 
        return gerarErro('ID_Usuario');


    return false; 
}
module.exports = {
    listarUsuarioFoto,
    buscarUsuarioFotoId,
    inserirUsuarioFoto,
    atualizarUsuarioFoto,
    excluirUsuarioFoto
}