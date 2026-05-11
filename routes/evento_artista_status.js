const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const bodyParserJson = bodyParser.json()


const controllerEventoArtistaStatus = require('../controller/evento_artista_status/evento_artista_status')

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

  let EventoArtistaStatus  = await controllerEventoArtistaStatus.listarEventoArtistaStatus()
    
    response.status(EventoArtistaStatus.status_code)
    response.json(EventoArtistaStatus)
})
module.exports = router 


// pegar EventoArtistaStatus por id
router.get('/:id', cors(), async function (request, response){
    let IdEventoArtistaStatus = request.params.id

    let EventoArtistaStatus = await controllerEventoArtistaStatus.buscarEventoArtistaStatusId(IdEventoArtistaStatus)
    response.status(EventoArtistaStatus.status_code)
    response.json(EventoArtistaStatus)  


})


//inserir EventoArtistaStatus
router.post('/', cors(), bodyParserJson, async function (request, response) {


    let dadosBody = request.body
    let contentType = request.headers['content-type']

    let EventoArtistaStatus = await controllerEventoArtistaStatus.inserirEventoArtistaStatus(dadosBody, contentType)

    response.status(EventoArtistaStatus.status_code)
    response.json(EventoArtistaStatus)
})


router.put('/:id', cors(), bodyParserJson, async function(request, response) {
    let dadosBody = request.body
    
    let IdEventoArtistaStatus = request.params.id

    let contentType = request.headers['content-type']

    let EventoArtistaStatus = await controllerEventoArtistaStatus.atualizarEventoArtistaStatus(dadosBody, IdEventoArtistaStatus, contentType)
    response.status(EventoArtistaStatus.status_code)
    response.json(EventoArtistaStatus)
})

router.delete('/:id', cors(), async function(request, response) {
    let IdEventoArtistaStatus = request.params.id

    let EventoArtistaStatus = await controllerEventoArtistaStatus.excluirEventoArtistaStatus(IdEventoArtistaStatus)
    response.status(EventoArtistaStatus.status_code)
    response.json(EventoArtistaStatus)
})
  