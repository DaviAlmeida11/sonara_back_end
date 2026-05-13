/******************************************************************************
 * Objetivo: Arquivo responsável pela conexãode cassa de show com cantores
 * Data: 25/04/2026
 * Autor: Davi de Alemida Santos
 * Versão: 1.0
*****************************************************************************/

const knex = require('knex');
const knexConfig = require('../database_conf/knex');

const knexDatabase = knex(knexConfig.development);



const getSelectAllStatusEvent = async function(){
    try {
      
        let sql = `select * from tb_evento_status order by id_evento_status desc `

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
const getSelectByIdStatusEvent = async function(id){
    try {
    
        let sql = `select * from tb_evento_status where id_evento_status=${id}`
        
       
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
        
        let sql = `select id_evento_status from tb_evento_status order by id_evento_status desc limit 1`

      
        let result = await knexDatabase.raw(sql)
 
        if(Array.isArray(result))
            return Number(result[0][0].id_evento_status)
        else
            return false

    } catch (error) {

        return false
    }
}


const setInsertStatusEvent = async function(evento_status){
    try {
 let sql = `
INSERT INTO tb_evento_status (
  evento_id,
  status_id,
  data_hora
) VALUES (
  ${evento_status.evento_id},
  ${evento_status.status_id},
   ${evento_status.data_hora ? `'${evento_status.data_hora}'` : null}
)`

 

        let result = await knexDatabase.raw(sql)

        if(result)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}


const setUpdateStatusEvent = async function(evento_status){
    try {
    let sql = `
UPDATE tb_evento_status SET
  evento_id = ${evento_status.evento_id},
  status_id = ${evento_status.status_id},
 data_hora = ${evento_status.data_hora ? `'${evento_status.data_hora}'` : null}
WHERE id_evento_status = ${evento_status.id_evento_status};
`



        let result = await knexDatabase.raw(sql)

        if(result)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}

const setDeleteStatusEvent = async function(id){
    try {
      
        let sql = `delete from tb_evento_status where id_evento_status=${id}`
        
       
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
    getSelectAllStatusEvent,
    getSelectByIdStatusEvent,
    setInsertStatusEvent,
    setUpdateStatusEvent,
    setDeleteStatusEvent,
    getSelectLastID
} 