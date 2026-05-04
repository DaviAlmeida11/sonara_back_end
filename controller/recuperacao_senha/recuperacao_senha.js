/******************************************************************************
 * Objetivo: Arquivo responsável pela conexãode cassa de show com cantores
 * Data: 25/04/2026
 * Autor: Davi de Alemida Santos
 * Versão: 1.0
*****************************************************************************/

const recuperacaoDAO = require('../../model/DAO/recuperacao_senha.js')


const DEFAULT_MESSAGES = require('../modulo/conf_message.js')


const listarRecuperacao = async function(){
    
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
       
        let resultadoRecuperacao = await recuperacaoDAO.getSelectAllNationality()
        
        if(resultadoRecuperacao){
            if(resultadoRecuperacao.length > 0){
            MESSAGES.HEADER.status      = MESSAGES.SUCCESS_REQUEST.status
            MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
            MESSAGES.HEADER.response.nacionalidades = resultadoRecuperacao

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

//Retorna um recuperacao fultrando pelo ID
const buscarnacioRecuperacaoId = async function(id){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        //Validação da chegada do ID
        if(!isNaN(id) && id != '' && id != null && id > 0){
            let resultadoRecuperacao = await recuperacaoDAO.getSelectByIdPassword(Number(id))

            if(resultadoRecuperacao){
                if(resultadoRecuperacao.length > 0){
                    MESSAGES.HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                    MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                    MESSAGES.HEADER.response.nacionalidades = resultadoRecuperacao

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

//Insere um recuperacao 
const inserirRecuperacao = async function(recuperacao, contentType){

    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Validação do tipo de conteúdo da requisição (Obrigatório ser um JSON)
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            //Chama a função de validar todos os dados do recuperacao
            let validar = await validarDadosRecuperacao(recuperacao)

            if(!validar){
            
                //Processamento
                //Chama a função para inserir um novo recuperacao no BD
                let resultadoRecuperacao = await recuperacaoDAO.setInsertPassword(recuperacao)

                if(resultadoRecuperacao){
                    //Chama a função para receber o ID gerado no BD
                    let lastID = await recuperacaoDAO.getSelectLastID()
               
                    if(lastID){
                        //Adiciona o ID no JSON com os dados do recuperacao
                        recuperacao.id_recuperacao = lastID
                        MESSAGES.HEADER.status          =   MESSAGES.SUCCESS_CREATED_ITEM.status
                        MESSAGES.HEADER.status_code     =   MESSAGES.SUCCESS_CREATED_ITEM.status_code
                        MESSAGES.HEADER.message         =   MESSAGES.SUCCESS_CREATED_ITEM.message
                        MESSAGES.HEADER.response         =   recuperacao

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

//Atualiza um recuperacao buscando pelo ID
const atualizarRecuperacao = async function(recuperacao, id, contentType){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Validação do tipo de conteúdo da requisição (Obrigatório ser um JSON)
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

                //Chama a função de validar todos os dados do recuperacao
                let validar = await validarDadosRecuperacao(recuperacao)

                if(!validar){
                
                    //Validação de ID válido, chama a função da controller que verifica no BD se o ID existe e valida o ID
                     let validarID = await buscarnacioRecuperacaoId(id)

                    if(validarID.status_code == 200){
                        
                        //Adiciona o ID do recuperacao no JSON de dados para ser encaminhado ao DAO
                        recuperacao.id_recuperacao = Number(id)

                        //Chama a função para inserir um novo recuperacao no BD
                        let resultadoRecuperacao = await recuperacaoDAO.setUpdatePassword(recuperacao)

                        if(resultadoRecuperacao){
                            MESSAGES.HEADER.status          =   MESSAGES.SUCCESS_UPDATED_ITEM.status
                            MESSAGES.HEADER.status_code     =   MESSAGES.SUCCESS_UPDATED_ITEM.status_code
                            MESSAGES.HEADER.message         =   MESSAGES.SUCCESS_UPDATED_ITEM.message
                            MESSAGES.HEADER.response.recuperacao     =   recuperacao           

                            return MESSAGES.HEADER //200
                        }else{
                            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500
                        }
                    }else{
                        return validarID //A função buscarnacionalidadeID poderá retornar (400 ou 404 ou 500)
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


const excluirRecuperacao = async function(id){
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

      
        if(!isNaN(id) && id != '' && id != null && id > 0){

            let validarID = await buscarnacioRecuperacaoId(id)

            if(validarID.status_code == 200){

                let resultadoRecuperacao = await recuperacaoDAO.setDeletePassword(Number(id))

                if(resultadoRecuperacao){
                    
                        MESSAGES.HEADER.status      = MESSAGES.SUCCESS_DELETED_ITEM.status
                        MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_DELETED_ITEM.status_code
                        MESSAGES.HEADER.message     = MESSAGES.SUCCESS_DELETED_ITEM.message
                        MESSAGES.HEADER.response.recuperacao = resultadoRecuperacao
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



const validarDadosRecuperacao = function(recuperacao) {
    
    const gerarErro = (campo) => ({
        DEFAULT_MESSAGES, 
        message: `${DEFAULT_MESSAGES.ERROR_REQUIRED_FIELDS.message} [Campo: ${campo}]`
    });

     if (recuperacao.usuario_id == Number && recuperacao.usuario_id!= '' && recuperacao.usuario_id != null && recuperacao.usuario_id > 0) 
        return gerarErro('id_tipo_redes_sociais');

    if (!recuperacao.expira_em || recuperacao.expira_em.length > 20) 
        return gerarErro('nome_artista');
    

    if (!recuperacao.tentativas || recuperacao.tentativas.length > 20) 
        return gerarErro('nome_artista');
    
    return false; 
}
module.exports = {
    listarRecuperacao,
    buscarnacioRecuperacaoId, 
    inserirRecuperacao,
    atualizarRecuperacao,
    excluirRecuperacao
}