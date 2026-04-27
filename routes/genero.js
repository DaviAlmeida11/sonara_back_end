const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const MESSAGE = require('../controller/modulo/conf_message.js')

const bodyParserJson = bodyParser.json()


const controllerGenero = require('../controller/genero/genero')

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

  let genero  = await controllerGenero.listarGeneros()
    
    response.status(genero.status_code)
    response.json(genero)
})
module.exports = router 


// pegar genero por id
router.get('/:id', cors(), async function (request, response){
    let idGenero = request.params.id

    let genero = await controllerGenero.buscarGeneroId(idGenero)
    response.status(genero.status_code)
    response.json(genero)  


})


//inserir genero
router.post('/', cors(), bodyParserJson, async function (request, response) {


    let dadosBody = request.body
    let contentType = request.headers['content-type']

    let genero = await controllerGenero.inserirGenero(dadosBody, contentType)

    response.status(genero.status_code)
    response.json(genero)
})


router.put('/:id', cors(), bodyParserJson, async function(request, response) {
    let dadosBody = request.body
    
    let idGenero = request.params.id

    let contentType = request.headers['content-type']

    let genero = await controllerGenero.atualizarGenero(dadosBody, idGenero, contentType)
    response.status(genero.status_code)
    response.json(genero)
})

router.delete('/:id', cors(), async function(request, response) {
    let idGenero = request.params.id

    let genero = await controllerGenero.excluirGenero(idGenero)
    response.status(genero.status_code)
    response.json(genero)
})
