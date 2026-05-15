const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const bodyParserJson = bodyParser.json()


const controllerEnderecoEvento = require('../controller/endereco_evento/endereco_evento')

//configurção do cors 
const router = express.Router()
router.use((request, response, next ) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Acess-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    router.use(cors())
    next()
})

// ENDPOINTS DA TABELA EnderecoEvento


// retornar todos os EnderecoEventoEvento
router.get('/', cors(), async function (request, response){

  let EnderecoEvento  = await controllerEnderecoEvento.listarEnderecoEvento()
    
    response.status(EnderecoEvento.status_code)
    response.json(EnderecoEvento)
})
module.exports = router 


// pegar EnderecoEvento por id
router.get('/:id', cors(), async function (request, response){
    let idEnderecoEvento = request.params.id

    let EnderecoEvento = await controllerEnderecoEvento.buscarEnderecoEventoId(idEnderecoEvento)
    response.status(EnderecoEvento.status_code)
    response.json(EnderecoEvento)  


})


//inserir EnderecoEvento
router.post('/', cors(), bodyParserJson, async function (request, response) {


    let dadosBody = request.body
    let contentType = request.headers['content-type']

    let EnderecoEvento = await controllerEnderecoEvento.inserirEnderecoEvento(dadosBody, contentType)

    response.status(EnderecoEvento.status_code)
    response.json(EnderecoEvento)
})


router.put('/:id', cors(), bodyParserJson, async function(request, response) {
    let dadosBody = request.body
    
    let idEnderecoEvento = request.params.id

    let contentType = request.headers['content-type']

    let EnderecoEvento = await controllerEnderecoEvento.atualizarEnderecoEvento(dadosBody, idEnderecoEvento, contentType)
    response.status(EnderecoEvento.status_code)
    response.json(EnderecoEvento)
})

router.delete('/:id', cors(), async function(request, response) {
    let idEnderecoEvento = request.params.id

    let EnderecoEvento = await controllerEnderecoEvento.excluirEnderecoEvento(idEnderecoEvento)
    response.status(EnderecoEvento.status_code)
    response.json(EnderecoEvento)
})
