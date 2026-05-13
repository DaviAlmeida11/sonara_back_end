/******************************************************************************
 * Objetivo: Arquivo responsável pela conexãode cassa de show com cantores
 * Data: 25/04/2026
 * Autor: Davi de Alemida Santos
 * Versão: 1.0
*****************************************************************************/

const knex = require('knex');
const knexConfig = require('../database_conf/knex');

const knexDatabase = knex(knexConfig.development);



const getSelectAllEventReview = async function(){
    try {
      
        let sql = `select * from tb_avaliacao_evento order by id_avaliacao_evento desc `

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
const getSelectByIdEventReview = async function(id){
    try {
    
        let sql = `select * from tb_avaliacao_evento where id_avaliacao_evento=${id}`
        
       
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
        
        let sql = `select id_avaliacao_evento from tb_avaliacao_evento order by id_avaliacao_evento desc limit 1`

      
        let result = await knexDatabase.raw(sql)
 
        if(Array.isArray(result))
            return Number(result[0][0].id_avaliacao_evento)
        else
            return false

    } catch (error) {

        return false
    }
}


const setInsertEventReview = async function(evento){
    try {
  let sql = `insert into tb_avaliacao_evento(
    numero_estrelas,
    usuario_id,
    evento_id,
    data_avaliacao
) values (
    ${evento.numero_estrelas},
    ${evento.usuario_id},
    ${evento.evento_id},
    "${evento.data_avaliacao}"

);`
 

        let result = await knexDatabase.raw(sql)

        if(result)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}


const setUpdateEventReview= async function(evento){
    try {
      let sql = `update tb_avaliacao_evento set 
    numero_estrelas = ${evento.numero_estrelas},
    usuario_id = ${evento.usuario_id},
    evento_id = ${evento.evento_id}
where id_avaliacao_evento = ${evento.id_avaliacao_evento}`;


        let result = await knexDatabase.raw(sql)

        if(result)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}

const setDeleteEventReview = async function(id){
    try {
      
        let sql = `delete from tb_avaliacao_evento where id_avaliacao_evento=${id}`
     
       
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
    getSelectAllEventReview,
    getSelectByIdEventReview,
    setInsertEventReview,
    setUpdateEventReview,
    getSelectLastID,
    setDeleteEventReview
} 