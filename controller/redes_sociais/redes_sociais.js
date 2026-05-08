/******************************************************************************
 * Objetivo: Arquivo responsável pela conexãode cassa de show com cantores
 * Data: 25/04/2026
 * Autor: Davi de Alemida Santos
 * Versão: 1.0
*****************************************************************************/

const RedesSociaisDAO = require('../../model/DAO/redes_sociais.js')


const DEFAULT_MESSAGES = require('../modulo/conf_message.js')


const listarRedesSociaiss = async function(){
    
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
       
        let resultRedesSociaiss = await RedesSociaisDAO.getSelectAllSocialMidia()
        
        if(resultRedesSociaiss){
            if(resultRedesSociaiss.length > 0){
            MESSAGES.HEADER.status      = MESSAGES.SUCCESS_REQUEST.status
            MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
            MESSAGES.HEADER.response.RedesSociais = resultRedesSociaiss

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

//Retorna um RedesSociais fultrando pelo ID
const buscarRedesSociaisId = async function(id){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        //Validação da chegada do ID
        if(!isNaN(id) && id != '' && id != null && id > 0){
            let resultRedesSociais = await RedesSociaisDAO.getSelectByIdSocialMidia(Number(id))

            if(resultRedesSociais){
                if(resultRedesSociais.length > 0){
                    MESSAGES.HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                    MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                    MESSAGES.HEADER.response.RedesSociais = resultRedesSociais[0]

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

//Insere um RedesSociais 
const inserirRedesSociais = async function(RedesSociais, contentType){

    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Validação do tipo de conteúdo da requisição (Obrigatório ser um JSON)
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            //Chama a função de validar todos os dados do RedesSociais
            let validar = await validarDadosRedesSociais(RedesSociais)

            if(!validar){
            
                //Processamento
                //Chama a função para inserir um novo RedesSociais no BD
                let resultRedesSociais = await RedesSociaisDAO.setInserSocialMidia(RedesSociais)

                if(resultRedesSociais){
                    //Chama a função para receber o ID gerado no BD
                    let lastID = await RedesSociaisDAO.getSelectLastID()
               
                    if(lastID){
                        //Adiciona o ID no JSON com os dados do RedesSociais
                        RedesSociais.id_redes_sociais = lastID
                        MESSAGES.HEADER.status          =   MESSAGES.SUCCESS_CREATED_ITEM.status
                        MESSAGES.HEADER.status_code     =   MESSAGES.SUCCESS_CREATED_ITEM.status_code
                        MESSAGES.HEADER.message         =   MESSAGES.SUCCESS_CREATED_ITEM.message
                        MESSAGES.HEADER.response         =   RedesSociais

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

//Atualiza um RedesSociais buscando pelo ID
const atualizarRedesSociais = async function(RedesSociais, id, contentType){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Validação do tipo de conteúdo da requisição (Obrigatório ser um JSON)
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

                //Chama a função de validar todos os dados do RedesSociais
                let validar = await validarDadosRedesSociais(RedesSociais)

                if(!validar){
                
                    //Validação de ID válido, chama a função da controller que verifica no BD se o ID existe e valida o ID
                     let validarID = await buscarRedesSociaisId(id)

                    if(validarID.status_code == 200){
                        
                        //Adiciona o ID do RedesSociais no JSON de dados para ser encaminhado ao DAO
                      RedesSociais.id_redes_sociais = Number(id)

                        //Chama a função para inserir um novo RedesSociais no BD
                        let resultRedesSociaiss = await RedesSociaisDAO.setUpdateSocialMidia(RedesSociais)

                        if(resultRedesSociaiss){
                            MESSAGES.HEADER.status          =   MESSAGES.SUCCESS_UPDATED_ITEM.status
                            MESSAGES.HEADER.status_code     =   MESSAGES.SUCCESS_UPDATED_ITEM.status_code
                            MESSAGES.HEADER.message         =   MESSAGES.SUCCESS_UPDATED_ITEM.message
                            MESSAGES.HEADER.response.RedesSociais     =   RedesSociais           

                            return MESSAGES.HEADER //200
                        }else{
                            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500
                        }
                    }else{
                        return validarID //A função buscarRedesSociaisID poderá retornar (400 ou 404 ou 500)
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


const excluirRedesSociais = async function(id){
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

      
        if(!isNaN(id) && id != '' && id != null && id > 0){

            let validarID = await buscarRedesSociaisId(id)

            if(validarID.status_code == 200){

                let resultRedesSociaiss = await RedesSociaisDAO.setDeleteSocialMidia(Number(id))

                if(resultRedesSociaiss){
                    
                        MESSAGES.HEADER.status      = MESSAGES.SUCCESS_DELETED_ITEM.status
                        MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_DELETED_ITEM.status_code
                        MESSAGES.HEADER.message     = MESSAGES.SUCCESS_DELETED_ITEM.message
                        MESSAGES.HEADER.response.RedesSociais = resultRedesSociaiss
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


const validarDadosRedesSociais = function(redesSociais) {
    
    const gerarErro = (campo) => ({
        DEFAULT_MESSAGES, 
        message: `${DEFAULT_MESSAGES.ERROR_REQUIRED_FIELDS.message} [Campo: ${campo}]`
    });

    // Validações rápidas
    if (!redesSociais.link || redesSociais.link.length > 400) 
        return gerarErro('link');
    
    if (redesSociais.tipo_id == Number && redesSociais.tipo_id!= '' && redesSociais.tipo_id != null && redesSociais.tipo_id > 0) 
        return gerarErro('id_tipo_redes_sociais');

   if (redesSociais.usuario_id == Number && redesSociais.usuario_id!= '' && redesSociais.usuario_id != null && redesSociais.usuario_id> 0) 
        return gerarErro('ID_usuario');


    return false; 
}

module.exports = {
    listarRedesSociaiss,
    buscarRedesSociaisId,
    inserirRedesSociais,
    atualizarRedesSociais,
    excluirRedesSociais
}