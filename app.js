/*********************************************************************************************
 * Objetivo: Arquivo responsável pela requisições da API do projeto de a conexão de artistas com eventos
 * Data: 27/11/2025
 * Autor: Davi de Alemida Santos
 * Versão: 1.0
 **********************************************************************************************/

//Import das bibliotecas para criar a API
const express = require('express')
const cors = require('cors')
const multer = require('multer')


//Configuração para o multer enviar o arquivo de imagem 
const storage = multer.diskStorage({
    destination: function(req, file, cb){
      cb(null, 'uploads/')
    }
})
//instancia para criar um objteto com as caracteristicas do multer


const PORT = process.PORT || 8080

//Porta
const app = express()

//Configurações do cors
app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Acess-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    app.use(cors())
    app.use(express.json())
    next()
})

// importação das rotas 
const generoRoutes = require('./routes/genero')

const usuarioRoutes = require('./routes/usuario')

const enderecoRoutes = require('./routes/endereco')

const artistaRoutes = require('./routes/artista')




//Configuração das rotas
app.use("/v1/sonara/genero", generoRoutes)

app.use("/v1/sonara/usuario", usuarioRoutes)

app. use("/v1/sonara/endereco", enderecoRoutes)

app.use("/v1/sonara/artista", artistaRoutes)

app.listen(PORT, function(){
  console.log('API aguardando resposta ;)')
})
