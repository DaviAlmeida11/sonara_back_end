const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const bodyParserJson = bodyParser.json()


const controllergeneroMusical = require('../controller/genero_musical/genero_musical')

//configurção do cors 
const router = express.Router()
router.use((request, response, next ) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Acess-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    router.use(cors())
    next()
})




// retornar todos os generoMusicals
router.get('/', cors(), async function (request, response){

  let generoMusical  = await controllergeneroMusical.listarGeneroMusical()
    
    response.status(generoMusical.status_code)
    response.json(generoMusical)
})
module.exports = router 


// pegar generoMusical por id
router.get('/:id', cors(), async function (request, response){
    let idGeneroMusical = request.params.id

    let generoMusical = await controllergeneroMusical.buscarGeneroMusicalId(idGeneroMusical)
    response.status(generoMusical.status_code)
    response.json(generoMusical)  


})


//inserir generoMusical
router.post('/', cors(), bodyParserJson, async function (request, response) {


    let dadosBody = request.body
    let contentType = request.headers['content-type']

    let generoMusical = await controllergeneroMusical.inserirGeneroMusical(dadosBody, contentType)

    response.status(generoMusical.status_code)
    response.json(generoMusical)
})


router.put('/:id', cors(), bodyParserJson, async function(request, response) {
    let dadosBody = request.body
    
    let idGeneroMusical = request.params.id

    let contentType = request.headers['content-type']

    let generoMusical = await controllergeneroMusical.atualizarGeneroMusical(dadosBody, idGeneroMusical, contentType)
    response.status(generoMusical.status_code)
    response.json(generoMusical)
})

router.delete('/:id', cors(), async function(request, response) {
    let idGeneroMusical = request.params.id

    let generoMusical = await controllergeneroMusical.excluirGeneroMusical(idGeneroMusical)
    response.status(generoMusical.status_code)
    response.json(generoMusical)
})
  