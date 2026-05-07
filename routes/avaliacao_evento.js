const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const bodyParserJson = bodyParser.json()


const ccontrollerAvaliacaoEvento = require('../controller/avaliacao_evento/avaliacao_evento')

//configurção do cors 
const router = express.Router()
router.use((request, response, next ) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Acess-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    router.use(cors())
    next()
})

// ENDPOINTS DA TABELA Artista


// retornar todos os Artistas
router.get('/', cors(), async function (request, response){

  let AvaliacaoEvento  = await ccontrollerAvaliacaoEvento.listarAvaliacaoEvento()
    
    response.status(AvaliacaoEvento.status_code)
    response.json(AvaliacaoEvento)
})
module.exports = router 


// pegar Artista por id
router.get('/:id', cors(), async function (request, response){
    let idAvaliacaoEvento = request.params.id

    let AvaliacaoEvento = await ccontrollerAvaliacaoEvento.buscarAvaliacaoEventoId(idAvaliacaoEvento)
    response.status(AvaliacaoEvento.status_code)
    response.json(AvaliacaoEvento)  


})


//inserir Artista
router.post('/', cors(), bodyParserJson, async function (request, response) {


    let dadosBody = request.body
    let contentType = request.headers['content-type']

    let AvaliacaoEvento = await ccontrollerAvaliacaoEvento.inserirAvaliacaoEvento(dadosBody, contentType)

    response.status(AvaliacaoEvento.status_code)
    response.json(AvaliacaoEvento)
})


router.put('/:id', cors(), bodyParserJson, async function(request, response) {
    let dadosBody = request.body
    
    let idAvaliacaoEvento = request.params.id

    let contentType = request.headers['content-type']

    let AvaliacaoEvento = await ccontrollerAvaliacaoEvento.atualizarAvaliacaoEvento(dadosBody, idAvaliacaoEvento, contentType)
    response.status(AvaliacaoEvento.status_code)
    response.json(AvaliacaoEvento)
})

router.delete('/:id', cors(), async function(request, response) {
    let idAvaliacaoEvento = request.params.id

    let AvaliacaoEvento = await ccontrollerAvaliacaoEvento.excluirAvaliacaoEvento(idAvaliacaoEvento)
    response.status(AvaliacaoEvento.status_code)
    response.json(AvaliacaoEvento)
})
