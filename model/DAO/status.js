/******************************************************************************
 * Objetivo: Arquivo responsável pela conexãode cassa de show com cantores
 * Data: 29/04/2026
 * Autor: Davi de Alemida Santos
 * Versão: 1.0
*****************************************************************************/

const knex = require('knex');
const knexConfig = require('../database_conf/knex');

const knexDatabase = knex(knexConfig.development);



const getSelectAllStatus = async function(){
    try {
      
        let sql = `select * from tb_status order by id_status desc`
    
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
const getSelectByIdStatus = async function(id){
    try {
    
        let sql = `select * from tb_status where id_status=${id}`
        
       
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
        
        let sql = `select id_status from tb_status order by id_status desc limit 1`

       
        let result = await knexDatabase.raw(sql)
 
        if(Array.isArray(result))
            return Number(result[0][0].id_status)
        else
            return false

    } catch (error) {

        return false
    }
}


const setInsertStatus = async function(status){
    try {
        let sql = `insert into tb_status (nome)
                    values( "${status.nome}" )`

               
        let result = await knexDatabase.raw(sql)

        if(result)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}


const setUpdateStatus = async function(status){
    try {
        let sql = `update tb_status set 
                        nome                = "${status.nome}"
                        
                    
                    where id_status = ${status.id_status}`

        let result = await knexDatabase.raw(sql)

        if(result)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}

const setDeleteStatus = async function(id){
    try {
      
        let sql = `delete from tb_status where id_status=${id}`
        
       
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
    getSelectAllStatus,
    getSelectByIdStatus,
    setInsertStatus,
    setUpdateStatus,
    getSelectLastID,
    setDeleteStatus
} 