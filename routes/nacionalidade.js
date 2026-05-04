const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const bodyParserJson = bodyParser.json()


const controllerNacionalidade = require('../controller/nacionalidade/nacionalidade')

//configurção do cors 
const router = express.Router()
router.use((request, response, next ) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Acess-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    router.use(cors())
    next()
})




// retornar todos os Nacionalidades
router.get('/', cors(), async function (request, response){

  let nacionalidade  = await controllerNacionalidade.listarnacioNalidades()
    
    response.status(nacionalidade.status_code)
    response.json(nacionalidade)
})
module.exports = router 


// pegar Nacionalidade por id
router.get('/:id', cors(), async function (request, response){
    let idNacionalidade = request.params.id

    let nacionalidade = await controllerNacionalidade.buscarnacioNalidadeId(idNacionalidade)
    response.status(nacionalidade.status_code)
    response.json(nacionalidade)  


})


//inserir Nacionalidade
router.post('/', cors(), bodyParserJson, async function (request, response) {


    let dadosBody = request.body
    let contentType = request.headers['content-type']

    let nacionalidade = await controllerNacionalidade.inserirNacionalidade(dadosBody, contentType)

    response.status(nacionalidade.status_code)
    response.json(nacionalidade)
})


router.put('/:id', cors(), bodyParserJson, async function(request, response) {
    let dadosBody = request.body
    
    let idNacionalidade = request.params.id

    let contentType = request.headers['content-type']

    let nacionalidade = await controllerNacionalidade.atualizarNacionalidade(dadosBody, idNacionalidade, contentType)
    response.status(nacionalidade.status_code)
    response.json(nacionalidade)
})

router.delete('/:id', cors(), async function(request, response) {
    let idNacionalidade = request.params.id

    let nacionalidade = await controllerNacionalidade.excluirnacionalidade(idNacionalidade)
    response.status(nacionalidade.status_code)
    response.json(nacionalidade)
})
  