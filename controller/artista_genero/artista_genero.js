/******************************************************************************
 * Objetivo: Arquivo responsável pela conexãode cassa de show com cantores
 * Data: 25/04/2026
 * Autor: Davi de Alemida Santos
 * Versão: 1.0
*****************************************************************************/

const  ArtistaGeneroDAO = require('../../model/DAO/artista_genero.js')


const DEFAULT_MESSAGES = require('../modulo/conf_message.js')


const listarArtistaGenero = async function(){
    
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
       
        let resultArtistaGenero = await ArtistaGeneroDAO.getSelectAllArtistGenders()
      
        if(resultArtistaGenero){
            if(resultArtistaGenero.length > 0){
            MESSAGES.HEADER.status      = MESSAGES.SUCCESS_REQUEST.status
            MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
            MESSAGES.HEADER.response.ArtistaGenero = resultArtistaGenero

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

//Retorna um ArtistaGenero fultrando pelo ID
const buscarArtistaGeneroId = async function(id){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        //Validação da chegada do ID
        if(!isNaN(id) && id != '' && id != null && id > 0){
            let resultArtistaGenero = await ArtistaGeneroDAO.getSelectByIdArtistGenders(Number(id))

            if(resultArtistaGenero){
                if(resultArtistaGenero.length > 0){
                    MESSAGES.HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                    MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                    MESSAGES.HEADER.response.ArtistaGenero = resultArtistaGenero[0]

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

//Insere um  ArtistaGenero
const inserirArtistaGenero = async function(ArtistaGenero, contentType){

    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Validação do tipo de conteúdo da requisição (Obrigatório ser um JSON)
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            //Chama a função de validar todos os dados do ArtistaGenero
            let validar = await validarDadosArtistaGenero(ArtistaGenero)

            if(!validar){
            
                //Processamento
                //Chama a função para inserir um novo ArtistaGenero no BD
                let resultArtistaGenero = await ArtistaGeneroDAO.setInsertArtistGenders(ArtistaGenero)

                if(resultArtistaGenero){
                    //Chama a função para receber o ID gerado no BD
                    let lastID = await ArtistaGeneroDAO.getSelectLastID()
         
                    if(lastID){
                        //Adiciona o ID no JSON com os dados do ArtistaGenero
                        ArtistaGenero.id_artistaGenero = lastID
                        MESSAGES.HEADER.status          =   MESSAGES.SUCCESS_CREATED_ITEM.status
                        MESSAGES.HEADER.status_code     =   MESSAGES.SUCCESS_CREATED_ITEM.status_code
                        MESSAGES.HEADER.message         =   MESSAGES.SUCCESS_CREATED_ITEM.message
                        MESSAGES.HEADER.response         =   ArtistaGenero

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

//Atualiza um ArtistaGenero buscando pelo ID
const atualizarArtistaGenero = async function(ArtistaGenero, id, contentType){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Validação do tipo de conteúdo da requisição (Obrigatório ser um JSON)
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

                //Chama a função de validar todos os dados do ArtistaGenero
                let validar = await validarDadosArtistaGenero(ArtistaGenero)

                if(!validar){
                
                    //Validação de ID válido, chama a função da controller que verifica no BD se o ID existe e valida o ID
                     let validarID = await buscarArtistaGeneroId(id)
                  
                    if(validarID.status_code == 200){
                        
                        //Adiciona o ID do ArtistaGenero no JSON de dados para ser encaminhado ao DAO
                        ArtistaGenero.id_artistaGenero = Number(id)

                        //Chama a função para inserir um novo ArtistaGenero no BD
                        let resultArtistaGenero = await ArtistaGeneroDAO.setUpdateArtistGenders(ArtistaGenero)

                        if(resultArtistaGenero){
                            MESSAGES.HEADER.status          =   MESSAGES.SUCCESS_UPDATED_ITEM.status
                            MESSAGES.HEADER.status_code     =   MESSAGES.SUCCESS_UPDATED_ITEM.status_code
                            MESSAGES.HEADER.message         =   MESSAGES.SUCCESS_UPDATED_ITEM.message
                            MESSAGES.HEADER.response.ArtistaGenero     =   ArtistaGenero           

                            return MESSAGES.HEADER //200
                        }else{
                            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500
                        }
                    }else{
                        return validarID //A função buscarArtistaGeneroID poderá retornar (400 ou 404 ou 500)
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


const excluirArtistaGenero = async function(id){
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

      
        if(!isNaN(id) && id != '' && id != null && id > 0){

            let validarID = await buscarArtistaGeneroId(id)

            if(validarID.status_code == 200){

                let resultArtistaGenero = await ArtistaGeneroDAO.setDeleteArtistGenders(Number(id))

                if(resultArtistaGenero){
                    
                        MESSAGES.HEADER.status      = MESSAGES.SUCCESS_DELETED_ITEM.status
                        MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_DELETED_ITEM.status_code
                        MESSAGES.HEADER.message     = MESSAGES.SUCCESS_DELETED_ITEM.message
                        MESSAGES.HEADER.response.ArtistaGenero = resultArtistaGenero
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


const validarDadosArtistaGenero = function(ArtistaGenero) {
    
    const gerarErro = (campo) => ({
        DEFAULT_MESSAGES, 
        message: `${DEFAULT_MESSAGES.ERROR_REQUIRED_FIELDS.message} [Campo: ${campo}]`
    });

    // Validações rápidas
  if (ArtistaGenero.genero_id == Number && ArtistaGenero.genero_id != '' && ArtistaGenero.genero_id != null && ArtistaGenero.genero_id > 0) 
        return gerarErro('ID_Genero');
    
    if (ArtistaGenero.artista_id == Number && ArtistaGenero.artista_id != '' && ArtistaGenero.artista_id != null && ArtistaGenero.artista_id > 0) 
        return gerarErro('ID_Artista');

    return false; 
}
module.exports = {
    listarArtistaGenero,
    buscarArtistaGeneroId,
    inserirArtistaGenero,
    atualizarArtistaGenero,
    excluirArtistaGenero
}