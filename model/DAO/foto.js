/******************************************************************************
 * Objetivo: Arquivo responsável pela conexãode cassa de show com cantores
 * Data: 25/04/2026
 * Autor: Davi de Alemida Santos
 * Versão: 1.0
*****************************************************************************/

const knex = require('knex');
const knexConfig = require('../database_conf/knex');

const knexDatabase = knex(knexConfig.development);



const getSelectAllPicture = async function(){
    try {
      
        let sql = `select * from tb_foto order by id_foto desc`
    
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
const getSelectByIdPicture = async function(id){
    try {
    
        let sql = `select * from tb_foto where id_foto=${id}`
        
       
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
        
        let sql = `select id_foto from tb_foto order by id_foto desc limit 1`

       
        let result = await knexDatabase.raw(sql)
 
        if(Array.isArray(result))
            return Number(result[0][0].id_foto)
        else
            return false

    } catch (error) {

        return false
    }
}


const setInsertPicture = async function(foto){
    try {
        let sql = `insert into tb_foto (foto)
                    values( "${foto.foto}" )`

               
        let result = await knexDatabase.raw(sql)

        if(result)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}


const setUpdatePicture = async function(foto){
    try {
        let sql = `update tb_foto set 
                        foto               = "${foto.foto}"
                        
                    
                    where id_foto = ${foto.id_foto}`

        let result = await knexDatabase.raw(sql)

        if(result)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}

const setDeletePicture = async function(id){
    try {
      
        let sql = `delete from tb_foto where id_foto=${id}`
        
        
       
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
    getSelectAllPicture,
    getSelectByIdPicture,
    setInsertPicture,
    setUpdatePicture,
    getSelectLastID,
    setDeletePicture
} 