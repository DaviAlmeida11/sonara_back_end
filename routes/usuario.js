const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()

const { criarToken, authMiddleware } = require('../jwt/conf_jwt')

const bodyParserJson = bodyParser.json()
const controllerUsuario = require('../controller/usuario/usuario')

const router = express.Router()

router.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    next()
})

//login
router.post('/login', cors(), bodyParserJson, async (req, res) => {

    const contentType = req.headers['content-type']

    if (!contentType || !contentType.toUpperCase().includes('APPLICATION/JSON')) {
        return res.status(415).json({ message: 'Content-Type deve ser application/json' })
    }

    const { email, senha } = req.body

    if (!email || !senha) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios' })
    }

    const result = await controllerUsuario.loginUsuario({ email, senha })

    if (result.status_code === 200) {
        const usuario = result.response.usuario
        const token = criarToken(usuario.id_usuario, usuario.role || 'user')

        return res.status(200).json({
            status: true,
            token,
            usuario
        })
    }

    return res.status(result.status_code).json(result)
})

//inserir usuario

router.post('/', cors(), bodyParserJson, async function (request, response) {
    let dadosBody = request.body
    let contentType = request.headers['content-type']

    let usuario = await controllerUsuario.inserirUsuario(dadosBody, contentType)

    response.status(usuario.status_code)
    response.json(usuario)
})

//listar usuario
router.get('/', authMiddleware, cors(), async function (request, response) {
    let usuario = await controllerUsuario.listarUsuarios()
    response.status(usuario.status_code)
    response.json(usuario)
})

//atualizar usuario
router.put('/:id', cors(), bodyParserJson, async function (request, response) {
    let dadosBody = request.body
    let idUsuario = request.params.id
    let contentType = request.headers['content-type']

    let usuario = await controllerUsuario.atualizarUsuario(dadosBody, idUsuario, contentType)

    response.status(usuario.status_code)
    response.json(usuario)
})

//deletar usuario
router.delete('/:id', authMiddleware, cors(), async function (request, response) {
    let idUsuario = request.params.id

    let usuario = await controllerUsuario.excluirUsuario(idUsuario)

    response.status(usuario.status_code)
    response.json(usuario)
})


router.get('/:id', authMiddleware, cors(), async function (request, response) {
    let idUsuario = request.params.id
    let usuario = await controllerUsuario.buscarUsuarioId(idUsuario)

    response.status(usuario.status_code)
    response.json(usuario)
})

router.get('/organizador/:id',  cors(), async function (request, response) {
    let idUsuario = request.params.id
    let usuario = await controllerUsuario.buscarOrganizadorUsuarioId(idUsuario)

    response.status(usuario.status_code)
    response.json(usuario)
})

module.exports = router