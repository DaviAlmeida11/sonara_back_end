/******************************************************************************
 * Objetivo: Arquivo responsável pela conexãode cassa de show com cantores
 * Data: 25/04/2026
 * Autor: Davi de Alemida Santos
 * Versão: 1.0
*****************************************************************************/

const  usuarioDAO = require('../../model/DAO/usuario.js')


const DEFAULT_MESSAGES = require('../modulo/conf_message.js')


const listarUsuarios = async function(){
    
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
       
        let resultusuarios = await usuarioDAO.getSelectAllUsers()
        
        if(resultusuarios){
            if(resultusuarios.length > 0){
            MESSAGES.HEADER.status      = MESSAGES.SUCCESS_REQUEST.status
            MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
            MESSAGES.HEADER.response.usuarios = resultusuarios

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

//Retorna um usuario fultrando pelo ID
const buscarUsuarioId = async function(id){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        //Validação da chegada do ID
        if(!isNaN(id) && id != '' && id != null && id > 0){
            let resultusuarios = await usuarioDAO.getSelectByIdUsers(Number(id))

            if(resultusuarios){
                if(resultusuarios.length > 0){
                    MESSAGES.HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                    MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                    MESSAGES.HEADER.response.usuarios = resultusuarios

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

//Insere um  usuario
const inserirUsuario = async function(usuario, contentType){

    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Validação do tipo de conteúdo da requisição (Obrigatório ser um JSON)
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            //Chama a função de validar todos os dados do usuario
            let validar = await validarDadosUsuario(usuario)

            if(!validar){
            
                //Processamento
                //Chama a função para inserir um novo usuario no BD
                let resultusuarios = await usuarioDAO.setInsertUsers(usuario)

                if(resultusuarios){
                    //Chama a função para receber o ID gerado no BD
                    let lastID = await usuarioDAO.getSelectLastID()
               
                    if(lastID){
                        //Adiciona o ID no JSON com os dados do usuario
                        usuario.id = lastID
                        MESSAGES.HEADER.status          =   MESSAGES.SUCCESS_CREATED_ITEM.status
                        MESSAGES.HEADER.status_code     =   MESSAGES.SUCCESS_CREATED_ITEM.status_code
                        MESSAGES.HEADER.message         =   MESSAGES.SUCCESS_CREATED_ITEM.message
                        MESSAGES.HEADER.response         =   usuario

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

//Atualiza um usuario buscando pelo ID
const atualizarUsuario = async function(usuario, id, contentType){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        //Validação do tipo de conteúdo da requisição (Obrigatório ser um JSON)
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

                //Chama a função de validar todos os dados do usuario
                let validar = await validarDadosUsuario(usuario)

                if(!validar){
                
                    //Validação de ID válido, chama a função da controller que verifica no BD se o ID existe e valida o ID
                     let validarID = await buscarUsuarioId(id)

                    if(validarID.status_code == 200){
                        
                        //Adiciona o ID do usuario no JSON de dados para ser encaminhado ao DAO
                        usuario.id_usuario = Number(id)

                        //Chama a função para inserir um novo usuario no BD
                        let resultusuarios = await usuarioDAO.setUpdateUsers(usuario)

                        if(resultusuarios){
                            MESSAGES.HEADER.status          =   MESSAGES.SUCCESS_UPDATED_ITEM.status
                            MESSAGES.HEADER.status_code     =   MESSAGES.SUCCESS_UPDATED_ITEM.status_code
                            MESSAGES.HEADER.message         =   MESSAGES.SUCCESS_UPDATED_ITEM.message
                            MESSAGES.HEADER.response.usuario     =   usuario           

                            return MESSAGES.HEADER //200
                        }else{
                            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500
                        }
                    }else{
                        return validarID //A função buscarusuarioID poderá retornar (400 ou 404 ou 500)
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


const excluirUsuario = async function(id){
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

      
        if(!isNaN(id) && id != '' && id != null && id > 0){

            let validarID = await buscarUsuarioId(id)

            if(validarID.status_code == 200){

                let resultusuarios = await usuarioDAO.setDeleteUsers(Number(id))

                if(resultusuarios){
                    
                        MESSAGES.HEADER.status      = MESSAGES.SUCCESS_DELETED_ITEM.status
                        MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_DELETED_ITEM.status_code
                        MESSAGES.HEADER.message     = MESSAGES.SUCCESS_DELETED_ITEM.message
                        MESSAGES.HEADER.response.usuario = resultusuarios
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


const validarDadosUsuario = async function(usuario){
    
    
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    if(usuario.nome == '' || usuario.nome == undefined || usuario.nome == null || usuario.nome.length > 100){
        MESSAGES.ERROR_REQUIRED_FIELDS.message == ' [Nome incorreto]' 
        return MESSAGES.ERROR_REQUIRED_FIELDS
    
    }else if(usuario.email == '' || usuario.email == undefined || usuario.email == null || usuario.email.length > 150) {
           MESSAGES.ERROR_REQUIRED_FIELDS.message == ' [Email incorreto]' 
        return MESSAGES.ERROR_REQUIRED_FIELDS

    }else if(usuario.senha == '' || usuario.senha == undefined || usuario.senha == null || usuario.senha.length > 100){
            MESSAGES.ERROR_REQUIRED_FIELDS.message == ' [Senha incorreto]' 
        return MESSAGES.ERROR_REQUIRED_FIELDS

    } else if(usuario.cpf == '' || usuario.cpf == undefined || usuario.cpf == null ||  usuario.cpf.length > 14){
         MESSAGES.ERROR_REQUIRED_FIELDS.message == ' [CPF incorreto]' 
        return MESSAGES.ERROR_REQUIRED_FIELDS

    }else if(usuario.data_nascimento == '' || usuario.data_nascimento == undefined || usuario.data_nascimento == null || usuario.data_nascimento.length > 12){
         MESSAGES.ERROR_REQUIRED_FIELDS.message == ' [DATA incorreto]' 
        return MESSAGES.ERROR_REQUIRED_FIELDS
    }else if(usuario.nacionalidade == '' || usuario.nacionalidade == undefined || usuario.nacionalidade == null || usuario.nacionalidade == Number || usuario.nacionalidade.length > 80){
        MESSAGES.ERROR_REQUIRED_FIELDS.message == ' [DATA incorreto]' 
        return MESSAGES.ERROR_REQUIRED_FIELDS
    }else if(usuario.endereco == '' || usuario.endereco == undefined || usuario.endereco == null ||  usuario.endereco.length > 80){
         MESSAGES.ERROR_REQUIRED_FIELDS.message == ' [Endereco incorreto]' 
        return MESSAGES.ERROR_REQUIRED_FIELDS
    }else{
        return false
    }

}

module.exports = {
    listarUsuarios,
    buscarUsuarioId,
    inserirUsuario,
    atualizarUsuario,
    excluirUsuario
}