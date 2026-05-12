const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const bodyParserJson = bodyParser.json()


const controllerArtistaGeneroMusical = require('../controller/artista_genero_musical/artista_genero_musical')

//configurção do cors 
const router = express.Router()
router.use((request, response, next ) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Acess-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    router.use(cors())
    next()
})
// ENDPOINTS DA TABELA ArtistaGeneroMusical


// retornar todos os ArtistaGeneroMusicals
router.get('/', cors(), async function (request, response){

  let ArtistaGeneroMusical  = await controllerArtistaGeneroMusical.listarArtistaGeneroMusical()
    
    response.status(ArtistaGeneroMusical.status_code)
    response.json(ArtistaGeneroMusical)
})
module.exports = router 


// pegar ArtistaGeneroMusical por id
router.get('/:id', cors(), async function (request, response){
    let idArtistaGeneroMusical = request.params.id

    let ArtistaGeneroMusical = await controllerArtistaGeneroMusical.buscarArtistaGeneroMusicalId(idArtistaGeneroMusical)
    response.status(ArtistaGeneroMusical.status_code)
    response.json(ArtistaGeneroMusical)  


})


//inserir ArtistaGeneroMusical
router.post('/', cors(), bodyParserJson, async function (request, response) {


    let dadosBody = request.body
    let contentType = request.headers['content-type']

    let ArtistaGeneroMusical = await controllerArtistaGeneroMusical.inserirArtistaGeneroMusical(dadosBody, contentType)

    response.status(ArtistaGeneroMusical.status_code)
    response.json(ArtistaGeneroMusical)
})


router.put('/:id', cors(), bodyParserJson, async function(request, response) {
    let dadosBody = request.body
    
    let idArtistaGeneroMusical = request.params.id

    let contentType = request.headers['content-type']

    let ArtistaGeneroMusical = await controllerArtistaGeneroMusical.atualizarArtistaGeneroMusical(dadosBody, idArtistaGeneroMusical, contentType)
    response.status(ArtistaGeneroMusical.status_code)
    response.json(ArtistaGeneroMusical)
})

router.delete('/:id', cors(), async function(request, response) {
    let idArtistaGeneroMusical = request.params.id

    let ArtistaGeneroMusical = await controllerArtistaGeneroMusical.excluirArtistaGeneroMusical(idArtistaGeneroMusical)
    response.status(ArtistaGeneroMusical.status_code)
    response.json(ArtistaGeneroMusical)
})
