/******************************************************************************
 * Objetivo: Arquivo responsável pela conexãode cassa de show com cantores
 * Data: 25/04/2026
 * Autor: Davi de Alemida Santos
 * Versão: 1.0
*****************************************************************************/

const knex = require('knex');
const knexConfig = require('../database_conf/knex');

const knexDatabase = knex(knexConfig.development);



const getSelectAllMusicalGeners = async function(){
    try {
      
        let sql = `select * from tb_genero_musical order by id_genero_musical desc`
    
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
    
        let sql = `select * from tb_genero_musical where id_genero_musical =${id}`
        
       
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
        
        let sql = `select id_genero_musical from tb_genero_musical order by id_genero_musical desc limit 1`

       
        let result = await knexDatabase.raw(sql)
 
        if(Array.isArray(result))
            return Number(result[0][0].id_genero_musical)
        else
            return false

    } catch (error) {

        return false
    }
}


const setInsertMusicalGeners = async function(generoMusical){
    try {
        let sql = `insert into tb_genero_musical(nome)
                    values( "${generoMusical.nome}")`

               
        let result = await knexDatabase.raw(sql)

        if(result)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}


const setUpdateMusicalGeners = async function(generoMusical){
    try {
        let sql = `update tb_genero_musical set 
                        nome                = "${generoMusical.nome}"
                        
                    
                    where id_genero_musical = ${generoMusical.id_genero_musical}`

        let result = await knexDatabase.raw(sql)

        if(result)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}

const setDeleteMusicalGeners = async function(id){
    try {
      
        let sql = `delete from tb_genero_musical where id_genero_musical=${id}`
        
       
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
    getSelectAllMusicalGeners,
    getSelectByIdGender,
    setInsertMusicalGeners,
    setUpdateMusicalGeners,
    getSelectLastID,
    setDeleteMusicalGeners
} 