const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const bodyParserJson = bodyParser.json()


const controllerUsuario = require('../controller/usuario/usuario')

//configurção do cors 
const router = express.Router()
router.use((request, response, next ) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Acess-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    router.use(cors())
    next()
})

// ENDPOINTS DA TABELA Usuario


// retornar todos os Usuarios
router.get('/', cors(), async function (request, response){

  let usuario  = await controllerUsuario.listarUsuarios()
    
    response.status(usuario.status_code)
    response.json(usuario)
})
module.exports = router 


// pegar Usuario por id
router.get('/:id', cors(), async function (request, response){
    let idUsuario = request.params.id

    let usuario = await controllerUsuario.buscarUsuarioId(idUsuario)
    response.status(usuario.status_code)
    response.json(usuario)  


})


//inserir Usuario
router.post('/', cors(), bodyParserJson, async function (request, response) {


    let dadosBody = request.body
    let contentType = request.headers['content-type']

    let usuario = await controllerUsuario.inserirUsuario(dadosBody, contentType)

    response.status(usuario.status_code)
    response.json(usuario)
})


router.put('/:id', cors(), bodyParserJson, async function(request, response) {
    let dadosBody = request.body
    
    let idUsuario = request.params.id

    let contentType = request.headers['content-type']

    let usuario = await controllerUsuario.atualizarUsuario(dadosBody, idUsuario, contentType)
    response.status(usuario.status_code)
    response.json(usuario)
})

router.delete('/:id', cors(), async function(request, response) {
    let idUsuario = request.params.id

    let usuario = await controllerUsuario.excluirUsuario(idUsuario)
    response.status(usuario.status_code)
    response.json(usuario)
})
