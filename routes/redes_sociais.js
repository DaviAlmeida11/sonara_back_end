const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const bodyParserJson = bodyParser.json()


const controllerRedesSociais = require('../controller/redes_sociais/redes_sociais')

//configurção do cors 
const router = express.Router()
router.use((request, response, next ) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Acess-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    router.use(cors())
    next()
})




// retornar todos os RedesSociaiss
router.get('/', cors(), async function (request, response){

  let RedesSociais  = await controllerRedesSociais.listarRedesSociaiss()
    
    response.status(RedesSociais.status_code)
    response.json(RedesSociais)
})
module.exports = router 


// pegar RedesSociais por id
router.get('/:id', cors(), async function (request, response){
    let idRedesSociais = request.params.id

    let RedesSociais = await controllerRedesSociais.buscarRedesSociaisId(idRedesSociais)
    response.status(RedesSociais.status_code)
    response.json(RedesSociais)  


})


//inserir RedesSociais
router.post('/', cors(), bodyParserJson, async function (request, response) {


    let dadosBody = request.body
    let contentType = request.headers['content-type']

    let RedesSociais = await controllerRedesSociais.inserirRedesSociais(dadosBody, contentType)
console.log(RedesSociais)
    response.status(RedesSociais.status_code)
    response.json(RedesSociais)
})


router.put('/:id', cors(), bodyParserJson, async function(request, response) {
    let dadosBody = request.body
    
    let idRedesSociais = request.params.id

    let contentType = request.headers['content-type']

    let RedesSociais = await controllerRedesSociais.atualizarRedesSociais(dadosBody, idRedesSociais, contentType)
    response.status(RedesSociais.status_code)
    response.json(RedesSociais)
})

router.delete('/:id', cors(), async function(request, response) {
    let idRedesSociais = request.params.id

    let RedesSociais = await controllerRedesSociais.excluirRedesSociais(idRedesSociais)
    response.status(RedesSociais.status_code)
    response.json(RedesSociais)
})
  