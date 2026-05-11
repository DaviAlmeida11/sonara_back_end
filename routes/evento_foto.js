const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const bodyParserJson = bodyParser.json()


const controllerEventoFoto = require('../controller/evento_foto/evento_foto')

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

  let EventoFoto  = await controllerEventoFoto.listareventoFoto()
    
    response.status(EventoFoto.status_code)
    response.json(EventoFoto)
})
module.exports = router 


// pegar EventoFoto por id
router.get('/:id', cors(), async function (request, response){
    let IdEventoFoto = request.params.id

    let EventoFoto = await controllerEventoFoto.buscareventoFotoId(IdEventoFoto)
    response.status(EventoFoto.status_code)
    response.json(EventoFoto)  


})


//inserir EventoFoto
router.post('/', cors(), bodyParserJson, async function (request, response) {


    let dadosBody = request.body
    let contentType = request.headers['content-type']

    let EventoFoto = await controllerEventoFoto.inserireventoFoto(dadosBody, contentType)

    response.status(EventoFoto.status_code)
    response.json(EventoFoto)
})


router.put('/:id', cors(), bodyParserJson, async function(request, response) {
    let dadosBody = request.body
    
    let IdEventoFoto = request.params.id

    let contentType = request.headers['content-type']

    let EventoFoto = await controllerEventoFoto.atualizareventoFoto(dadosBody, IdEventoFoto, contentType)
    response.status(EventoFoto.status_code)
    response.json(EventoFoto)
})

router.delete('/:id', cors(), async function(request, response) {
    let IdEventoFoto = request.params.id

    let EventoFoto = await controllerEventoFoto.excluireventoFoto(IdEventoFoto)
    response.status(EventoFoto.status_code)
    response.json(EventoFoto)
})
  