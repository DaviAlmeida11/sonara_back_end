/******************************************************************************
 * Objetivo: Arquivo responsável pela conexãode cassa de show com cantores
 * Data: 25/04/2026
 * Autor: Davi de Alemida Santos
 * Versão: 1.0
*****************************************************************************/

const  avaliacaoArtistaDAO = require('../../model/DAO/avaliacao_artista.js')


const DEFAULT_MESSAGES = require('../modulo/conf_message.js')


const listarAvaliacaoArtista = async function(){
    
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
       
        let resultAvaliacaoArtista = await avaliacaoArtistaDAO.getSelectAllArtistReview()
      
        if(resultAvaliacaoArtista){
            if(resultAvaliacaoArtista.length > 0){
            MESSAGES.HEADER.status      = MESSAGES.SUCCESS_REQUEST.status
            MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
            MESSAGES.HEADER.response.eventoOrganizador = resultAvaliacaoArtista

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
const buscarAvaliacaoArtistaId = async function(id){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        //Validação da chegada do ID
        if(!isNaN(id) && id != '' && id != null && id > 0){
            let resultAvaliacaoArtista = await avaliacaoArtistaDAO.getSelectByIdArtistReview(Number(id))

            if(resultAvaliacaoArtista){
                if(resultAvaliacaoArtista.length > 0){
                    MESSAGES.HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                    MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                    MESSAGES.HEADER.response.eventoOrganizador = resultAvaliacaoArtista[0]

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
const inserirAvaliacaoArtista = async function(eventoOrganizador, contentType){

    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Validação do tipo de conteúdo da requisição (Obrigatório ser um JSON)
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            //Chama a função de validar todos os dados do eventoOrganizador
            let validar = await validarDadoseventoOrganizador(eventoOrganizador)

            if(!validar){
            
                //Processamento
                //Chama a função para inserir um novo eventoOrganizador no BD
                let resultAvaliacaoArtista = await avaliacaoArtistaDAO.setInsertArtistReview(eventoOrganizador)

                if(resultAvaliacaoArtista){
                    //Chama a função para receber o ID gerado no BD
                    let lastID = await avaliacaoArtistaDAO.getSelectLastID()
         
                    if(lastID){
                        //Adiciona o ID no JSON com os dados do eventoOrganizador
                        eventoOrganizador.id_avaliacao_artista = lastID
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
const atualizarAvaliacaoArtista = async function(eventoOrganizador, id, contentType){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Validação do tipo de conteúdo da requisição (Obrigatório ser um JSON)
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

                //Chama a função de validar todos os dados do eventoOrganizador
                let validar = await validarDadosAvaliacaoArtista(eventoOrganizador)

                if(!validar){
                
                    //Validação de ID válido, chama a função da controller que verifica no BD se o ID existe e valida o ID
                     let validarID = await buscarAvaliacaoArtistaId(id)
                  
                    if(validarID.status_code == 200){
                        
                        //Adiciona o ID do eventoOrganizador no JSON de dados para ser encaminhado ao DAO
                        eventoOrganizador.id_avaliacao_evento = Number(id)

                        //Chama a função para inserir um novo eventoOrganizador no BD
                        let resultAvaliacaoArtista = await avaliacaoArtistaDAO.setUpdateArtistReview(eventoOrganizador)

                        if(resultAvaliacaoArtista){
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


const excluirAvaliacaoArtista = async function(id){
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

      
        if(!isNaN(id) && id != '' && id != null && id > 0){

            let validarID = await buscarAvaliacaoArtistaId(id)

            if(validarID.status_code == 200){

                let resultAvaliacaoArtista = await avaliacaoArtistaDAO.setDeleteArtistReview(Number(id))

                if(resultAvaliacaoArtista){
                    
                        MESSAGES.HEADER.status      = MESSAGES.SUCCESS_DELETED_ITEM.status
                        MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_DELETED_ITEM.status_code
                        MESSAGES.HEADER.message     = MESSAGES.SUCCESS_DELETED_ITEM.message
                        MESSAGES.HEADER.response.eventoOrganizador = resultAvaliacaoArtista
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


const validarDadosAvaliacaoArtista = function(eventoOrganizador) {
    
    const gerarErro = (campo) => ({
        DEFAULT_MESSAGES, 
        message: `${DEFAULT_MESSAGES.ERROR_REQUIRED_FIELDS.message} [Campo: ${campo}]`
    });

    // Validações rápidas
    if (!eventoOrganizador.numero_estrelas ||  eventoOrganizador.numero_estrelas.length > 30 ) 
             return gerarErro('numero_estrelas'); 
             
    if (eventoOrganizador.usuario_id == Number && eventoOrganizador.usuario_id != '' && eventoOrganizador.usuario_id != null && eventoOrganizador.usuario_id > 0) 
        return gerarErro('ID_usuario');

    if (eventoOrganizador.artista_id == Number && eventoOrganizador.artista_id != '' && eventoOrganizador.artista_id != null && eventoOrganizador.artista_id > 0) {
        return gerarErro('ID_artista');}

    if (!eventoOrganizador.data_avaliacao ||  eventoOrganizador.data_avaliacao.length > 30 ) 
             return gerarErro('numero_estrel'); 
                 
    return false; 
}
module.exports = {
    listarAvaliacaoArtista,
    buscarAvaliacaoArtistaId,
    inserirAvaliacaoArtista,
    atualizarAvaliacaoArtista,
    excluirAvaliacaoArtista
}