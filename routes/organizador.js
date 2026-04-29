const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const bodyParserJson = bodyParser.json()


const controllerOrganizador = require('../controller/organizador/organozador')

//configurção do cors 
const router = express.Router()
router.use((request, response, next ) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Acess-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    router.use(cors())
    next()
})

// ENDPOINTS DA TABELA Organizador


// retornar todos os Organizadors
router.get('/', cors(), async function (request, response){

  let organizador  = await controllerOrganizador.listarOrganizador()
    
    response.status(organizador.status_code)
    response.json(organizador)
})
module.exports = router 


// pegar Organizador por id
router.get('/:id', cors(), async function (request, response){
    let idOrganizador = request.params.id

    let organizador = await controllerOrganizador.buscarOrganizadorId(idOrganizador)
    response.status(organizador.status_code)
    response.json(organizador)  


})


//inserir Organizador
router.post('/', cors(), bodyParserJson, async function (request, response) {


    let dadosBody = request.body
    let contentType = request.headers['content-type']

    let organizador = await controllerOrganizador.inserirOrganizador(dadosBody, contentType)

    response.status(organizador.status_code)
    response.json(organizador)
})


router.put('/:id', cors(), bodyParserJson, async function(request, response) {
    let dadosBody = request.body
    
    let idOrganizador = request.params.id

    let contentType = request.headers['content-type']

    let organizador = await controllerOrganizador.atualizarOrganizador(dadosBody, idOrganizador, contentType)
    response.status(organizador.status_code)
    response.json(organizador)
})

router.delete('/:id', cors(), async function(request, response) {
    let idOrganizador = request.params.id

    let organizador = await controllerOrganizador.excluirOrganizador(idOrganizador)
    response.status(organizador.status_code)
    response.json(organizador)
})
