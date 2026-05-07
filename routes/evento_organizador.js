const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const bodyParserJson = bodyParser.json()


const controllereventoOrganizador = require('../controller/evento_organizador/evento_organizador.js')

//configurção do cors 
const router = express.Router()
router.use((request, response, next ) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Acess-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    router.use(cors())
    next()
})

// ENDPOINTS DA TABELA eventoOrganizador


// retornar todos os eventoOrganizadors
router.get('/', cors(), async function (request, response){

  let eventoOrganizador  = await controllereventoOrganizador.listarEventoOrganizador()
    
    response.status(eventoOrganizador.status_code)
    response.json(eventoOrganizador)
})
module.exports = router 


// pegar eventoOrganizador por id
router.get('/:id', cors(), async function (request, response){
    let ideventoOrganizador = request.params.id

    let eventoOrganizador = await controllereventoOrganizador.buscarEventoOrganizadorId(ideventoOrganizador)
    response.status(eventoOrganizador.status_code)
    response.json(eventoOrganizador)  


})


//inserir eventoOrganizador
router.post('/', cors(), bodyParserJson, async function (request, response) {


    let dadosBody = request.body
    let contentType = request.headers['content-type']

    let eventoOrganizador = await controllereventoOrganizador.inserirEventoOrganizador(dadosBody, contentType)

    response.status(eventoOrganizador.status_code)
    response.json(eventoOrganizador)
})


router.put('/:id', cors(), bodyParserJson, async function(request, response) {
    let dadosBody = request.body
    
    let ideventoOrganizador = request.params.id

    let contentType = request.headers['content-type']

    let eventoOrganizador = await controllereventoOrganizador.atualizarEventoOrganizador(dadosBody, ideventoOrganizador, contentType)
    response.status(eventoOrganizador.status_code)
    response.json(eventoOrganizador)
})

router.delete('/:id', cors(), async function(request, response) {
    let ideventoOrganizador = request.params.id

    let eventoOrganizador = await controllereventoOrganizador.excluirEventoOrganizador(ideventoOrganizador)
    response.status(eventoOrganizador.status_code)
    response.json(eventoOrganizador)
})
