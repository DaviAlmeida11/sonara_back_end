const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const bodyParserJson = bodyParser.json()


const controllerTipoRedesSociais = require('../controller/tipo_redes_sociais/tipos_redes_sociais')

//configurção do cors 
const router = express.Router()
router.use((request, response, next ) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Acess-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    router.use(cors())
    next()
})




// retornar todos os TipoRedesSociaiss
router.get('/', cors(), async function (request, response){

  let TipoRedesSociais  = await controllerTipoRedesSociais.listarTipoRedesSociais()
    
    response.status(TipoRedesSociais.status_code)
    response.json(TipoRedesSociais)
})
module.exports = router 


// pegar TipoRedesSociais por id
router.get('/:id', cors(), async function (request, response){
    let idTipoRedesSociais = request.params.id

    let TipoRedesSociais = await controllerTipoRedesSociais.buscarTipoRedesSociaisId(idTipoRedesSociais)
    response.status(TipoRedesSociais.status_code)
    response.json(TipoRedesSociais)  


})


//inserir TipoRedesSociais
router.post('/', cors(), bodyParserJson, async function (request, response) {


    let dadosBody = request.body
    let contentType = request.headers['content-type']

    let TipoRedesSociais = await controllerTipoRedesSociais.inserirTipoRedesSociais(dadosBody, contentType)

    response.status(TipoRedesSociais.status_code)
    response.json(TipoRedesSociais)
})


router.put('/:id', cors(), bodyParserJson, async function(request, response) {
    let dadosBody = request.body
    
    let idTipoRedesSociais = request.params.id

    let contentType = request.headers['content-type']

    let TipoRedesSociais = await controllerTipoRedesSociais.atualizarTipoRedesSociais(dadosBody, idTipoRedesSociais, contentType)
    response.status(TipoRedesSociais.status_code)
    response.json(TipoRedesSociais)
})

router.delete('/:id', cors(), async function(request, response) {
    let idTipoRedesSociais = request.params.id

    let TipoRedesSociais = await controllerTipoRedesSociais.excluirTipoRedesSociais(idTipoRedesSociais)
    response.status(TipoRedesSociais.status_code)
    response.json(TipoRedesSociais)
})
  