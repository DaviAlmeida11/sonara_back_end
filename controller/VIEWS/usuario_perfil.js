/******************************************************************************
 * Objetivo: Arquivo responsável pela conexãode cassa de show com cantores
 * Data: 25/04/2026
 * Autor: Davi de Alemida Santos
 * Versão: 1.0
*****************************************************************************/

const usuarioPerfilDAO_VEWS = require('../../model/DAO/VEWS/perfil_usuario.js')


const DEFAULT_MESSAGES = require('../modulo/conf_message.js')


const listarPerfilUsuario = async function(){
    
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {
       
        let usuarioPerfil = await usuarioPerfilDAO_VEWS.getSelectViewUserPerfil
        
        if(usuarioPerfil){
            if(usuarioPerfil.length > 0){
            MESSAGES.HEADER.status      = MESSAGES.SUCCESS_REQUEST.status
            MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
            MESSAGES.HEADER.response.usuarioPerfil = usuarioPerfil

            return MESSAGES.HEADER
                return MESSAGES.ERROR_NOT_FOUND //404
            }
        }else{
            return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500
        }
    } catch (error) {
        return MESSAGES.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}

module.exports = {
    listarPerfilUsuario
}