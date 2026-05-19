/******************************************************************************
 * Objetivo: Arquivo responsável pela conexãode cassa de show com cantores
 * Data: 25/04/2026
 * Autor: Davi de Alemida Santos
 * Versão: 1.0
*****************************************************************************/

const knex = require('knex');
const knexConfig = require('../database_conf/knex');

const knexDatabase = knex(knexConfig.development);



const getSelectAllEvent = async function(){
    try {
      
        let sql = `select * from vw_evento`
    
        let result = await knexDatabase.raw(sql)

        if(Array.isArray(result[0]))
            return result[0]
        else
            return false

    } catch (error) {
       
        return false
    }
}

//Retorna um filme filtrando pelo ID do banco de dados
const getSelectByIdEvent = async function(id){
    try {
        let sql = `select * from vw_evento where id_evento=${id}`
        let result = await knexDatabase.raw(sql)

        if(Array.isArray(result[0]))
            return result[0]  
        else
            return false
    } catch (error) {
        return false
    }
}


const getSelectLastID = async function(){
    try {
        let sql = `select id_evento from tb_evento order by id_evento desc limit 1`
        let result = await knexDatabase.raw(sql)

        if(Array.isArray(result[0]))
            return result[0][0] 
        else
            return false
    } catch (error) {
        console.log(error)
    }
}


const setInsertEvent = async function(evento){
    try {
        let sql = `insert into tb_evento (nome, descricao, local, data, hora_inicio, hora_fim)
                    values( "${evento.nome}",
                            "${evento.descricao}", 
                            "${evento.local}", 
                            "${evento.data}",
                            "${evento.hora_inicio}",
                            "${evento.hora_fim}")`
        let result = await knexDatabase.raw(sql)

        if(result)
            return true
        else
            return false
    } catch (error) {
        console.log(error)
    }
}


const setUpdateEvent = async function(evento){
    try {
        let sql = `update tb_evento set 
                        nome               = "${evento.nome}",
                        descricao          = "${evento.descricao}",
                        local              = "${evento.local}",
                        data               = "${evento.data}",
                        hora_inicio        = "${evento.hora_inicio}",
                        hora_fim           = "${evento.hora_fim}",
                        endereco_id         = ${evento.endereco_id}
                        
                    
                    where id_evento = ${evento.id_evento}`

        let result = await knexDatabase.raw(sql)

        if(result)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}

const setDeleteEvent = async function(id){
    try {
      
        let sql = `delete from tb_evento where id_evento=${id}`
        
        
       
        let result = await knexDatabase.raw(sql)

        if(Array.isArray(result))
            return result
        else
            return false

    } catch (error) {
       
        return false
    }
}

module.exports = {
    getSelectAllEvent,
    getSelectByIdEvent,
    setInsertEvent,
    setUpdateEvent,
    getSelectLastID,
    setDeleteEvent
} 