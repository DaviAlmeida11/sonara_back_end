const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const bodyParserJson = bodyParser.json()


const controllerEndereco = require('../controller/endereco/endereco')

//configurção do cors 
const router = express.Router()
router.use((request, response, next ) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Acess-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    router.use(cors())
    next()
})

// ENDPOINTS DA TABELA endereco


// retornar todos os enderecos
router.get('/', cors(), async function (request, response){

  let endereco  = await controllerEndereco.listarEnderecos()
    
    response.status(endereco.status_code)
    response.json(endereco)
})
module.exports = router 


// pegar endereco por id
router.get('/:id', cors(), async function (request, response){
    let idEndereco = request.params.id

    let endereco = await controllerEndereco.buscarEnderecoId(idEndereco)
    response.status(endereco.status_code)
    response.json(endereco)  


})


//inserir endereco
router.post('/', cors(), bodyParserJson, async function (request, response) {


    let dadosBody = request.body
    let contentType = request.headers['content-type']

    let endereco = await controllerEndereco.inserirEndereco(dadosBody, contentType)

    response.status(endereco.status_code)
    response.json(endereco)
})


router.put('/:id', cors(), bodyParserJson, async function(request, response) {
    let dadosBody = request.body
    
    let idEndereco = request.params.id

    let contentType = request.headers['content-type']

    let endereco = await controllerEndereco.atualizarEndereco(dadosBody, idEndereco, contentType)
    response.status(endereco.status_code)
    response.json(endereco)
})

router.delete('/:id', cors(), async function(request, response) {
    let idEndereco = request.params.id

    let endereco = await controllerEndereco.excluirEndereco(idEndereco)
    response.status(endereco.status_code)
    response.json(endereco)
})
