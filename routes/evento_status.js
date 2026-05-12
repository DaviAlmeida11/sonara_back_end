const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const bodyParserJson = bodyParser.json()


const controllerEventoStatus = require('../controller/eventos_status/evento_staus')

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

  let EventoStatus  = await controllerEventoStatus.listarEventoStatus()
    
    response.status(EventoStatus.status_code)
    response.json(EventoStatus)
})
module.exports = router 


// pegar EventoStatus por id
router.get('/:id', cors(), async function (request, response){
    let IdEventoStatus = request.params.id

    let EventoStatus = await controllerEventoStatus.buscarEventoStatusId(IdEventoStatus)
    response.status(EventoStatus.status_code)
    response.json(EventoStatus)  


})


//inserir EventoStatus
router.post('/', cors(), bodyParserJson, async function (request, response) {


    let dadosBody = request.body
    let contentType = request.headers['content-type']

    let EventoStatus = await controllerEventoStatus.inserirEventoStatus(dadosBody, contentType)

    response.status(EventoStatus.status_code)
    response.json(EventoStatus)
})


router.put('/:id', cors(), bodyParserJson, async function(request, response) {
    let dadosBody = request.body
    
    let IdEventoStatus = request.params.id

    let contentType = request.headers['content-type']

    let EventoStatus = await controllerEventoStatus.atualizarEventoStatus(dadosBody, IdEventoStatus, contentType)
    response.status(EventoStatus.status_code)
    response.json(EventoStatus)
})

router.delete('/:id', cors(), async function(request, response) {
    let IdEventoStatus = request.params.id

    let EventoStatus = await controllerEventoStatus.excluirEventoStatus(IdEventoStatus)
    response.status(EventoStatus.status_code)
    response.json(EventoStatus)
})
  