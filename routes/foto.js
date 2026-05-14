const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const multer = require('multer')
const upload = multer()

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
router.post('/',cors(),upload.single('foto'), async function (request, response) {

        let Foto = request.body
        let file = request.file

        let result = await controllerFoto.inserirFoto(Foto, file)

        response.status(result.status_code)
        response.json(result)
})


router.put('/:id', cors(), upload.single('foto'), async function (request, response) {

    let Foto = request.body
    let file = request.file
    let idFoto = request.params.id

    let result = await controllerFoto.atualizarFoto(Foto, file, idFoto)

    response.status(result.status_code)
    response.json(result)
})
router.delete('/:id', cors(), async function(request, response) {
    let idFoto = request.params.id

    let Foto = await controllerFoto.excluirFoto(idFoto)
    response.status(Foto.status_code)
    response.json(Foto)
})
  