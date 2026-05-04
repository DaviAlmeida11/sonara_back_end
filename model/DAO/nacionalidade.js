/******************************************************************************
 * Objetivo: Arquivo responsável pela conexãode cassa de show com cantores
 * Data: 25/04/2026
 * Autor: Davi de Alemida Santos
 * Versão: 1.0
*****************************************************************************/

const knex = require('knex');
const knexConfig = require('../database_conf/knex');

const knexDatabase = knex(knexConfig.development);



const getSelectAllNationality = async function(){
    try {
      
        let sql = `select * from tb_nacionalidade order by id_nacionalidade desc`
    
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
const getSelectByIdNationality = async function(id){
    try {
    
        let sql = `select * from tb_nacionalidade where id_nacionalidade=${id}`
        
       
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
        
        let sql = `select id_nacionalidade from tb_nacionalidade order by id_nacionalidade desc limit 1`

       
        let result = await knexDatabase.raw(sql)
 
        if(Array.isArray(result))
            return Number(result[0][0].id_nacionalidade)
        else
            return false

    } catch (error) {

        return false
    }
}


const setInsertNationality = async function(nacionalidade){
    try {
        let sql = `insert into tb_nacionalidade (nome)
                    values( "${nacionalidade.nome}" )`

               
        let result = await knexDatabase.raw(sql)

        if(result)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}


const setUpdateNationality = async function(nacionalidade){
    try {
        let sql = `update tb_nacionalidade set 
                        nome                = "${nacionalidade.nome}"
                        
                    
                    where id_nacionalidade = ${nacionalidade.id_nacionalidade}`

        let result = await knexDatabase.raw(sql)

        if(result)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}

const setDeleteNationality = async function(id){
    try {
      
        let sql = `delete from tb_nacionalidade where id_nacionalidade=${id}`
        
       
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
    getSelectAllNationality,
    getSelectByIdNationality,
    setInsertNationality,
    setUpdateNationality,
    getSelectLastID,
    setDeleteNationality
} 