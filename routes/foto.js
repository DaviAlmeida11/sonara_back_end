const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const bodyParserJson = bodyParser.json()


const controllerFoto = require('../controller/foto/foto')

//configurção do cors 
const router = express.Router()
router.use((request, response, next ) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Acess-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    router.use(cors())
    next()
})




// retornar todos os Fotos
router.get('/', cors(), async function (request, response){

  let Foto  = await controllerFoto.listarFotos()
    
    response.status(Foto.status_code)
    response.json(Foto)
})
module.exports = router 


// pegar Foto por id
router.get('/:id', cors(), async function (request, response){
    let idFoto = request.params.id

    let Foto = await controllerFoto.buscarFotoId(idFoto)
    response.status(Foto.status_code)
    response.json(Foto)  


})


//inserir Foto
router.post('/', cors(), bodyParserJson, async function (request, response) {


    let dadosBody = request.body
    let contentType = request.headers['content-type']

    let Foto = await controllerFoto.inserirFoto(dadosBody, contentType)

    response.status(Foto.status_code)
    response.json(Foto)
})


router.put('/:id', cors(), bodyParserJson, async function(request, response) {
    let dadosBody = request.body
    
    let idFoto = request.params.id

    let contentType = request.headers['content-type']

    let Foto = await controllerFoto.atualizarFoto(dadosBody, idFoto, contentType)
    response.status(Foto.status_code)
    response.json(Foto)
})

router.delete('/:id', cors(), async function(request, response) {
    let idFoto = request.params.id

    let Foto = await controllerFoto.excluirFoto(idFoto)
    response.status(Foto.status_code)
    response.json(Foto)
})
  