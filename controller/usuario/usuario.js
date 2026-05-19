/******************************************************************************
 * Objetivo: Controller de usuário - CORRIGIDO
 * Data: 25/04/2026
 * Autor: Davi de Almeida Santos
 * Versão: 1.1
 *
 * CORREÇÕES:
 *  - validarDadosUsuario: "usuario.foto = undefined" → "usuario.foto === undefined"
 *    (era atribuição, não comparação — sempre retornava erro de foto)
 *  - validarDadosUsuario: "isNaN(usuario)" → "isNaN(usuario.nacionalidade_id)"
 *  - inserirUsuario: validação movida para DEPOIS do upload da foto
 *  - loginUsuario: passava objeto {email,senha} para getUsuarioByUsuarioEmail
 *    que espera string; corrigido para passar usuario.email
 *****************************************************************************/

const usuarioDAO        = require('../../model/DAO/usuario.js')
const crypto            = require('../modulo/crypto-password.js')
const enderecoDAO       = require('../../model/DAO/endereco.js')
const artistaDAO        = require('../../model/DAO/artista.js')
const organizadorDAO    = require('../../model/DAO/organizador.js')
const artistaGeneroMusicalDAO = require('../../model/DAO/artista_genero_musical.js')
const viewUsuarioFoto   = require('../../model/DAO/VEWS/usuario_foto.js')

const DEFAULT_MESSAGES  = require('../modulo/conf_message.js')


// ─────────────────────────────────────────────────────────────────────────────
// LISTAR
// ─────────────────────────────────────────────────────────────────────────────
const listarUsuarios = async function () {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        let resultUsuarios = await usuarioDAO.getSelectAllUsers()

        if (resultUsuarios && resultUsuarios.length > 0) {
            for (let usuario of resultUsuarios) {
                let fotoBanco = await viewUsuarioFoto.getSelectViewUserPhoto(usuario.id_usuario)
                usuario.foto = (fotoBanco && fotoBanco.length > 0)
                    ? [{ id_foto: fotoBanco[0].id_foto, caminho: fotoBanco[0].url_foto }]
                    : []
            }

            MESSAGES.HEADER.status      = MESSAGES.SUCCESS_REQUEST.status
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


// ─────────────────────────────────────────────────────────────────────────────
// BUSCAR POR ID
// ─────────────────────────────────────────────────────────────────────────────
const buscarUsuarioId = async function (id) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if (!isNaN(id) && id != '' && id != null && id > 0) {
            let resultusuarios = await usuarioDAO.getSelectByIdUsers(Number(id))

            if (resultusuarios) {
                if (resultusuarios.length > 0) {
                    MESSAGES.HEADER.status      = MESSAGES.SUCCESS_REQUEST.status
                    MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                    MESSAGES.HEADER.response.usuarios = resultusuarios[0]
                    return MESSAGES.HEADER          // 200
                } else {
                    return MESSAGES.ERROR_NOT_FOUND // 404
                }
            } else {
                return MESSAGES.ERROR_INTERNAL_SERVER_MODEL // 500
            }
        } else {
            return MESSAGES.ERROR_REQUIRED_FIELDS   // 400
        }

    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}


// ─────────────────────────────────────────────────────────────────────────────
// BUSCAR ORGANIZADOR POR ID DE USUÁRIO
// ─────────────────────────────────────────────────────────────────────────────
const buscarOrganizadorUsuarioId = async function (id) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if (!isNaN(id) && id != '' && id != null && id > 0) {
            let resultusuarios = await usuarioDAO.getSelectByIdUsersOrganizer(Number(id))

            if (resultusuarios) {
                if (resultusuarios.length > 0) {
                    MESSAGES.HEADER.status      = MESSAGES.SUCCESS_REQUEST.status
                    MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                    MESSAGES.HEADER.response.usuarios = resultusuarios[0]
                    return MESSAGES.HEADER
                } else {
                    return MESSAGES.ERROR_NOT_FOUND
                }
            } else {
                return MESSAGES.ERROR_INTERNAL_SERVER_MODEL
            }
        } else {
            return MESSAGES.ERROR_REQUIRED_FIELDS
        }

    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}


// ─────────────────────────────────────────────────────────────────────────────
// BUSCAR POR EMAIL
// ─────────────────────────────────────────────────────────────────────────────
const buscarUsuarioEmail = async function (email) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if (email != '' && email != null && email != undefined) {
            let resultusuarios = await usuarioDAO.getUsuarioByUsuarioEmail(email)

            if (resultusuarios) {
                MESSAGES.HEADER.status      = MESSAGES.SUCCESS_REQUEST.status
                MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                MESSAGES.HEADER.response.usuarios = resultusuarios
                return MESSAGES.HEADER
            } else {
                return MESSAGES.ERROR_NOT_FOUND
            }
        } else {
            return MESSAGES.ERROR_REQUIRED_FIELDS
        }

    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}


// ─────────────────────────────────────────────────────────────────────────────
// INSERIR
// CORREÇÃO PRINCIPAL: validação movida para depois do upload da foto
// ─────────────────────────────────────────────────────────────────────────────
const inserirUsuario = async function (usuario, file) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        // 1. Campos mínimos para não estourar nas etapas seguintes
        if (!usuario.email || !usuario.senha || !usuario.tipo_usuario) {
            return MESSAGES.ERROR_INVALID_PARAMS
        }

        // 2. Upload da foto ANTES da validação completa, para que
        //    usuario.foto já esteja preenchido quando validarDadosUsuario rodar
        if (file) {
            let urlFotoAzure = await uploadFiles(file)

            if (!urlFotoAzure) {
                return {
                    status: false,
                    status_code: 502,
                    message: 'Erro ao enviar imagem para o Azure Storage.'
                }
            }

            usuario.foto = urlFotoAzure
        }

        // 3. Validação completa dos dados (foto já resolvida acima)
        let validar = await validarDadosUsuario(usuario)
        if (validar) return validar

        // 4. Criptografia da senha
        let criptografiaDeSenha = crypto.hashPassword(usuario.senha)

        let usuarioCriptografado = {
            nome:             usuario.nome,
            email:            usuario.email,
            senha:            criptografiaDeSenha,
            cpf:              usuario.cpf,
            data_nasc:        usuario.data_nasc,
            nacionalidade_id: usuario.nacionalidade_id,
            genero_id:        usuario.genero_id,
            telefone:         usuario.telefone,
            foto:             usuario.foto || null,
        }

        let resultUsuario = await usuarioDAO.setInsertUsers(usuarioCriptografado)
        if (!resultUsuario) return MESSAGES.ERROR_INTERNAL_SERVER_MODEL

        let lastIDUsuario = await usuarioDAO.getSelectLastID()
        if (!lastIDUsuario) return MESSAGES.ERROR_INTERNAL_SERVER_MODEL

        // 5. Tipo de usuário
        let tipoUsuario = (usuario.tipo_usuario || '').toLowerCase()

        if (tipoUsuario === 'artista') {
            if (!Array.isArray(usuario.generos_musicais) || usuario.generos_musicais.length === 0) {
                return {
                    status: false,
                    status_code: 400,
                    message: 'Artista deve ter ao menos um gênero musical'
                }
            }

            await artistaDAO.setInsertArtist({
                nome_artistico: usuario.nome_artistico,
                usuario_id:     lastIDUsuario.id_usuario,
                descricao:      usuario.descricao,
            })

            let lastIDArtista = await artistaDAO.getSelectLastID()

            for (let generoId of usuario.generos_musicais) {
                await artistaGeneroMusicalDAO.setInsertArtistGendersSong({
                    genero_musical_id: generoId,
                    artista_id:        lastIDArtista.id_artista,
                })
            }

        } else if (tipoUsuario === 'organizador') {
            await organizadorDAO.setInsertOrganizer({
                usuario_id: lastIDUsuario.id_usuario
            })
        }

        // 6. Endereço
        await enderecoDAO.setInsertAddress({
            cep:         usuario.cep,
            cidade:      usuario.cidade,
            estado:      usuario.estado,
            logradouro:  usuario.logradouro,
            numero:      usuario.numero,
            complemento: usuario.complemento,
            bairro:      usuario.bairro,
            usuario_id:  lastIDUsuario.id_usuario,
        })

        // 7. Resposta (sem expor senha)
        delete usuarioCriptografado.senha
        usuarioCriptografado.id_usuario = lastIDUsuario.id_usuario

        MESSAGES.HEADER.status      = MESSAGES.SUCCESS_CREATED_ITEM.status
        MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_CREATED_ITEM.status_code
        MESSAGES.HEADER.message     = MESSAGES.SUCCESS_CREATED_ITEM.message
        MESSAGES.HEADER.response    = usuarioCriptografado

        return MESSAGES.HEADER

    } catch (error) {
        console.log(error)
        return { status: false, status_code: 500, message: 'Erro interno no servidor' }
    }
}


// ─────────────────────────────────────────────────────────────────────────────
// LOGIN
// CORREÇÃO: passava objeto {email,senha} para getUsuarioByUsuarioEmail;
//           a função espera uma string de email
// ─────────────────────────────────────────────────────────────────────────────
const loginUsuario = async function (usuario) {
    let MESSAGE = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        // CORRIGIDO: passa usuario.email (string), não o objeto inteiro
        const user = await usuarioDAO.getUsuarioByUsuarioEmail(usuario.email)

        if (!user) {
            return MESSAGE.ERROR_LOGIN
        }

        const senhaVerificada = await crypto.verifyPassword(usuario.senha, user.senha)

        if (senhaVerificada) {
            const fotosBanco = await viewUsuarioFoto.getSelectViewUserPhoto(user.id_usuario)

            user.fotos = (fotosBanco && fotosBanco.length > 0)
                ? fotosBanco.map(foto => ({ id_foto: foto.id_foto, caminho: foto.url_foto }))
                : []

            MESSAGE.HEADER.status         = MESSAGE.SUCCESS_REQUEST.status
            MESSAGE.HEADER.status_code    = MESSAGE.SUCCESS_REQUEST.status_code
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


// ─────────────────────────────────────────────────────────────────────────────
// ATUALIZAR
// ─────────────────────────────────────────────────────────────────────────────
const atualizarUsuario = async function (usuario, id, file, contentType) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if (String(contentType).toUpperCase().includes('APPLICATION/JSON') === false
            && !contentType.toLowerCase().includes('multipart/form-data')) {
            return MESSAGES.ERROR_CONTENT_TYPE
        }

        let validarID = await buscarUsuarioId(id)
        if (validarID.status_code !== 200) return validarID

        usuario.id_usuario = Number(id)

        if (file) {
            let urlFotoAzure = await uploadFiles(file)
            if (!urlFotoAzure) {
                return { status: false, status_code: 502, message: 'Erro ao enviar imagem para o Azure Storage.' }
            }
            usuario.foto = urlFotoAzure
        }

        let enderecoUsuario = {
            cep:         usuario.cep,
            cidade:      usuario.cidade,
            estado:      usuario.estado,
            logradouro:  usuario.logradouro,
            numero:      usuario.numero,
            complemento: usuario.complemento,
            bairro:      usuario.bairro,
            usuario_id:  usuario.id_usuario,
        }

        await enderecoDAO.setUpdateAddress(enderecoUsuario)

        let tipoUsuario = usuario.tipo_usuario?.toLowerCase()

        if (tipoUsuario === 'artista') {
            let artistaBanco = await artistaDAO.getSelectByUsuarioId(usuario.id_usuario)

            if (artistaBanco) {
                await artistaDAO.setUpdateArtist({
                    nome_artistico: usuario.nome_artistico,
                    descricao:      usuario.descricao,
                    usuario_id:     usuario.id_usuario,
                })

                if (usuario.generos_musicais && Array.isArray(usuario.generos_musicais)) {
                    await artistaGeneroMusicalDAO.deleteByArtistaId(artistaBanco.id_artista)

                    for (let generoId of usuario.generos_musicais) {
                        await artistaGeneroMusicalDAO.setInsertArtistGendersSong({
                            genero_musical_id: generoId,
                            artista_id:        artistaBanco.id_artista,
                        })
                    }
                }
            }

        } else if (tipoUsuario === 'organizador') {
            let organizadorBanco = await organizadorDAO.getSelectByUsuarioId(usuario.id_usuario)
            if (!organizadorBanco) {
                await organizadorDAO.setInsertOrganizer({ usuario_id: usuario.id_usuario })
            }
        }

        let fotoBanco = await viewUsuarioFoto.getSelectViewUserPhoto(usuario.id_usuario)
        let foto = (fotoBanco && fotoBanco.length > 0)
            ? { id_foto: fotoBanco[0].id_foto, caminho: fotoBanco[0].url_foto }
            : {}

        MESSAGES.HEADER.status      = MESSAGES.SUCCESS_UPDATED_ITEM.status
        MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_UPDATED_ITEM.status_code
        MESSAGES.HEADER.message     = MESSAGES.SUCCESS_UPDATED_ITEM.message
        MESSAGES.HEADER.response    = { usuario, endereco: enderecoUsuario, foto }

        return MESSAGES.HEADER

    } catch (error) {
        console.log(error)
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}


// ─────────────────────────────────────────────────────────────────────────────
// EXCLUIR
// ─────────────────────────────────────────────────────────────────────────────
const excluirUsuario = async function (id) {
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
        if (!isNaN(id) && id != '' && id != null && id > 0) {
            let validarID = await buscarUsuarioId(id)

            if (validarID.status_code === 200) {
                let resultusuarios = await usuarioDAO.setDeleteUsers(Number(id))

                if (resultusuarios) {
                    MESSAGES.HEADER.status      = MESSAGES.SUCCESS_DELETED_ITEM.status
                    MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_DELETED_ITEM.status_code
                    MESSAGES.HEADER.message     = MESSAGES.SUCCESS_DELETED_ITEM.message
                    return MESSAGES.HEADER
                } else {
                    return MESSAGES.ERROR_INTERNAL_SERVER_MODEL
                }
            } else {
                return MESSAGES.ERROR_NOT_FOUND
            }
        } else {
            return MESSAGES.ERROR_REQUIRED_FIELDS
        }

    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}


// ─────────────────────────────────────────────────────────────────────────────
// VALIDAR DADOS
// CORREÇÕES:
//   - "usuario.foto = undefined" → "usuario.foto === undefined" (era atribuição!)
//   - "isNaN(usuario)" → "isNaN(usuario.nacionalidade_id)"
//   - foto não é campo obrigatório — removida a validação que bloqueava sempre
// ─────────────────────────────────────────────────────────────────────────────
const validarDadosUsuario = async function (usuario) {
    const gerarErro = (campo, mensagem) => ({
        status:      DEFAULT_MESSAGES.ERROR_REQUIRED_FIELDS.status,
        status_code: DEFAULT_MESSAGES.ERROR_REQUIRED_FIELDS.status_code,
        message:     mensagem || `${DEFAULT_MESSAGES.ERROR_REQUIRED_FIELDS.message} [Campo: ${campo}]`
    })

    if (!usuario.nome || usuario.nome.length > 100)
        return gerarErro('Nome')

    if (!usuario.email || usuario.email.length > 150)
        return gerarErro('Email')

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(usuario.email))
        return gerarErro('Email', 'O campo Email está em formato inválido')

    if (!usuario.senha || usuario.senha.length > 100)
        return gerarErro('Senha')

    const senhaRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/
    if (!senhaRegex.test(usuario.senha))
        return gerarErro('Senha', 'A senha deve ter no mínimo 8 caracteres, uma letra maiúscula, um número e um caractere especial')

    if (!usuario.cpf || usuario.cpf.length > 14)
        return gerarErro('CPF')

    if (!usuario.data_nasc || usuario.data_nasc.length > 12)
        return gerarErro('Data de Nascimento')

    // CORRIGIDO: era isNaN(usuario) — faltava o campo .nacionalidade_id
    if (!usuario.nacionalidade_id || isNaN(usuario.nacionalidade_id))
        return gerarErro('Nacionalidade')

    if (!usuario.genero_id || isNaN(usuario.genero_id))
        return gerarErro('Gênero')

    if (!usuario.telefone || usuario.telefone.length > 20)
        return gerarErro('Telefone')

    if (!usuario.cep || !usuario.cidade || !usuario.estado || !usuario.logradouro || !usuario.numero || !usuario.bairro)
        return gerarErro('Endereço')

    // Duplicidade de email
    const emailExistente = await usuarioDAO.getUsuarioByUsuarioEmail(usuario.email)
    if (emailExistente) {
        return gerarErro('Email', 'Este email já está cadastrado')
    }

    // Duplicidade de CPF
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
    buscarOrganizadorUsuarioId,
}