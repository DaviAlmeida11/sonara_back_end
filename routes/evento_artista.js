const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const bodyParserJson = bodyParser.json()


const controllerEventoArtista = require('../controller/evento_artista/evento_artista')

//configurção do cors 
const router = express.Router()
router.use((request, response, next ) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Acess-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    router.use(cors())
    next()
})




// retornar todos os generos
router.get('/', cors(), async function (request, response){

  let EventoArtista  = await controllerEventoArtista.listarEventoArtista()
    
    response.status(EventoArtista.status_code)
    response.json(EventoArtista)
})
module.exports = router 


// pegar EventoArtista por id
router.get('/:id', cors(), async function (request, response){
    let IdEventoArtista = request.params.id

    let EventoArtista = await controllerEventoArtista.buscarEventoArtistaId(IdEventoArtista)
    response.status(EventoArtista.status_code)
    response.json(EventoArtista)  


})


//inserir EventoArtista
router.post('/', cors(), bodyParserJson, async function (request, response) {


    let dadosBody = request.body
    let contentType = request.headers['content-type']

    let EventoArtista = await controllerEventoArtista.inserirEventoArtista(dadosBody, contentType)

    response.status(EventoArtista.status_code)
    response.json(EventoArtista)
})


router.put('/:id', cors(), bodyParserJson, async function(request, response) {
    let dadosBody = request.body
    
    let IdEventoArtista = request.params.id

    let contentType = request.headers['content-type']

    let EventoArtista = await controllerEventoArtista.atualizarEventoArtista(dadosBody, IdEventoArtista, contentType)
  response.status(EventoArtista.status_code)
    response.json(EventoArtista)
})

router.delete('/:id', cors(), async function(request, response) {
    let IdEventoArtista = request.params.id

    let EventoArtista = await controllerEventoArtista.excluirEventoArtista(IdEventoArtista)
    response.status(EventoArtista.status_code)
    response.json(EventoArtista)
})
  