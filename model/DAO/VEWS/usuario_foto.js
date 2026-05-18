/******************************************************************************
 * Objetivo: Arquivo responsável pela conexãode cassa de show com cantores
 * Data: 25/04/2026
 * Autor: Davi de Alemida Santos
 * Versão: 1.0
*****************************************************************************/

const knex = require('knex');
const knexConfig = require('../../database_conf/knex');

const knexDatabase = knex(knexConfig.development);



const getSelectViewUserPhoto = async function(id_usuario){
    try {
        let sql = `SELECT id_foto, url_foto, id_usuario FROM vw_usuario_com_foto where id_usuario = ${id_usuario}`
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
    getSelectViewUserPhoto
}