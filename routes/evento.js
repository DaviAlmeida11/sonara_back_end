const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const bodyParserJson = bodyParser.json()


const controllerEvento = require('../controller/evento/evento')

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

  let evento  = await controllerEvento.listarEvento()
    
    response.status(evento.status_code)
    response.json(evento)
})
module.exports = router 


// pegar evento por id
router.get('/:id', cors(), async function (request, response){
    let IdEvento = request.params.id

    let evento = await controllerEvento.buscarEventoId(IdEvento)
    response.status(evento.status_code)
    response.json(evento)  


})


//inserir evento
router.post('/', cors(), bodyParserJson, async function (request, response) {


    let dadosBody = request.body
    let contentType = request.headers['content-type']

    let evento = await controllerEvento.inserirEvento(dadosBody, contentType)

    response.status(evento.status_code)
    response.json(evento)
})


router.put('/:id', cors(), bodyParserJson, async function(request, response) {
    let dadosBody = request.body
    
    let IdEvento = request.params.id

    let contentType = request.headers['content-type']

    let evento = await controllerEvento.atualizarEvento(dadosBody, IdEvento, contentType)
    response.status(evento.status_code)
    response.json(evento)
})

router.delete('/:id', cors(), async function(request, response) {
    let IdEvento = request.params.id

    let evento = await controllerEvento.excluirEvento(IdEvento)
    response.status(evento.status_code)
    response.json(evento)
})
  