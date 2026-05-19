/******************************************************************************
 * Rota de usuário - CORRIGIDA
 *
 * CORREÇÕES:
 *  - PUT /:id: adicionado upload.single('foto') + passado file para o controller
 *  - POST /: contentType passado corretamente (sem quebrar multipart)
 *****************************************************************************/

const express    = require('express')
const cors       = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()
const multer = require('multer')
const upload = multer()

const { criarToken, authMiddleware } = require('../jwt/conf_jwt')
const bodyParserJson = bodyParser.json()
const controllerUsuario = require('../controller/usuario/usuario')

const router = express.Router()

router.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    next()
})


// ─── LOGIN ───────────────────────────────────────────────────────────────────
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
        const token   = criarToken(usuario.id_usuario, usuario.role || 'user')

        return res.status(200).json({ status: true, token, usuario })
    }

    return res.status(result.status_code).json(result)
})


// ─── INSERIR (form-data com foto) ────────────────────────────────────────────
// upload.single('foto') intercepta o arquivo; os demais campos chegam em req.body
router.post('/', cors(), upload.single('foto'), async function (request, response) {
    try {
        let dadosBody = request.body
        let file      = request.file
        // contentType não é mais passado aqui pois o controller de insert não valida isso
        let usuario = await controllerUsuario.inserirUsuario(dadosBody, file)

        if (!usuario) {
            return response.status(500).json({ status: false, message: 'Resposta inválida do servidor' })
        }

        return response.status(usuario.status_code || 500).json(usuario)

    } catch (error) {
        console.log(error)
        return response.status(500).json({ status: false, message: 'Erro inesperado na rota' })
    }
})


// ─── LISTAR ───────────────────────────────────────────────────────────────────
router.get('/', authMiddleware, cors(), async function (request, response) {
    let usuario = await controllerUsuario.listarUsuarios()
    response.status(usuario.status_code).json(usuario)
})


// ─── ATUALIZAR ────────────────────────────────────────────────────────────────
// CORREÇÃO: adicionado upload.single('foto') e file passado para o controller
router.put('/:id', cors(), upload.single('foto'), async function (request, response) {
    let dadosBody   = request.body
    let idUsuario   = request.params.id
    let file        = request.file
    let contentType = request.headers['content-type']

    // CORREÇÃO: passado file como 3º argumento (estava faltando)
    let usuario = await controllerUsuario.atualizarUsuario(dadosBody, idUsuario, file, contentType)

    response.status(usuario.status_code).json(usuario)
})


// ─── DELETAR ──────────────────────────────────────────────────────────────────
router.delete('/:id', authMiddleware, cors(), async function (request, response) {
    let idUsuario = request.params.id
    let usuario   = await controllerUsuario.excluirUsuario(idUsuario)
    response.status(usuario.status_code).json(usuario)
})


// ─── BUSCAR POR ID ────────────────────────────────────────────────────────────
router.get('/:id', authMiddleware, cors(), async function (request, response) {
    let idUsuario = request.params.id
    let usuario   = await controllerUsuario.buscarUsuarioId(idUsuario)
    response.status(usuario.status_code).json(usuario)
})


// ─── BUSCAR ORGANIZADOR POR ID DE USUÁRIO ────────────────────────────────────
router.get('/organizador/:id', cors(), async function (request, response) {
    let idUsuario = request.params.id
    let usuario   = await controllerUsuario.buscarOrganizadorUsuarioId(idUsuario)
    response.status(usuario.status_code).json(usuario)
})


module.exports = router