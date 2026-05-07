// IMPORTANT 

// no arrtista_genero esta localizado no post vai ter que inserir o nome do genero e do ususario ja existentes no banco, posivelmente vai precisar de uma trigger NAO ESQUECERconst express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const bodyParserJson = bodyParser.json()


const controllerArtistaGenero = require('../controller/artista_genero/artista_genero')

//configurção do cors 
const router = express.Router()
router.use((request, response, next ) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Acess-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    router.use(cors())
    next()
})

// ENDPOINTS DA TABELA ArtistaGenero


// retornar todos os ArtistaGeneros
router.get('/', cors(), async function (request, response){

  let ArtistaGenero  = await controllerArtistaGenero.listarArtistaGenero()
    
    response.status(ArtistaGenero.status_code)
    response.json(ArtistaGenero)
})
module.exports = router 


// pegar ArtistaGenero por id
router.get('/:id', cors(), async function (request, response){
    let idArtistaGenero = request.params.id

    let ArtistaGenero = await controllerArtistaGenero.buscarArtistaGeneroId(idArtistaGenero)
    response.status(ArtistaGenero.status_code)
    response.json(ArtistaGenero)  


})


//inserir ArtistaGenero
router.post('/', cors(), bodyParserJson, async function (request, response) {


    let dadosBody = request.body
    let contentType = request.headers['content-type']

    let ArtistaGenero = await controllerArtistaGenero.inserirArtistaGenero(dadosBody, contentType)

    response.status(ArtistaGenero.status_code)
    response.json(ArtistaGenero)
})


router.put('/:id', cors(), bodyParserJson, async function(request, response) {
    let dadosBody = request.body
    
    let idArtistaGenero = request.params.id

    let contentType = request.headers['content-type']

    let ArtistaGenero = await controllerArtistaGenero.atualizarArtistaGenero(dadosBody, idArtistaGenero, contentType)
    response.status(ArtistaGenero.status_code)
    response.json(ArtistaGenero)
})

router.delete('/:id', cors(), async function(request, response) {
    let idArtistaGenero = request.params.id

    let ArtistaGenero = await controllerArtistaGenero.excluirArtistaGenero(id
    )
    response.status(ArtistaGenero.status_code)
    response.json(ArtistaGenero)
})
