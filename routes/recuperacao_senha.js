const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const bodyParserJson = bodyParser.json()


const controllerrecuperacao = require('../controller/recuperacao_senha/recuperacao_senha')

//configurção do cors 
const router = express.Router()
router.use((request, response, next ) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Acess-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    router.use(cors())
    next()
})

// ENDPOINTS DA TABELA recuperacao


// retornar todos os recuperacaos
router.get('/', cors(), async function (request, response){

  let recuperacao  = await controllerrecuperacao.listarRecuperacao()
    
    response.status(recuperacao.status_code)
    response.json(recuperacao)
})
module.exports = router 


// pegar recuperacao por id
router.get('/:id', cors(), async function (request, response){
    let idrecuperacao = request.params.id

    let recuperacao = await controllerrecuperacao.buscarnacioRecuperacaoId(idrecuperacao)
    response.status(recuperacao.status_code)
    response.json(recuperacao)  


})


//inserir recuperacao
router.post('/', cors(), bodyParserJson, async function (request, response) {

    let dadosBody = request.body
    let contentType = request.headers['content-type']

    let recuperacao = await controllerrecuperacao.inserirRecuperacao(
        dadosBody,
        contentType
    )

    
    response.status(recuperacao.status_code)
    response.json(recuperacao)
})

router.put('/:id', cors(), bodyParserJson, async function(request, response) {
    let dadosBody = request.body
    
    let idrecuperacao = request.params.id

    let contentType = request.headers['content-type']

    let recuperacao = await controllerrecuperacao.atualizarRecuperacao(dadosBody, idrecuperacao, contentType)
    response.status(recuperacao.status_code)
    response.json(recuperacao)
})

router.delete('/:id', cors(), async function(request, response) {
    let idrecuperacao = request.params.id

    let recuperacao = await controllerrecuperacao.excluirRecuperacao(idrecuperacao)
    response.status(recuperacao.status_code)
    response.json(recuperacao)
})
