/******************************************************************************
 * Objetivo: Arquivo responsável pela conexãode cassa de show com cantores
 * Data: 25/04/2026
 * Autor: Davi de Alemida Santos
 * Versão: 1.0
*****************************************************************************/

const nacionalidadeDAO = require('../../model/DAO/nacionalidade.js')


const DEFAULT_MESSAGES = require('../modulo/conf_message.js')


const listarnacioNalidades = async function(){
    
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
       
        let resultnacionalidades = await nacionalidadeDAO.getSelectAllNationality()
        
        if(resultnacionalidades){
            if(resultnacionalidades.length > 0){
            MESSAGES.HEADER.status      = MESSAGES.SUCCESS_REQUEST.status
            MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
            MESSAGES.HEADER.response.nacionalidades = resultnacionalidades

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

//Retorna um nacionalidade fultrando pelo ID
const buscarnacioNalidadeId = async function(id){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        //Validação da chegada do ID
        if(!isNaN(id) && id != '' && id != null && id > 0){
            let resultnacionalidades = await nacionalidadeDAO.getSelectByIdNationality(Number(id))

            if(resultnacionalidades){
                if(resultnacionalidades.length > 0){
                    MESSAGES.HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                    MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                    MESSAGES.HEADER.response.nacionalidades = resultnacionalidades

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

//Insere um nacionalidade 
const inserirNacionalidade = async function(nacionalidade, contentType){

    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Validação do tipo de conteúdo da requisição (Obrigatório ser um JSON)
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            //Chama a função de validar todos os dados do nacionalidade
            let validar = await validarDadosnacionalidade(nacionalidade)

            if(!validar){
            
                //Processamento
                //Chama a função para inserir um novo nacionalidade no BD
                let resultnacionalidades = await nacionalidadeDAO.setInsertNationality(nacionalidade)

                if(resultnacionalidades){
                    //Chama a função para receber o ID gerado no BD
                    let lastID = await nacionalidadeDAO.getSelectLastID()
               
                    if(lastID){
                        //Adiciona o ID no JSON com os dados do nacionalidade
                        nacionalidade.id = lastID
                        MESSAGES.HEADER.status          =   MESSAGES.SUCCESS_CREATED_ITEM.status
                        MESSAGES.HEADER.status_code     =   MESSAGES.SUCCESS_CREATED_ITEM.status_code
                        MESSAGES.HEADER.message         =   MESSAGES.SUCCESS_CREATED_ITEM.message
                        MESSAGES.HEADER.response         =   nacionalidade

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

//Atualiza um nacionalidade buscando pelo ID
const atualizarNacionalidade = async function(nacionalidade, id, contentType){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Validação do tipo de conteúdo da requisição (Obrigatório ser um JSON)
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

                //Chama a função de validar todos os dados do nacionalidade
                let validar = await validarDadosNacionalidade(nacionalidade)

                if(!validar){
                
                    //Validação de ID válido, chama a função da controller que verifica no BD se o ID existe e valida o ID
                     let validarID = await buscarnacioNalidadeId(id)

                    if(validarID.status_code == 200){
                        
                        //Adiciona o ID do nacionalidade no JSON de dados para ser encaminhado ao DAO
                        nacionalidade.id_nacionalidade = Number(id)

                        //Chama a função para inserir um novo nacionalidade no BD
                        let resultnacionalidades = await nacionalidadeDAO.setUpdateNationality(nacionalidade)

                        if(resultnacionalidades){
                            MESSAGES.HEADER.status          =   MESSAGES.SUCCESS_UPDATED_ITEM.status
                            MESSAGES.HEADER.status_code     =   MESSAGES.SUCCESS_UPDATED_ITEM.status_code
                            MESSAGES.HEADER.message         =   MESSAGES.SUCCESS_UPDATED_ITEM.message
                            MESSAGES.HEADER.response.nacionalidade     =   nacionalidade           

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


const excluirnacionalidade = async function(id){
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

      
        if(!isNaN(id) && id != '' && id != null && id > 0){

            let validarID = await buscarnacioNalidadeId(id)

            if(validarID.status_code == 200){

                let resultnacionalidades = await nacionalidadeDAO.setDeleteNationality(Number(id))

                if(resultnacionalidades){
                    
                        MESSAGES.HEADER.status      = MESSAGES.SUCCESS_DELETED_ITEM.status
                        MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_DELETED_ITEM.status_code
                        MESSAGES.HEADER.message     = MESSAGES.SUCCESS_DELETED_ITEM.message
                        MESSAGES.HEADER.response.nacionalidade = resultnacionalidades
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


const validarDadosNacionalidade = async function(nacionalidade){
    
    
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    if(nacionalidade.nome == '' || nacionalidade.nome == undefined || nacionalidade.nome == null || nacionalidade.nome.length > 100){
        MESSAGES.ERROR_REQUIRED_FIELDS.message == '[Nome incorreto]' 
        return MESSAGES.ERROR_REQUIRED_FIELDS

    
    }else{
        return false
    }
}

module.exports = {
    listarnacioNalidades,
    buscarnacioNalidadeId,
    inserirNacionalidade,
    atualizarNacionalidade,
    excluirnacionalidade
}