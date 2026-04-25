const express = require('express')
const cors = require('cors')



const controllerGenero = require('../controller/genero/genero')

//configurção do cors 
const router = express.Router()
router.use((request, response, next ) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Acess-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    router.use(cors())
    next()
})

// ENDPOINTS DA TABELA Usuario



router.get('/', cors(), async function (request, response){

  let genero  = await controllerGenero.listarGeneros
    
    response.status(diario.status_code)
    response.json(diario)
})
module.exports = router 