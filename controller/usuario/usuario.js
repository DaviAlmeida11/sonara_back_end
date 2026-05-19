/******************************************************************************
 * Objetivo: Arquivo responsável pela conexãode cassa de show com cantores
 * Data: 25/04/2026
 * Autor: Davi de Alemida Santos
 * Versão: 1.0
*****************************************************************************/

const usuarioDAO = require('../../model/DAO/usuario.js')
const crypto = require('../modulo/crypto-password.js')
const enderecoDAO = require('../../model/DAO/endereco.js')
const artistaDAO = require('../../model/DAO/artista.js')
const organizadorDAO = require('../../model/DAO/organizador.js')
const artistaGeneroMusicalDAO = require('../../model/DAO/artista_genero_musical.js')
const viewUsuarioFoto = require('../../model/DAO/VEWS/usuario_foto.js')
const generoMusicais = require('../../model/DAO/genero_musical.js')


const DEFAULT_MESSAGES = require('../modulo/conf_message.js')
const knex = require('../../model/database_conf/knex.js')


const listarUsuarios = async function () {

    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        let resultUsuarios = await usuarioDAO.getSelectAllUsers()

        if (resultUsuarios && resultUsuarios.length > 0) {

            for (let usuario of resultUsuarios) {

                // VIEW de foto
                let fotoBanco = await viewUsuarioFoto.getSelectViewUserPhoto(usuario.id_usuario)

                let foto = []

                if (fotoBanco && fotoBanco.length > 0) {
                    foto = [
                        {
                            id_foto: fotoBanco[0].id_foto,
                            caminho: fotoBanco[0].url_foto
                        }
                    ]
                }

                usuario.foto = foto
            }

            MESSAGES.HEADER.status = MESSAGES.SUCCESS_REQUEST.status
            MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
            MESSAGES.HEADER.response.usuarios = resultUsuarios

            return MESSAGES.HEADER

        } else {
            return MESSAGES.ERROR_NOT_FOUND
        }

    } catch (error) {
        console.log(error)
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

//Retorna um usuario fultrando pelo ID
const buscarUsuarioId = async function (id) {
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        //Validação da chegada do ID
        if (!isNaN(id) && id != '' && id != null && id > 0) {
            let resultusuarios = await usuarioDAO.getSelectByIdUsers(Number(id))

            if (resultusuarios) {
                if (resultusuarios.length > 0) {
                    MESSAGES.HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                    MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                    MESSAGES.HEADER.response.usuarios = resultusuarios[0]

                    return MESSAGES.HEADER //200
                } else {
                    return MESSAGES.ERROR_NOT_FOUND //404
                }
            } else {
                return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500
            }
        } else {
            MESSAGES.ERROR_REQUIRED_FIELDS.message == ' [ID incorreto]'
            return MESSAGES.ERROR_REQUIRED_FIELDS //400
        }

    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}



const buscarOrganizadorUsuarioId = async function (id) {
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        //Validação da chegada do ID
        if (!isNaN(id) && id != '' && id != null && id > 0) {
            let resultusuarios = await usuarioDAO.getSelectByIdUsersOrganizer(Number(id))

            if (resultusuarios) {
                if (resultusuarios.length > 0) {
                    MESSAGES.HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                    MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                    MESSAGES.HEADER.response.usuarios = resultusuarios[0]

                    return MESSAGES.HEADER //200
                } else {
                    return MESSAGES.ERROR_NOT_FOUND //404
                }
            } else {
                return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500
            }
        } else {
            MESSAGES.ERROR_REQUIRED_FIELDS.message == ' [ID incorreto]'
            return MESSAGES.ERROR_REQUIRED_FIELDS //400
        }

    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}



const buscarUsuarioEmail = async function (email) {
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        //Validação da chegada do ID
        if (email != '' && email != null && email != undefined) {
            let resultusuarios = await usuarioDAO.getUsuarioByUsuarioEmail({ email })

            if (resultusuarios) {
                if (resultusuarios.length > 0) {
                    MESSAGES.HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                    MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                    MESSAGES.HEADER.response.usuarios = resultusuarios

                    return MESSAGES.HEADER //200
                } else {
                    return MESSAGES.ERROR_NOT_FOUND //404
                }
            } else {
                return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500
            }
        } else {
            MESSAGES.ERROR_REQUIRED_FIELDS.message == ' [ID incorreto]'
            return MESSAGES.ERROR_REQUIRED_FIELDS //400
        }

    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}





//Insere um  usuario
const inserirUsuario = async function (usuario, contentType) {

    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        if (String(contentType).toUpperCase() !== 'APPLICATION/JSON') {
            return MESSAGES.ERROR_CONTENT_TYPE //415
        }

        if (!usuario.tipo_usuario) {
            return MESSAGES.ERROR_INVALID_PARAMS //400
        }

        let validar = await validarDadosUsuario(usuario)

        if (validar) {
            return validar //400
        }

        let criptografiaDeSenha = crypto.hashPassword(usuario.senha)

        let usuarioCriptografado = {
            nome:               usuario.nome,
            email:              usuario.email,
            senha:              criptografiaDeSenha,
            cpf:                usuario.cpf,
            data_nasc:          usuario.data_nasc,
            nacionalidade_id:   usuario.nacionalidade_id,
            genero_id:          usuario.genero_id,
            criado:             usuario.criado,
            ultima_atualizacao: usuario.ultima_atualizacao,
            telefone:           usuario.telefone,
        }

        let resultUsuario = await usuarioDAO.setInsertUsers(usuarioCriptografado)

        if (!resultUsuario) {
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500
        }

        let lastIDUsuario = await usuarioDAO.getSelectLastID()

        if (!lastIDUsuario) {
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500
        }

        let tipoUsuario = usuario.tipo_usuario.toLowerCase()

        if (tipoUsuario == 'artista') {

            if (!usuario.generos_musicais || !Array.isArray(usuario.generos_musicais) || usuario.generos_musicais.length === 0) {
                return {
                    status: false,
                    status_code: 400,
                    message: 'Artista deve ter pelo menos um gênero musical [Campo: generos_musicais]'
                }
            }

            let artista = {
                nome_artistico: usuario.nome_artistico,
                usuario_id:     lastIDUsuario.id_usuario,
                descricao:      usuario.descricao,
            }

            let resultArtista = await artistaDAO.setInsertArtist(artista)

            if (!resultArtista) {
                return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500
            }

            let lastIDArtista = await artistaDAO.getSelectLastID()

            if (!lastIDArtista) {
                return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500
            }

            // Insere um registro para cada gênero musical
            for (let generoId of usuario.generos_musicais) {

                let artistaGeneroMusical = {
                    genero_musical_id: generoId,
                    artista_id:        lastIDArtista.id_artista
                }

                let resultGenero = await artistaGeneroMusicalDAO.setInsertArtistGendersSong(artistaGeneroMusical)

                if (!resultGenero) {
                    return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500
                }
            }

        } else if (tipoUsuario == 'organizador') {

            let organizador = {
                usuario_id: lastIDUsuario.id_usuario
            }

            let resultOrganizador = await organizadorDAO.setInsertOrganizer(organizador)

            if (!resultOrganizador) {
                return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500
            }

        } else if (tipoUsuario == 'user') {
            // Usuário comum, não precisa inserir em outra tabela

        } else {
            return MESSAGES.ERROR_INVALID_PARAMS //400
        }

        // ================= ENDEREÇO =================
        let enderecoUsuario = {
            cep:         usuario.cep,
            cidade:      usuario.cidade,
            estado:      usuario.estado,
            logradouro:  usuario.logradouro,
            numero:      usuario.numero,
            complemento: usuario.complemento,
            bairro:      usuario.bairro,
            usuario_id:  lastIDUsuario.id_usuario
        }

        let resultEndereco = await enderecoDAO.setInsertAddress(enderecoUsuario)

        if (!resultEndereco) {
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500
        }

        // ================= RETORNO DE SUCESSO =================
        delete usuarioCriptografado.senha
        usuarioCriptografado.id_usuario = lastIDUsuario.id_usuario

        MESSAGES.HEADER.status      = MESSAGES.SUCCESS_CREATED_ITEM.status
        MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_CREATED_ITEM.status_code
        MESSAGES.HEADER.message     = MESSAGES.SUCCESS_CREATED_ITEM.message
        MESSAGES.HEADER.response    = usuarioCriptografado

        return MESSAGES.HEADER //201

    } catch (error) {
        console.log(error)
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

const loginUsuario = async function (usuario) {

    let MESSAGE = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        const user = await usuarioDAO.getUsuarioByUsuarioEmail(usuario.email)
        console.log(user)

        if (!user) {
            return MESSAGE.ERROR_LOGIN
        }

        const senhaVerificada = await crypto.verifyPassword(
            usuario.senha,
            user.senha
        )

        if (senhaVerificada) {

            // Busca as fotos do usuário/evento
            const fotosBanco = await viewUsuarioFoto.getSelectViewUserPhoto(user.id_usuario)

            let fotos = []

            if (fotosBanco && fotosBanco.length > 0) {

                fotos = fotosBanco.map(foto => ({
                    id_foto: foto.id_foto,
                    caminho: foto.url_foto
                }))
            }

            // adiciona fotos no objeto do usuário
            user.fotos = fotos


            MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
            MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code

            MESSAGE.HEADER.response.usuario = user

            return MESSAGE.HEADER

        } else {
            return MESSAGE.ERROR_LOGIN
        }

    } catch (error) {

        console.log(error)

        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }

}

//Atualiza um usuario buscando pelo ID
const atualizarUsuario = async function (usuario, id, contentType) {

    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        if (String(contentType).toUpperCase() !== 'APPLICATION/JSON') {
            return MESSAGES.ERROR_CONTENT_TYPE
        }

        let validarID = await buscarUsuarioId(id)

        if (validarID.status_code !== 200) {
            return validarID
        }

        usuario.id_usuario = Number(id)

        // ================= ATUALIZA ENDEREÇO =================
        let enderecoUsuario = {
            cep: usuario.cep,
            cidade: usuario.cidade,
            estado: usuario.estado,
            logradouro: usuario.logradouro,
            numero: usuario.numero,
            complemento: usuario.complemento,
            bairro: usuario.bairro,
            usuario_id: usuario.id_usuario
        }

        await enderecoDAO.setUpdateAddress(enderecoUsuario)

        // ================= TIPO USUARIO =================
        let tipoUsuario = usuario.tipo_usuario?.toLowerCase()

        if (tipoUsuario === 'artista') {

            let artistaBanco = await artistaDAO.getSelectByUsuarioId(usuario.id_usuario)

            if (artistaBanco) {

                let artista = {
                    nome_artistico: usuario.nome_artistico,
                    descricao: usuario.descricao,
                    usuario_id: usuario.id_usuario
                }

                await artistaDAO.setUpdateArtist(artista)

                if (usuario.generos_musicais && Array.isArray(usuario.generos_musicais)) {

                    await artistaGeneroMusicalDAO.deleteByArtistaId(artistaBanco.id_artista)

                    for (let generoId of usuario.generos_musicais) {
                        await artistaGeneroMusicalDAO.setInsertArtistGendersSong({
                            genero_musical_id: generoId,
                            artista_id: artistaBanco.id_artista
                        })
                    }
                }
            }

        } else if (tipoUsuario === 'organizador') {

            let organizadorBanco = await organizadorDAO.getSelectByUsuarioId(usuario.id_usuario)

            if (!organizadorBanco) {
                await organizadorDAO.setInsertOrganizer({
                    usuario_id: usuario.id_usuario
                })
            }
        }

        
        let fotoBanco = await viewUsuarioFoto.getSelectViewUserPhoto(usuario.id_usuario)

        let foto = {}

        if (fotoBanco && fotoBanco.length > 0) {
            foto = {
                id_foto: fotoBanco[0].id_foto,
                caminho: fotoBanco[0].caminho
            }
        }

        MESSAGES.HEADER.status = MESSAGES.SUCCESS_UPDATED_ITEM.status
        MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_UPDATED_ITEM.status_code
        MESSAGES.HEADER.message = MESSAGES.SUCCESS_UPDATED_ITEM.message
        MESSAGES.HEADER.response = {
            usuario,
            endereco: enderecoUsuario,
            foto
        }

        return MESSAGES.HEADER

    } catch (error) {
        console.log(error)
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}


const excluirUsuario = async function (id) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {


        if (!isNaN(id) && id != '' && id != null && id > 0) {

            let validarID = await buscarUsuarioId(id)

            if (validarID.status_code == 200) {

                let resultusuarios = await usuarioDAO.setDeleteUsers(Number(id))

                if (resultusuarios) {

                    MESSAGES.HEADER.status = MESSAGES.SUCCESS_DELETED_ITEM.status
                    MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_DELETED_ITEM.status_code
                    MESSAGES.HEADER.message = MESSAGES.SUCCESS_DELETED_ITEM.message
                    MESSAGES.HEADER.response.usuario = resultusuarios
                    delete MESSAGES.HEADER.response
                    return MESSAGES.HEADER

                } else {
                    return MESSAGES.ERROR_INTERNAL_SERVER_MODEL
                }
            } else {
                return MESSAGES.ERROR_NOT_FOUND
            }
        } else {
            MESSAGES.ERROR_REQUIRED_FIELDS.message == ' [ID incorreto]'
            return MESSAGES.ERROR_REQUIRED_FIELDS
        }

    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}



const validarDadosUsuario = async function (usuario) {

    const gerarErro = (campo, mensagem) => ({
        status: DEFAULT_MESSAGES.ERROR_REQUIRED_FIELDS.status,
        status_code: DEFAULT_MESSAGES.ERROR_REQUIRED_FIELDS.status_code,
        message: mensagem || `${DEFAULT_MESSAGES.ERROR_REQUIRED_FIELDS.message} [Campo: ${campo}]`
    })

    // validações dos campos obrigatorios

    if (!usuario.nome || usuario.nome.length > 100)
        return gerarErro('Nome')

    if (!usuario.email || usuario.email.length > 150)
        return gerarErro('Email')

    // Validação de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(usuario.email))
        return gerarErro('Email', 'O campo Email está em formato inválido')

    if (!usuario.senha || usuario.senha.length > 100)
        return gerarErro('Senha')

    // Senha deve ter no mínimo 8 caracteres, 1 maiúscula, 1 número e 1 especial
    const senhaRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/
    if (!senhaRegex.test(usuario.senha))
        return gerarErro('Senha', 'A senha deve ter no mínimo 8 caracteres, uma letra maiúscula, um número e um caractere especial')

    if (!usuario.cpf || usuario.cpf.length > 14)
        return gerarErro('CPF')

    if (!usuario.data_nasc || usuario.data_nasc.length > 12)
        return gerarErro('Data de Nascimento')

    if (!usuario.nacionalidade_id || isNaN(usuario.nacionalidade_id))
        return gerarErro('Nacionalidade')

    if (!usuario.genero_id || isNaN(usuario.genero_id))
        return gerarErro('Gênero')

    if (!usuario.telefone || usuario.telefone.length > 20)
        return gerarErro('Telefone')

    if (!usuario.cep || !usuario.cidade || !usuario.estado || !usuario.logradouro || !usuario.numero || !usuario.bairro)
        return gerarErro('Endereço')

    // validações de duplicidade

    // valida email
    const emailExistente = await usuarioDAO.getUsuarioByUsuarioEmail(usuario.email)
    if (emailExistente) {
        return gerarErro('Email', 'Este email já está cadastrado')
    }

    // valida cpf
    const cpfExistente = await usuarioDAO.getUsuarioByUsuarioCPF(usuario.cpf)
    if (cpfExistente) {
        return gerarErro('CPF', 'Este CPF já está cadastrado')
    }
    return false // Tudo OK
}

module.exports = {
    listarUsuarios,
    buscarUsuarioId,
    buscarUsuarioEmail,
    inserirUsuario,
    atualizarUsuario,
    excluirUsuario,
    loginUsuario,
    buscarOrganizadorUsuarioId
}