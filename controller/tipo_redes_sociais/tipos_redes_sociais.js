/******************************************************************************
 * Objetivo: Arquivo responsável pela conexãode cassa de show com cantores
 * Data: 25/04/2026
 * Autor: Davi de Alemida Santos
 * Versão: 1.0
*****************************************************************************/

const TipoRedesSociaisDAO = require('../../model/DAO/tipo_redes_sociais.js')


const DEFAULT_MESSAGES = require('../modulo/conf_message.js')


const listarTipoRedesSociais = async function(){
    
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
       
        let resultTipoRedesSociais = await TipoRedesSociaisDAO.getSelectAllTypeSocialMidia ()
        
        if(resultTipoRedesSociais){
            if(resultTipoRedesSociais.length > 0){
            MESSAGES.HEADER.status      = MESSAGES.SUCCESS_REQUEST.status
            MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
            MESSAGES.HEADER.response.TipoRedesSociais = resultTipoRedesSociais

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

//Retorna um TipoRedesSociaiss fultrando pelo ID
const buscarTipoRedesSociaisId = async function(id){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        //Validação da chegada do ID
        if(!isNaN(id) && id != '' && id != null && id > 0){
            let resultTipoRedesSociais = await TipoRedesSociaisDAO.getSelectByIdTypeSocialMidia (Number(id))

            if(resultTipoRedesSociais){
                if(resultTipoRedesSociais.length > 0){
                    MESSAGES.HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                    MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                    MESSAGES.HEADER.response.TipoRedesSociais = resultTipoRedesSociais

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

//Insere um TipoRedesSociais 
const inserirTipoRedesSociais = async function(TipoRedesSociais, contentType){

    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Validação do tipo de conteúdo da requisição (Obrigatório ser um JSON)
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            //Chama a função de validar todos os dados do TipoRedesSociaiss
            let validar = await validarDadosTipoRedesSociais(TipoRedesSociais)

            if(!validar){
            
                //Processamento
                //Chama a função para inserir um novo TipoRedesSociais no BD
                let resultTipoRedesSociais = await TipoRedesSociaisDAO.setInserTypeSocialMidia (TipoRedesSociais)

                if(resultTipoRedesSociais){
                    //Chama a função para receber o ID gerado no BD
                    let lastID = await TipoRedesSociaisDAO.getSelectLastID()
               
                    if(lastID){
                        //Adiciona o ID no JSON com os dados do TipoRedesSociais
                        TipoRedesSociais.id_tipo_redes_sociais = lastID
                        MESSAGES.HEADER.status          =   MESSAGES.SUCCESS_CREATED_ITEM.status
                        MESSAGES.HEADER.status_code     =   MESSAGES.SUCCESS_CREATED_ITEM.status_code
                        MESSAGES.HEADER.message         =   MESSAGES.SUCCESS_CREATED_ITEM.message
                        MESSAGES.HEADER.response         =   TipoRedesSociais

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

//Atualiza um TipoRedesSociais buscando pelo ID
const atualizarTipoRedesSociais = async function(TipoRedesSociais, id, contentType){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Validação do tipo de conteúdo da requisição (Obrigatório ser um JSON)
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

                //Chama a função de validar todos os dados do TipoRedesSociaiss
                let validar = await validarDadosTipoRedesSociais(TipoRedesSociais)

                if(!validar){
                
                    //Validação de ID válido, chama a função da controller que verifica no BD se o ID existe e valida o ID
                     let validarID = await buscarTipoRedesSociaisId(id)

                    if(validarID.status_code == 200){
                        
                        //Adiciona o ID do TipoRedesSociais no JSON de dados para ser encaminhado ao DAO
                      TipoRedesSociais.id_redes_sociais = Number(id)

                        //Chama a função para inserir um novo TipoRedesSociaiss no BD
                        let resultTipoRedesSociais = await TipoRedesSociaisDAO.setUpdateTypeSocialMidia (TipoRedesSociais)

                        if(resultTipoRedesSociais){
                            MESSAGES.HEADER.status          =   MESSAGES.SUCCESS_UPDATED_ITEM.status
                            MESSAGES.HEADER.status_code     =   MESSAGES.SUCCESS_UPDATED_ITEM.status_code
                            MESSAGES.HEADER.message         =   MESSAGES.SUCCESS_UPDATED_ITEM.message
                            MESSAGES.HEADER.response.TipoRedesSociais    =   TipoRedesSociais       

                            return MESSAGES.HEADER //200
                        }else{
                            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500
                        }
                    }else{
                        return validarID //A função buscarTipoRedesSociaisID poderá retornar (400 ou 404 ou 500)
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


const excluirTipoRedesSociais = async function(id){
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

      
        if(!isNaN(id) && id != '' && id != null && id > 0){

            let validarID = await buscarTipoRedesSociaisId(id)

            if(validarID.status_code == 200){

                let resultTipoRedesSociais = await TipoRedesSociaisDAO.setDeleteTypeSocialMidia(Number(id))

                if(resultTipoRedesSociais){
                    
                        MESSAGES.HEADER.status      = MESSAGES.SUCCESS_DELETED_ITEM.status
                        MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_DELETED_ITEM.status_code
                        MESSAGES.HEADER.message     = MESSAGES.SUCCESS_DELETED_ITEM.message
                        MESSAGES.HEADER.response.TipoRedesSociais = resultTipoRedesSociais
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


const validarDadosTipoRedesSociais = function(TipoRedesSociais) {
    
    const gerarErro = (campo) => ({
        DEFAULT_MESSAGES, 
        message: `${DEFAULT_MESSAGES.ERROR_REQUIRED_FIELDS.message} [Campo: ${campo}]`
    });

    // Validações rápidas
    if (!TipoRedesSociais.nome || TipoRedesSociais.nome.length > 4100) 
        return gerarErro('nome');


    return false; 
}

module.exports = {
    listarTipoRedesSociais,
    buscarTipoRedesSociaisId,
    inserirTipoRedesSociais,
    atualizarTipoRedesSociais,
    excluirTipoRedesSociais
}