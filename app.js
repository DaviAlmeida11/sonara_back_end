/*********************************************************************************************
 * Objetivo: Arquivo responsável pela requisições da API do projeto de a conexão de artistas com eventos
 * Data: 27/11/2025
 * Autor: Davi de Alemida Santos
 * Versão: 1.0
 **********************************************************************************************/

//Import das bibliotecas para criar a API
require('dotenv').config()  
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
app.use(cors())
app.use(express.json())
app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    next()
})

// importação das rotas 
const generoRoutes = require('./routes/genero')

const usuarioRoutes = require('./routes/usuario')

const enderecoRoutes = require('./routes/endereco')

const artistaRoutes = require('./routes/artista')

const organizador = require('./routes/organizador')

const generoMusical = require('./routes/genero_musical')

const nacionalidade = require('./routes/nacionalidade')

const status = require('./routes/status')

const RedesSociais = require('./routes/redes_sociais')

const tipoRedesSociais = require('./routes/tipo_redes_sociais')

const foto = require('./routes/foto')

const evento = require('./routes/evento')

const recuperacao = require('./routes/recuperacao_senha')


const avaliacaoArtista = require('./routes/avaliacao_artista')

const avaliacaoEvento = require('./routes/avaliacao_evento')

const eventoOrganizador = require('./routes/evento_organizador')

const usuarioFoto = require('./routes/usuario_foto')

const eventoStatus = require('./routes/evento_status')

const eventoFoto = require('./routes/evento_foto')

const artistaGeneroMusical = require('./routes/artista_genero_musical')

const artistaEvento = require('./routes/evento_artista')

const eventoArtistaStatus = require('./routes/evento_artista_status')

const enderecoEvento = require("./routes/endereco_evento")


//Configuração das rotas
app.use("/v1/sonara/genero", generoRoutes)

app.use("/v1/sonara/usuario", usuarioRoutes)

app. use("/v1/sonara/endereco", enderecoRoutes)

app.use("/v1/sonara/artista", artistaRoutes)

app.use("/v1/sonara/organizador", organizador)

app.use("/v1/sonara/generoMusical", generoMusical)

app.use("/v1/sonara/nacionalidade", nacionalidade)

app.use('/v1/sonara/status', status)

app.use('/v1/sonara/redesSociais', RedesSociais)

app.use('/v1/sonara/tipoRedesSociais', tipoRedesSociais)

app.use('/v1/sonara/foto', foto)

app.use('/v1/sonara/evento', evento)

app.use('/v1/sonara/recuperacao', recuperacao)

app.use("/v1/sonara/enderecoEvento", enderecoEvento)


app.use('/v1/sonara/avaliacaoArtista', avaliacaoArtista)

app.use('/v1/sonara/avaliacaoEvento', avaliacaoEvento)

app.use('/v1/sonara/eventoOrganizador', eventoOrganizador)

app.use('/v1/sonara/usuarioFoto', usuarioFoto)

app.use('/v1/sonara/eventoStatus', eventoStatus)

app.use('/v1/sonara/eventoFoto', eventoFoto)

app.use('/v1/sonara/artistaGeneroMusical', artistaGeneroMusical)

app.use('/v1/sonara/eventoArtista', artistaEvento)

app.use('/v1/sonara/eventoArtistaStatus', eventoArtistaStatus)

app.listen(PORT, function(){
  console.log('API aguardando resposta ;)')
})
