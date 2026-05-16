/******************************************************************************
 * Objetivo: Arquivo responsável pela conexãode cassa de show com cantores
 * Data: 25/04/2026
 * Autor: Davi de Alemida Santos
 * Versão: 1.0
*****************************************************************************/

const knex = require('knex');
const knexConfig = require('../../database_conf/knex');

const knexDatabase = knex(knexConfig.development);



const getSelectViewEventPhoto = async function(id_evento){
    try {
        let sql = `SELECT id_foto, url_foto, id_evento FROM vw_evento_fotos where id_evento = ${id_evento}`
        let result = await knexDatabase.raw(sql)

        if(Array.isArray(result[0]))
            return result[0]
        else
            return false
    } catch (error) {
        return false
    }
}


const getSelectAllEventPhoto = async function(){
    try {
      
        let sql = `SELECT id_foto, url_foto FROM vw_evento_fotos order by id_foto desc`

        let result = await knexDatabase.raw(sql)
   
        if(Array.isArray(result[0]))
            return result[0]
        else
            return false

    } catch (error) {
       
        return false
    }
}

module.exports = {
    getSelectViewEventPhoto,
    getSelectAllEventPhoto
}