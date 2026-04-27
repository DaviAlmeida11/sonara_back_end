/******************************************************************************
 * Objetivo: Arquivo responsável pela conexãode cassa de show com cantores
 * Data: 25/04/2026
 * Autor: Davi de Alemida Santos
 * Versão: 1.0
*****************************************************************************/

const knex = require('knex');
const knexConfig = require('../database_conf/knex');

const knexDatabase = knex(knexConfig.development);



const getSelectAllGenders = async function(){
    try {
      
        let sql = `select * from tb_genero order by id_genero desc`
    
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
const getSelectByIdGender = async function(id){
    try {
    
        let sql = `select * from tb_genero where id_genero=${id}`
        
       
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
        
        let sql = `select id from tb_genero order by id_genero desc limit 1`

       
        let result = await knexDatabase.raw(sql)
 
        if(Array.isArray(result))
            return Number(result[0][0].id)
        else
            return false

    } catch (error) {

        return false
    }
}


const setInsertGenders = async function(genero){
    try {
        let sql = `insert into tb_genero (	nome)
                    values( "${genero.nome}" )`

        let result = await knexDatabase.raw(sql)

        if(result)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}


const setUpdateGenders = async function(genero){
    try {
        let sql = `update tb_genero set 
                        nome                = "${genero.nome}"
                        
                    
                    where id_genero = ${genero.id}`

        let result = await knexDatabase.raw(sql)

        if(result)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}

const setDeleteGenders = async function(id){
    try {
      
        let sql = `delete from tb_genero where id_genero=${id}`
        
       
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
    getSelectAllGenders,
    getSelectByIdGender,
    setInsertGenders,
    setUpdateGenders,
    getSelectLastID,
    setDeleteGenders
} 