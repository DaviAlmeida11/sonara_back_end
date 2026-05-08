/******************************************************************************
 * Objetivo: Arquivo responsável pela conexãode cassa de show com cantores
 * Data: 25/04/2026
 * Autor: Davi de Alemida Santos
 * Versão: 1.0
*****************************************************************************/

const  usuarioDAO = require('../../model/DAO/usuario.js')
const  crypto = require('../modulo/crypto-password.js')
const UPLOAD = require('../upload_azure/upload_azure.js')


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
                    MESSAGES.HEADER.response.usuarios = resultusuarios[0]

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

const buscarUsuarioEmail = async function(email){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        //Validação da chegada do ID
        if(email != '' && email != null && email != undefined){
            let resultusuarios = await usuarioDAO.getUsuarioByUsuarioEmail({ email })

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
const inserirUsuario = async function (usuario, contentType, img) {

    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES));

    try {

        // Validação do Content-Type
        if (!contentType || !contentType.toLowerCase().includes('multipart/form-data')) {
            return MESSAGES.ERROR_CONTENT_TYPE; // 415
        }

        // Validação da imagem
        if (!img || !img.originalname || !img.buffer) {
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL; // 500
        }

        // Validação dos dados do usuário
        let validar = await validarDadosUsuario(usuario);

        if (validar !== true) {
            return validar;
        }

        // Upload da imagem
        let urlImg = await UPLOAD.uploadFiles(img);

        if (!urlImg) {
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL;
        }

        // Criptografa senha
        let criptografiaDeSenha = crypto.hashPassword(usuario.senha);

        // Monta objeto do usuário
        let usuarioCriptografado = {
            nome: usuario.nome,
            email: usuario.email,
            senha: criptografiaDeSenha,
            cpf: usuario.cpf,
            data_nascimento: usuario.data_nascimento,
            nacionalidade: usuario.nacionalidade,
            endereco: usuario.endereco,
            img: urlImg
        };

        // Insere no banco
        let result = await usuarioDAO.setInsertUsers(usuarioCriptografado);

        if (!result) {
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL;
        }

        // Busca último ID
        let lastID = await usuarioDAO.getSelectLastID();

        if (!lastID) {
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL;
        }

        // Remove senha do retorno
        delete usuarioCriptografado.senha;

        // Adiciona ID ao retorno
        usuarioCriptografado.id_usuario = lastID.id;

        // Monta resposta
        MESSAGES.HEADER.status = MESSAGES.SUCCESS_CREATED_ITEM.status;
        MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_CREATED_ITEM.status_code;
        MESSAGES.HEADER.message = MESSAGES.SUCCESS_CREATED_ITEM.message;
        MESSAGES.HEADER.response = usuarioCriptografado;

        return MESSAGES.HEADER;

    } catch (error) {

        console.log(error);

        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER;
    }
};

const loginUsuario = async function(usuario){

    let MESSAGE = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

        try {

            const user = await usuarioDAO.getUsuarioByUsuarioEmail( usuario.email);

            console.log(user)

            if (!user) {

                return MESSAGE.ERROR_REQUIRED_FIELDS;
                
            }

            let senhaVerificada = crypto.verifyPassword(usuario.senha, user.senha)


            if(senhaVerificada){

                
                MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                MESSAGE.HEADER.response.usuario = user

                return MESSAGE.HEADER //200
            }else {
            return MESSAGE.ERROR_REQUIRED_FIELDS // 400
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



const validarDadosUsuario = function(usuario) {
    
    const gerarErro = (campo) => ({
        status: DEFAULT_MESSAGES.ERROR_REQUIRED_FIELDS.status,
        status_code: DEFAULT_MESSAGES.ERROR_REQUIRED_FIELDS.status_code,
        message: `${DEFAULT_MESSAGES.ERROR_REQUIRED_FIELDS.message} [Campo: ${campo}]`
    })

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

    if (!usuario.nacionalidade_id || isNaN(usuario.nacionalidade_id))
        return gerarErro('Nacionalidade');

    if (!usuario.endereco_id || isNaN(usuario.endereco_id))
        return gerarErro('Endereço');

    if (!usuario.genero_id || isNaN(usuario.genero_id))
        return gerarErro('Gênero');

    return false; // Retorna false se tudo estiver OK
}

module.exports = {
    listarUsuarios,
    buscarUsuarioId,
    buscarUsuarioEmail,
    inserirUsuario,
    atualizarUsuario,
    excluirUsuario,
    loginUsuario
}