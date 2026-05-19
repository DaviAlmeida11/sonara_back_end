/******************************************************************************
 * Objetivo: Arquivo responsável pela conexãode cassa de show com cantores
 * Data: 25/04/2026
 * Autor: Davi de Alemida Santos
 * Versão: 1.0
*****************************************************************************/

const knex = require('knex');
const knexConfig = require('../database_conf/knex');

const knexDatabase = knex(knexConfig.development);



const getSelectAllOrganizerEvent = async function () {
    try {

        let sql = `select * from tb_evento_organizador order by id_evento_organizador desc `

        let result = await knexDatabase.raw(sql)

        if (Array.isArray(result[0]))
            return result[0]
        else
            return false

    } catch (error) {

        console.log(error)
    }
}

const getSelectByIdOrganizerEvent = async function(id){
    try {
        let sql = `select * from tb_evento_organizador where id_evento_organizador=${id}`
        let result = await knexDatabase.raw(sql)

        if(Array.isArray(result[0]))
            return result[0]  
        else
            return false
    } catch (error) {
        return false
    }
}


const getSelectOrganizerEventByIdEvent = async function (id) {
    try {
        let sql = `select * from tb_evento_organizador where evento_id=${id}`
        let result = await knexDatabase.raw(sql)

        if (Array.isArray(result[0]))
            return result[0]
        else
            return false
    } catch (error) {
        return false
    }
}



const getSelectLastID = async function () {
    try {
        let sql = `select id_evento_organizador from tb_evento_organizador order by id_evento_organizador desc limit 1`
        let result = await knexDatabase.raw(sql)

        if (Array.isArray(result[0]))
            return result[0][0]
        else
            return false
    } catch (error) {
        return false
    }
}


const setInsertOrganizerEvent = async function (evento_organizador) {
    try {
        let sql = `
INSERT INTO tb_evento_organizador (
  evento_id,
  organizador_id
) VALUES (
  ${evento_organizador.evento_id},
  ${evento_organizador.organizador_id}
)`
        let result = await knexDatabase.raw(sql)

        if (result)
            return true
        else
            return false

    } catch (error) {
        console.log(error)
    }
}


const setUpdateOrganizerEvent = async function (evento_organizador) {
    try {
        let sql = `
UPDATE tb_evento_organizador SET
  evento_id = ${evento_organizador.evento_id},
  organizador_id = ${evento_organizador.organizador_id}
WHERE id_evento_organizador = ${evento_organizador.id_evento_organizador};
`



        let result = await knexDatabase.raw(sql)

        if (result)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}

const setDeleteOrganizerEvent = async function (id) {
    try {

        let sql = `delete from tb_evento_organizador where id_evento_organizador=${id}`


        let result = await knexDatabase.raw(sql)

        if (Array.isArray(result))
            return result
        else
            return false

    } catch (error) {

        return false
    }
}

module.exports = {
    getSelectAllOrganizerEvent,
    getSelectByIdOrganizerEvent,
    setInsertOrganizerEvent,
    setUpdateOrganizerEvent,
    setDeleteOrganizerEvent,
    getSelectLastID,
    getSelectOrganizerEventByIdEvent
} 