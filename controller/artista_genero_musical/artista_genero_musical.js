/******************************************************************************
 * Objetivo: Arquivo responsável pela conexãode cassa de show com cantores
 * Data: 25/04/2026
 * Autor: Davi de Alemida Santos
 * Versão: 1.0
*****************************************************************************/

const  ArtistaGeneroMusicalDAO = require('../../model/DAO/artista_genero_musical.js')


const DEFAULT_MESSAGES = require('../modulo/conf_message.js')


const listarArtistaGeneroMusical = async function(){
    
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
       
        let resultArtistaGeneroMusical = await ArtistaGeneroMusicalDAO.getSelectAllArtistGendersSong()
      
        if(resultArtistaGeneroMusical){
            if(resultArtistaGeneroMusical.length > 0){
            MESSAGES.HEADER.status      = MESSAGES.SUCCESS_REQUEST.status
            MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
            MESSAGES.HEADER.response.ArtistaGeneroMusical = resultArtistaGeneroMusical

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

//Retorna um ArtistaGeneroMusical fultrando pelo ID
const buscarArtistaGeneroMusicalId = async function(id){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        //Validação da chegada do ID
        if(!isNaN(id) && id != '' && id != null && id > 0){
            let resultArtistaGeneroMusical = await ArtistaGeneroMusicalDAO.getSelectByIdArtistGendersSong(Number(id))

            if(resultArtistaGeneroMusical){
                if(resultArtistaGeneroMusical.length > 0){
                    MESSAGES.HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                    MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                    MESSAGES.HEADER.response.ArtistaGeneroMusical = resultArtistaGeneroMusical[0]

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

//Insere um  ArtistaGeneroMusical
const inserirArtistaGeneroMusical = async function(ArtistaGeneroMusical, contentType){

    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Validação do tipo de conteúdo da requisição (Obrigatório ser um JSON)
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            //Chama a função de validar todos os dados do ArtistaGeneroMusical
            let validar = await validarDadosArtistaGeneroMusical(ArtistaGeneroMusical)

            if(!validar){
            
                //Processamento
                //Chama a função para inserir um novo ArtistaGeneroMusical no BD
                let resultArtistaGeneroMusical = await ArtistaGeneroMusicalDAO.setInsertArtistGendersSong(ArtistaGeneroMusical)

                if(resultArtistaGeneroMusical){
                    //Chama a função para receber o ID gerado no BD
                    let lastID = await ArtistaGeneroMusicalDAO.getSelectLastID()
         
                    if(lastID){
                        //Adiciona o ID no JSON com os dados do ArtistaGeneroMusical
                        ArtistaGeneroMusical.id_artista_genero_musical = lastID
                        MESSAGES.HEADER.status          =   MESSAGES.SUCCESS_CREATED_ITEM.status
                        MESSAGES.HEADER.status_code     =   MESSAGES.SUCCESS_CREATED_ITEM.status_code
                        MESSAGES.HEADER.message         =   MESSAGES.SUCCESS_CREATED_ITEM.message
                        MESSAGES.HEADER.response         =   ArtistaGeneroMusical

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

//Atualiza um ArtistaGeneroMusical buscando pelo ID
const atualizarArtistaGeneroMusical = async function(ArtistaGeneroMusical, id, contentType){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Validação do tipo de conteúdo da requisição (Obrigatório ser um JSON)
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

                //Chama a função de validar todos os dados do ArtistaGeneroMusical
                let validar = await validarDadosArtistaGeneroMusical(ArtistaGeneroMusical)

                if(!validar){
                
                    //Validação de ID válido, chama a função da controller que verifica no BD se o ID existe e valida o ID
                     let validarID = await buscarArtistaGeneroMusicalId(id)
                  
                    if(validarID.status_code == 200){
                        
                        //Adiciona o ID do ArtistaGeneroMusical no JSON de dados para ser encaminhado ao DAO
                        ArtistaGeneroMusical.id_artista_genero_musical = Number(id)

                        //Chama a função para inserir um novo ArtistaGeneroMusical no BD
                        let resultArtistaGeneroMusical = await ArtistaGeneroMusicalDAO.setUpdateArtistGendersSong(ArtistaGeneroMusical)

                        if(resultArtistaGeneroMusical){
                            MESSAGES.HEADER.status          =   MESSAGES.SUCCESS_UPDATED_ITEM.status
                            MESSAGES.HEADER.status_code     =   MESSAGES.SUCCESS_UPDATED_ITEM.status_code
                            MESSAGES.HEADER.message         =   MESSAGES.SUCCESS_UPDATED_ITEM.message
                            MESSAGES.HEADER.response.ArtistaGeneroMusical     =   ArtistaGeneroMusical           

                            return MESSAGES.HEADER //200
                        }else{
                            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500
                        }
                    }else{
                        return validarID //A função buscarArtistaGeneroMusicalID poderá retornar (400 ou 404 ou 500)
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


const excluirArtistaGeneroMusical = async function(id){
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

      
        if(!isNaN(id) && id != '' && id != null && id > 0){

            let validarID = await buscarArtistaGeneroMusicalId(id)

            if(validarID.status_code == 200){

                let resultArtistaGeneroMusical = await ArtistaGeneroMusicalDAO.setDeleteArtistGendersSong(Number(id))

                if(resultArtistaGeneroMusical){
                    
                        MESSAGES.HEADER.status      = MESSAGES.SUCCESS_DELETED_ITEM.status
                        MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_DELETED_ITEM.status_code
                        MESSAGES.HEADER.message     = MESSAGES.SUCCESS_DELETED_ITEM.message
                        MESSAGES.HEADER.response.ArtistaGeneroMusical = resultArtistaGeneroMusical
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


const validarDadosArtistaGeneroMusical = function(ArtistaGeneroMusical) {
    
    const gerarErro = (campo) => ({
        DEFAULT_MESSAGES, 
        message: `${DEFAULT_MESSAGES.ERROR_REQUIRED_FIELDS.message} [Campo: ${campo}]`
    });

    // Validações rápidas
  if (ArtistaGeneroMusical.genero_musical_id == Number && ArtistaGeneroMusical.genero_musical_id != '' && ArtistaGeneroMusical.genero_musical_id != null && ArtistaGeneroMusical.genero_musical_id > 0) 
        return gerarErro('ID_Genero_Musical');
    
    if (ArtistaGeneroMusical.artista_id == Number && ArtistaGeneroMusical.artista_id != '' && ArtistaGeneroMusical.artista_id != null && ArtistaGeneroMusical.artista_id > 0) 
        return gerarErro('ID_Artista');

    return false; 
}
module.exports = {
    listarArtistaGeneroMusical,
    buscarArtistaGeneroMusicalId,
    inserirArtistaGeneroMusical,
    atualizarArtistaGeneroMusical,
    excluirArtistaGeneroMusical
}