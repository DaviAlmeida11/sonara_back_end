const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const bodyParserJson = bodyParser.json()


const controllerArtista = require('../controller/artista/artistas')

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

  let artista  = await controllerArtista.listarArtista()
    
    response.status(artista.status_code)
    response.json(artista)
})
module.exports = router 


// pegar Artista por id
router.get('/:id', cors(), async function (request, response){
    let idArtista = request.params.id

    let artista = await controllerArtista.buscarArtistaId(idArtista)
    response.status(artista.status_code)
    response.json(artista)  


})


//inserir Artista
router.post('/', cors(), bodyParserJson, async function (request, response) {


    let dadosBody = request.body
    let contentType = request.headers['content-type']

    let artista = await controllerArtista.inserirArtista(dadosBody, contentType)

    response.status(artista.status_code)
    response.json(artista)
})


router.put('/:id', cors(), bodyParserJson, async function(request, response) {
    let dadosBody = request.body
    
    let idArtista = request.params.id

    let contentType = request.headers['content-type']

    let artista = await controllerArtista.atualizarArtista(dadosBody, idArtista, contentType)
    response.status(artista.status_code)
    response.json(artista)
})

router.delete('/:id', cors(), async function(request, response) {
    let idArtista = request.params.id

    let artista = await controllerArtista.excluirArtista(idArtista)
    response.status(artista.status_code)
    response.json(artista)
})
