/******************************************************************************
 * Objetivo: Arquivo responsável pela conexãode cassa de show com cantores
 * Data: 25/04/2026
 * Autor: Davi de Alemida Santos
 * Versão: 1.0
*****************************************************************************/

const  enderecoDAO = require('../../model/DAO/endereco.js')


const DEFAULT_MESSAGES = require('../modulo/conf_message.js')


const listarEnderecos = async function(){
    
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
       
        let resultEnderecos = await enderecoDAO.getSelectAllAddress()
        
        if(resultEnderecos){
            if(resultEnderecos.length > 0){
            MESSAGES.HEADER.status      = MESSAGES.SUCCESS_REQUEST.status
            MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
            MESSAGES.HEADER.response.enderecos = resultEnderecos

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

//Retorna um endereco fultrando pelo ID
const buscarEnderecoId = async function(id){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        //Validação da chegada do ID
        if(!isNaN(id) && id != '' && id != null && id > 0){
            let resultEnderecos = await enderecoDAO.getSelectByIdAddress(Number(id))

            if(resultEnderecos){
                if(resultEnderecos.length > 0){
                    MESSAGES.HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                    MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                    MESSAGES.HEADER.response.enderecos = resultEnderecos

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

//Insere um  endereco
const inserirEndereco = async function(endereco, contentType){

    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Validação do tipo de conteúdo da requisição (Obrigatório ser um JSON)
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            //Chama a função de validar todos os dados do endereco
            let validar = await validarDadosEndereco(endereco)

            if(!validar){
            
                //Processamento
                //Chama a função para inserir um novo endereco no BD
                let resultEnderecos = await enderecoDAO.setInsertAddress(endereco)

                if(resultEnderecos){
                    //Chama a função para receber o ID gerado no BD
                    let lastID = await enderecoDAO.getSelectLastID()
               
                    if(lastID){
                        //Adiciona o ID no JSON com os dados do endereco
                        endereco.id = lastID
                        MESSAGES.HEADER.status          =   MESSAGES.SUCCESS_CREATED_ITEM.status
                        MESSAGES.HEADER.status_code     =   MESSAGES.SUCCESS_CREATED_ITEM.status_code
                        MESSAGES.HEADER.message         =   MESSAGES.SUCCESS_CREATED_ITEM.message
                        MESSAGES.HEADER.response         =   endereco

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

//Atualiza um endereco buscando pelo ID
const atualizarEndereco = async function(endereco, id, contentType){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Validação do tipo de conteúdo da requisição (Obrigatório ser um JSON)
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

                //Chama a função de validar todos os dados do endereco
                let validar = await validarDadosEndereco(endereco)

                if(!validar){
                
                    //Validação de ID válido, chama a função da controller que verifica no BD se o ID existe e valida o ID
                     let validarID = await buscarEnderecoId(id)

                    if(validarID.status_code == 200){
                        
                        //Adiciona o ID do endereco no JSON de dados para ser encaminhado ao DAO
                        endereco.id_endereco = Number(id)

                        //Chama a função para inserir um novo endereco no BD
                        let resultEnderecos = await enderecoDAO.setUpdateAddress(endereco)

                        if(resultEnderecos){
                            MESSAGES.HEADER.status          =   MESSAGES.SUCCESS_UPDATED_ITEM.status
                            MESSAGES.HEADER.status_code     =   MESSAGES.SUCCESS_UPDATED_ITEM.status_code
                            MESSAGES.HEADER.message         =   MESSAGES.SUCCESS_UPDATED_ITEM.message
                            MESSAGES.HEADER.response.endereco     =   endereco           

                            return MESSAGES.HEADER //200
                        }else{
                            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500
                        }
                    }else{
                        return validarID //A função buscarenderecoID poderá retornar (400 ou 404 ou 500)
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


const excluirEndereco = async function(id){
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

      
        if(!isNaN(id) && id != '' && id != null && id > 0){

            let validarID = await buscarEnderecoId(id)

            if(validarID.status_code == 200){

                let resultEnderecos = await enderecoDAO.setDeleteAddress(Number(id))

                if(resultEnderecos){
                    
                        MESSAGES.HEADER.status      = MESSAGES.SUCCESS_DELETED_ITEM.status
                        MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_DELETED_ITEM.status_code
                        MESSAGES.HEADER.message     = MESSAGES.SUCCESS_DELETED_ITEM.message
                        MESSAGES.HEADER.response.endereco = resultEnderecos
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


const validarDadosEndereco = async function(endereco){
    
    
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    if(endereco.cep == '' || endereco.cep == undefined || endereco.cep == null || endereco.cep.length > 11){
        MESSAGES.ERROR_REQUIRED_FIELDS.message == ' [Nome incorreto]' 
        return MESSAGES.ERROR_REQUIRED_FIELDS
    
    }else if(endereco.cidade == '' || endereco.cidade == undefined || endereco.cidade == null || endereco.cidade.length > 170) {
           MESSAGES.ERROR_REQUIRED_FIELDS.message == ' [Email incorreto]' 
        return MESSAGES.ERROR_REQUIRED_FIELDS

    }else if(endereco.estado == '' || endereco.estado == undefined || endereco.estado == null || endereco.estado.length > 25){
            MESSAGES.ERROR_REQUIRED_FIELDS.message == ' [Senha incorreto]' 
        return MESSAGES.ERROR_REQUIRED_FIELDS

    } else if(endereco.logradouro == '' || endereco.logradouro == undefined || endereco.logradouro == null ||  endereco.logradouro.length > 14){
         MESSAGES.ERROR_REQUIRED_FIELDS.message == ' [CPF incorreto]' 
        return MESSAGES.ERROR_REQUIRED_FIELDS

    }else if(endereco.numero == '' || endereco.numero == undefined || endereco.numero == null || endereco.numero.length > 30){
         MESSAGES.ERROR_REQUIRED_FIELDS.message == ' [DATA incorreto]' 
        return MESSAGES.ERROR_REQUIRED_FIELDS
   
    }else{
        return false
    }

}

module.exports = {
    listarEnderecos,
    buscarEnderecoId,
    inserirEndereco,
    atualizarEndereco,
    excluirEndereco
}