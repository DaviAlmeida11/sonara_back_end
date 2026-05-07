const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const bodyParserJson = bodyParser.json()


const controllerAvaliacaoArtista = require('../controller/avaliacao_artista/avaliacao_artista')

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

  let avaliacaoArtista  = await controllerAvaliacaoArtista.listarAvaliacaoArtista()
    
    response.status(avaliacaoArtista.status_code)
    response.json(avaliacaoArtista)
})
module.exports = router 


// pegar Artista por id
router.get('/:id', cors(), async function (request, response){
    let idAvaliacaoArtista = request.params.id

    let avaliacaoArtista = await controllerAvaliacaoArtista.buscarAvaliacaoArtistaId(idAvaliacaoArtista)
    response.status(avaliacaoArtista.status_code)
    response.json(avaliacaoArtista)  


})


//inserir Artista
router.post('/', cors(), bodyParserJson, async function (request, response) {


    let dadosBody = request.body
    let contentType = request.headers['content-type']

    let avaliacaoArtista = await controllerAvaliacaoArtista.inserirAvaliacaoArtista(dadosBody, contentType)

    response.status(avaliacaoArtista.status_code)
    response.json(avaliacaoArtista)
})


router.put('/:id', cors(), bodyParserJson, async function(request, response) {
    let dadosBody = request.body
    
    let idAvaliacaoArtista = request.params.id

    let contentType = request.headers['content-type']

    let avaliacaoArtista = await controllerAvaliacaoArtista.atualizarAvaliacaoArtista(dadosBody, idAvaliacaoArtista, contentType)
    response.status(avaliacaoArtista.status_code)
    response.json(avaliacaoArtista)
})

router.delete('/:id', cors(), async function(request, response) {
    let idAvaliacaoArtista = request.params.id

    let avaliacaoArtista = await controllerAvaliacaoArtista.excluirAvaliacaoArtista(idAvaliacaoArtista)
    response.status(avaliacaoArtista.status_code)
    response.json(avaliacaoArtista)
})
