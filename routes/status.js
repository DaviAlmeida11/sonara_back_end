const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const bodyParserJson = bodyParser.json()


const controllerStatus = require('../controller/status/status')

//configurção do cors 
const router = express.Router()
router.use((request, response, next ) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Acess-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    router.use(cors())
    next()
})




// retornar todos os Statuss
router.get('/', cors(), async function (request, response){

  let status  = await controllerStatus.listarStatuss()
    
    response.status(status.status_code)
    response.json(status)
})
module.exports = router 


// pegar Status por id
router.get('/:id', cors(), async function (request, response){
    let idStatus = request.params.id

    let status = await controllerStatus.buscarStatusId(idStatus)
    response.status(status.status_code)
    response.json(status)  


})


//inserir Status
router.post('/', cors(), bodyParserJson, async function (request, response) {


    let dadosBody = request.body
    let contentType = request.headers['content-type']

    let status = await controllerStatus.inserirStatus(dadosBody, contentType)

    response.status(status.status_code)
    response.json(status)
})


router.put('/:id', cors(), bodyParserJson, async function(request, response) {
    let dadosBody = request.body
    
    let idStatus = request.params.id

    let contentType = request.headers['content-type']

    let status = await controllerStatus.atualizarStatus(dadosBody, idStatus, contentType)
    response.status(status.status_code)
    response.json(status)
})

router.delete('/:id', cors(), async function(request, response) {
    let idStatus = request.params.id

    let status = await controllerStatus.excluirStatus(idStatus)
    response.status(status.status_code)
    response.json(status)
})
  