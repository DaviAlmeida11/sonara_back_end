/******************************************************************************
 * Objetivo: Arquivo responsável pela conexãode cassa de show com cantores
 * Data: 25/04/2026
 * Autor: Davi de Alemida Santos
 * Versão: 1.0
*****************************************************************************/

const FotoDAO = require('../../model/DAO/foto.js')

const { uploadFiles } = require('../upload_azure/upload_azure.js')


const DEFAULT_MESSAGES = require('../modulo/conf_message.js')


const listarFotos = async function(){
    
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
       
        let resultFotos = await FotoDAO.getSelectAllPicture()
        
        if(resultFotos){
            if(resultFotos.length > 0){
            MESSAGES.HEADER.status      = MESSAGES.SUCCESS_REQUEST.status
            MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
            MESSAGES.HEADER.response.Fotos = resultFotos

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

//Retorna um Foto fultrando pelo ID
const buscarFotoId = async function(id){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        //Validação da chegada do ID
        if(!isNaN(id) && id != '' && id != null && id > 0){
            let resultFotos = await FotoDAO.getSelectByIdPicture(Number(id))

            if(resultFotos){
                if(resultFotos.length > 0){
                    MESSAGES.HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                    MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                    MESSAGES.HEADER.response.Fotos = resultFotos[0]

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

//Insere um Foto 


const inserirFoto = async function(Foto, file){

    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        let validar = await validarDadosFoto(Foto, file)
        if(validar)
            return validar

        let urlFotoAzure = await uploadFiles(file)

        if(!urlFotoAzure){
            MESSAGES.HEADER.status = false
            MESSAGES.HEADER.status_code = 502
            MESSAGES.HEADER.message = "Erro ao enviar imagem para o Azure Storage."
            return MESSAGES.HEADER
        }

       
        Foto.foto = urlFotoAzure

       
        let resultFotos = await FotoDAO.setInsertPicture(Foto)

        if(resultFotos){

            let lastID = await FotoDAO.getSelectLastID()

            if(lastID){
                Foto.id = lastID

                MESSAGES.HEADER.status      = MESSAGES.SUCCESS_CREATED_ITEM.status
                MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_CREATED_ITEM.status_code
                MESSAGES.HEADER.message     = MESSAGES.SUCCESS_CREATED_ITEM.message
                MESSAGES.HEADER.response    = Foto

                return MESSAGES.HEADER
            }else{
                return MESSAGES.ERROR_INTERNAL_SERVER_MODEL
            }

        }else{
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL
        }

    } catch (error) {
       console.log(error)
    }
}

//Atualiza um Foto buscando pelo ID
const atualizarFoto = async function(Foto, file, id){

    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        if (!file) {
            MESSAGES.HEADER.status = false
            MESSAGES.HEADER.status_code = 400
            MESSAGES.HEADER.message = "Arquivo da foto não enviado."
            return MESSAGES.HEADER
        }

        let validarID = await buscarFotoId(id)
        if(validarID.status_code != 200){
            return validarID
        }

        let urlFotoAzure = await uploadFiles(file)

        if(!urlFotoAzure){
            MESSAGES.HEADER.status = false
            MESSAGES.HEADER.status_code = 502
            MESSAGES.HEADER.message = "Erro ao enviar imagem para o Azure Storage."
            return MESSAGES.HEADER
        }

        Foto.foto = urlFotoAzure
        Foto.id_foto = Number(id)

        let result = await FotoDAO.setUpdatePicture(Foto)

        if(result){
            MESSAGES.HEADER.status      = MESSAGES.SUCCESS_UPDATED_ITEM.status
            MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_UPDATED_ITEM.status_code
            MESSAGES.HEADER.message     = MESSAGES.SUCCESS_UPDATED_ITEM.message
            MESSAGES.HEADER.response    = Foto
            return MESSAGES.HEADER
        }else{
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL
        }

    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const excluirFoto = async function(id){
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

      
        if(!isNaN(id) && id != '' && id != null && id > 0){

            let validarID = await buscarFotoId(id)

            if(validarID.status_code == 200){

                let resultFotos = await FotoDAO.setDeletePicture(Number(id))

                if(resultFotos){
                    
                        MESSAGES.HEADER.status      = MESSAGES.SUCCESS_DELETED_ITEM.status
                        MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_DELETED_ITEM.status_code
                        MESSAGES.HEADER.message     = MESSAGES.SUCCESS_DELETED_ITEM.message
                        MESSAGES.HEADER.response.Foto = resultFotos
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


const validarDadosFoto = async (Foto, file) => {

    if (!file) {
        return {
            status: false,
            status_code: 400,
            message: "Arquivo da foto não enviado."
        }
    }

    return false
}

module.exports = {
    listarFotos,
    buscarFotoId,
    inserirFoto,
    atualizarFoto,
    excluirFoto
}