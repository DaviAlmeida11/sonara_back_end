/******************************************************************************
 * Objetivo: Arquivo responsável pela conexãode cassa de show com cantores
 * Data: 25/04/2026
 * Autor: Davi de Alemida Santos
 * Versão: 1.0
*****************************************************************************/

const  usuarioDAO = require('../../model/DAO/usuario.js')
const  crypto = require('../modulo/crypto-password.js')


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

    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

       
            let validar = await validarDadosUsuario(usuario)

            if(!validar){
            
                // let resultusuarios = await usuarioDAO.setInsertUsers(usuario)

                if(!dadosValidos){

                    let criptografiaDeSenha = crypto.hashPassword(usuario.senha)

                    let usuarioCriptografado = {
                        nome: usuario.nome,
                        email: usuario.email,
                        senha: criptografiaDeSenha,
                        cpf: usuario.cpf,
                        data_nascimento: usuario.data_nascimento,
                        nacionalidade: usuario.nacionalidade,
                        endereco: usuario.endereco

                    }

                    let result = await usuarioDAO.setInsertUsers(usuarioCriptografado)
                

                if(result){

                    let lastID = await usuarioDAO.getSelectLastID()
               
                    if(lastID){
                      
                        usuario.id = lastID
                        MESSAGES.HEADER.status          =   MESSAGES.SUCCESS_CREATED_ITEM.status
                        MESSAGES.HEADER.status_code     =   MESSAGES.SUCCESS_CREATED_ITEM.status_code
                        MESSAGES.HEADER.message         =   MESSAGES.SUCCESS_CREATED_ITEM.message
                        MESSAGES.HEADER.response        =   usuario

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
        }
        }else{
            return MESSAGES.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

const loginUsuario = async function(usuario){

    let MESSAGE = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

        try {

            const user = await usuarioDAO.getUsuarioByUsuarioNome(usuario.usuario);

            if (!user) {

                return MESSAGE.ERROR_REQUIRED_FIELDS;
                
            }

            let senhaVerificada = crypto.verifyPassword(usuario.senha, user.senha)

            if(senhaVerificada){

                delete user.senha
                MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                MESSAGE.HEADER.response.usuario = user

                return MESSAGE.HEADER //200
            }

        } catch (error) {
            return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
        }

}

//Atualiza um usuario buscando pelo ID
const atualizarUsuario = async function(usuario, id, contentType){
  
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
    
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

// const validarDadosUsuario = async function(usuario){
    
    
//     let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

//     if(usuario.nome == '' || usuario.nome == undefined || usuario.nome == null || usuario.nome.length > 100){
//         MESSAGES.ERROR_REQUIRED_FIELDS.message == ' [Nome incorreto]' 
//         return MESSAGES.ERROR_REQUIRED_FIELDS
    
//     }else if(usuario.email == '' || usuario.email == undefined || usuario.email == null || usuario.email.length > 150) {
//            MESSAGES.ERROR_REQUIRED_FIELDS.message == ' [Email incorreto]' 
//         return MESSAGES.ERROR_REQUIRED_FIELDS

//     }else if(usuario.senha == '' || usuario.senha == undefined || usuario.senha == null || usuario.senha.length > 100){
//             MESSAGES.ERROR_REQUIRED_FIELDS.message == ' [Senha incorreto]' 
//         return MESSAGES.ERROR_REQUIRED_FIELDS

//     } else if(usuario.cpf == '' || usuario.cpf == undefined || usuario.cpf == null ||  usuario.cpf.length > 14){
//          MESSAGES.ERROR_REQUIRED_FIELDS.message == ' [CPF incorreto]' 
//         return MESSAGES.ERROR_REQUIRED_FIELDS

//     }else if(usuario.data_nascimento == '' || usuario.data_nascimento == undefined || usuario.data_nascimento == null || usuario.data_nascimento.length > 12){
//          MESSAGES.ERROR_REQUIRED_FIELDS.message == ' [DATA incorreto]' 
//         return MESSAGES.ERROR_REQUIRED_FIELDS
//     }else if(usuario.nacionalidade == '' || usuario.nacionalidade == undefined || usuario.nacionalidade == null || usuario.nacionalidade == Number || usuario.nacionalidade.length > 80){
//         MESSAGES.ERROR_REQUIRED_FIELDS.message == ' [DATA incorreto]' 
//         return MESSAGES.ERROR_REQUIRED_FIELDS
//     }else if(usuario.endereco == '' || usuario.endereco == undefined || usuario.endereco == null ||  usuario.endereco.length > 80){
//          MESSAGES.ERROR_REQUIRED_FIELDS.message == ' [Endereco incorreto]' 
//         return MESSAGES.ERROR_REQUIRED_FIELDS
//     }else{
//         return false
//     }

// }

const validarDadosUsuario = function(usuario) {
    
    const gerarErro = (campo) => ({
        DEFAULT_MESSAGES, 
        message: `${DEFAULT_MESSAGES.ERROR_REQUIRED_FIELDS.message} [Campo: ${campo}]`
    });

    // Validações rápidas
    if (!usuario.nome || usuario.nome.length > 100) 
        return gerarErro('Nome');
    
    if (!usuario.email || usuario.email.length > 150) 
        return gerarErro('Email');

    if (!usuario.senha || usuario.senha.length > 100) 
        return gerarErro('Senha');

    if (!usuario.cpf || usuario.cpf.length > 14) 
        return gerarErro('CPF');

    if (!usuario.data_nascimento || usuario.data_nascimento.length > 12) 
        return gerarErro('Data de Nascimento');

    if (!usuario.nacionalidade || typeof usuario.nacionalidade !== 'string' || usuario.nacionalidade.length > 80) 
        return gerarErro('Nacionalidade');

    if (!usuario.endereco || usuario.endereco.length > 80) 
        return gerarErro('Endereço');

    return false; // Retorna false se tudo estiver OK
}

module.exports = {
    listarUsuarios,
    buscarUsuarioId,
    inserirUsuario,
    atualizarUsuario,
    excluirUsuario,
    loginUsuario
}