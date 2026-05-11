/******************************************************************************
 * Objetivo: Arquivo responsável pela conexãode cassa de show com cantores
 * Data: 25/04/2026
 * Autor: Davi de Alemida Santos
 * Versão: 1.0
*****************************************************************************/

const generoMusicalDAO = require('../../model/DAO/genero_musical.js')


const DEFAULT_MESSAGES = require('../modulo/conf_message.js')


const listarGeneroMusical = async function(){
    
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
       
        let resultGeneroMusical = await generoMusicalDAO.getSelectAllMusicalGeners()
        
        if(resultGeneroMusical){
            if(resultGeneroMusical.length > 0){
            MESSAGES.HEADER.status      = MESSAGES.SUCCESS_REQUEST.status
            MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
            MESSAGES.HEADER.response.GeneroMusical = resultGeneroMusical

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

//Retorna um genero fultrando pelo ID
const buscarGeneroMusicalId = async function(id){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        //Validação da chegada do ID
        if(!isNaN(id) && id != '' && id != null && id > 0){
            let resultGeneroMusical = await generoMusicalDAO.getSelectByIdGender(Number(id))

            if(resultGeneroMusical){
                if(resultGeneroMusical.length > 0){
                    MESSAGES.HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                    MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                    MESSAGES.HEADER.response.GeneroMusical = resultGeneroMusical[0]

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

//Insere um genero 
const inserirGeneroMusical = async function(generoMusical, contentType){

    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Validação do tipo de conteúdo da requisição (Obrigatório ser um JSON)
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            //Chama a função de validar todos os dados do genero
            let validar = await validarDadosGeneroMusical(generoMusical)

            if(!validar){
            
                //Processamento
                //Chama a função para inserir um novo genero no BD
                let resultGeneroMusical = await generoMusicalDAO.setInsertMusicalGeners(generoMusical)

                if(resultGeneroMusical){
                    //Chama a função para receber o ID gerado no BD
                    let lastID = await generoMusicalDAO.getSelectLastID()
         
                    if(lastID){
                        //Adiciona o ID no JSON com os dados do genero
                        generoMusical.id_genero_musical = lastID
                        MESSAGES.HEADER.status          =   MESSAGES.SUCCESS_CREATED_ITEM.status
                        MESSAGES.HEADER.status_code     =   MESSAGES.SUCCESS_CREATED_ITEM.status_code
                        MESSAGES.HEADER.message         =   MESSAGES.SUCCESS_CREATED_ITEM.message
                        MESSAGES.HEADER.response         =   generoMusical

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

//Atualiza um genero buscando pelo ID
const atualizarGeneroMusical = async function(generoMusical, id, contentType){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Validação do tipo de conteúdo da requisição (Obrigatório ser um JSON)
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

                //Chama a função de validar todos os dados do genero
                let validar = await validarDadosGeneroMusical(generoMusical)
      
                if(!validar){
                
                    //Validação de ID válido, chama a função da controller que verifica no BD se o ID existe e valida o ID
                     let validarID = await buscarGeneroMusicalId(id)
             
                    if(validarID.status_code == 200){
                        
                        //Adiciona o ID do genero no JSON de dados para ser encaminhado ao DAO
                        generoMusical.id_genero_musical= Number(id)

                        //Chama a função para inserir um novo genero no BD
                        let resultGeneroMusical = await generoMusicalDAO.setUpdateMusicalGeners(generoMusical)

                        if(resultGeneroMusical){
                            MESSAGES.HEADER.status          =   MESSAGES.SUCCESS_UPDATED_ITEM.status
                            MESSAGES.HEADER.status_code     =   MESSAGES.SUCCESS_UPDATED_ITEM.status_code
                            MESSAGES.HEADER.message         =   MESSAGES.SUCCESS_UPDATED_ITEM.message
                            MESSAGES.HEADER.response.generoMusical     =   generoMusical           

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


const excluirGeneroMusical = async function(id){
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

      
        if(!isNaN(id) && id != '' && id != null && id > 0){

            let validarID = await buscarGeneroMusicalId(id)

            if(validarID.status_code == 200){

                let resultGeneroMusicalMusicais = await generoMusicalDAO.setDeleteMusicalGeners(Number(id))

                if(resultGeneroMusicalMusicais){
                    
                        MESSAGES.HEADER.status      = MESSAGES.SUCCESS_DELETED_ITEM.status
                        MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_DELETED_ITEM.status_code
                        MESSAGES.HEADER.message     = MESSAGES.SUCCESS_DELETED_ITEM.message
                        MESSAGES.HEADER.response.generoMusical = resultGeneroMusicalMusicais
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


const validarDadosGeneroMusical = async function(genero){
    
    
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    if(genero.nome == '' || genero.nome == undefined || genero.nome == null || genero.nome.length > 100){
        MESSAGES.ERROR_REQUIRED_FIELDS.message == '[Nome incorreto]' 
        return MESSAGES.ERROR_REQUIRED_FIELDS

    
    }else{
        return false
    }
}

module.exports = {
    listarGeneroMusical,
    buscarGeneroMusicalId,
    inserirGeneroMusical,
    atualizarGeneroMusical,
    excluirGeneroMusical
}