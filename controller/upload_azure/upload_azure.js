/***************************************************************************************
 * Objetivo: Arquivo resposnsável por realizar UPLOAD de arquivos na Azure
 * Data: 11/06/2025
 * Autor: Davi
 * Versão: 1.0
 * Obs: Para fazer funcionar o upload precisa instalar a biblioteca para fazer o Fetch e 
 *          o Multer para receber o arquivo no APP
***************************************************************************************/

//Import dos dados de configuração da AZURE
const AZURE = require('../modulo/conf_azure')

//Import da biblioteca para fazer requisições pelo Back-end
const fetch = require('node-fetch').default

//Função para realizar o upload de arquivos no servidor da Azure
const uploadFiles = async function(file){

    //Configura os os tipos de dados aceitos na API
    let arrayAllowTypes = ['JPG', 'PNG', 'JPEG']
    //Recebe a extensão do arquivo
    let mimeType = String(file.mimetype).split('/')[1].toUpperCase()
    //Recebe o tamanho do arquivo e transforma em kb
    let lengthFile = Number(file.size) / 1024


    console.log (lengthFile)
    //Validação do tipo de extensão e do tamanho do arquivo
    if(arrayAllowTypes.indexOf(mimeType) != -1 && lengthFile.toFixed(1) <= 5000){

        //Cria o nome do arquivo com a data e hora atual
        let fileName = Date.now() + file.originalname

        //URL para realizar a requisição para o servidor da AZURE
        let urlFile         = `https://${AZURE.ACCOUNT}.blob.core.windows.net/${AZURE.CONTAINER}/${fileName}`

        //URL do arquivo + token de autenticação
        let urlFileToken    = `${urlFile}?${AZURE.TOKEN}`

        //Realiza a requisição no servidor da AZURE e encaminha no body o file
        let response = await fetch(urlFileToken, {
            method: 'PUT',
            headers: {
                'x-ms-blob-type': 'BlockBlob',
                'Content-Type': 'application/octet-stream'
            },
            body: file.buffer
        })

        console.log(response)
        if(response.status == 201)
            return urlFile
        else
            return false
    }else{
        return false
    }
}

module.exports = {uploadFiles}