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
      
        let sql = `select * from tb_evento order by id_evento desc`
    
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
    
        let sql = `select * from tb_evento where id_evento=${id}`
        
       
        let result = await knexDatabase.raw(sql)

        if(Array.isArray(result[0]))
            return result
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
 
        if(Array.isArray(result))
            return Number(result[0][0].id_evento)
        else
            return false

    } catch (error) {

        return false
    }
}


const setInsertEvent = async function(foto){
    try {
        let sql = `insert into tb_evento (nome, descricao, local, data, hora_inicio, hora_fim, endereco)
                    values( "${foto.nome}",
                            "${foto.descricao}", 
                            "${foto.local}", 
                            "${foto.data}",
                            "${foto.hora_inicio}",
                            "${foto.hora_fim}",
                            "${foto.endereco}")`

               
        let result = await knexDatabase.raw(sql)

        if(result)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}


const setUpdateEvent = async function(foto){
    try {
        let sql = `update tb_evento set 
                        nome               = "${foto.nome}",
                        descricao          = "${foto.descricao}",
                        local              = "${foto.local}",
                        data               = "${foto.data}",
                        hora_inicio        = "${foto.hora_inicio}",
                        hora_fim           = "${foto.hora_fim}",
                        endereco           = "${foto.endereco}"
                        
                    
                    where id_evento = ${foto.id_evento}`

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