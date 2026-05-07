const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const bodyParserJson = bodyParser.json()


const controllerUsuarioFoto = require('../controller/usuario_foto/usuario_foto')

//configurção do cors 
const router = express.Router()
router.use((request, response, next ) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Acess-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    router.use(cors())
    next()
})

// ENDPOINTS DA TABELA UsuarioFoto


// retornar todos os UsuarioFotos
router.get('/', cors(), async function (request, response){

  let UsuarioFoto  = await controllerUsuarioFoto.listarUsuarioFoto()
    
    response.status(UsuarioFoto.status_code)
    response.json(UsuarioFoto)
})
module.exports = router 


// pegar UsuarioFoto por id
router.get('/:id', cors(), async function (request, response){
    let idUsuarioFoto = request.params.id

    let UsuarioFoto = await controllerUsuarioFoto.buscarUsuarioFotoId(idUsuarioFoto)
    response.status(UsuarioFoto.status_code)
    response.json(UsuarioFoto)  


})


//inserir UsuarioFoto
router.post('/', cors(), bodyParserJson, async function (request, response) {


    let dadosBody = request.body
    let contentType = request.headers['content-type']

    let UsuarioFoto = await controllerUsuarioFoto.inserirUsuarioFoto(dadosBody, contentType)

    response.status(UsuarioFoto.status_code)
    response.json(UsuarioFoto)
})


router.put('/:id', cors(), bodyParserJson, async function(request, response) {
    let dadosBody = request.body
    
    let idUsuarioFoto = request.params.id

    let contentType = request.headers['content-type']

    let UsuarioFoto = await controllerUsuarioFoto.atualizarUsuarioFoto(dadosBody, idUsuarioFoto, contentType)
    response.status(UsuarioFoto.status_code)
    response.json(UsuarioFoto)
})

router.delete('/:id', cors(), async function(request, response) {
    let idUsuarioFoto = request.params.id

    let UsuarioFoto = await controllerUsuarioFoto.excluirUsuarioFoto(idUsuarioFoto)
    response.status(UsuarioFoto.status_code)
    response.json(UsuarioFoto)
})
