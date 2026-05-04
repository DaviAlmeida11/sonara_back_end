/******************************************************************************
 * Objetivo: Arquivo responsável pela conexãode cassa de show com cantores
 * Data: 25/04/2026
 * Autor: Davi de Alemida Santos
 * Versão: 1.0
*****************************************************************************/

const knex = require('knex');
const knexConfig = require('../database_conf/knex');

const knexDatabase = knex(knexConfig.development);



const getSelectAllPassword = async function(){
    try {
      
        let sql = `select * from tb_recuperacao_senha order by id_recuperacao desc`
    
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
const getSelectByIdPassword = async function(id){
    try {
    
        let sql = `select * from tb_recuperacao_senha where id_recuperacao=${id}`
        
       
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
        
        let sql = `select id_recuperacao from tb_recuperacao_senha order by id_recuperacao desc limit 1`

       
        let result = await knexDatabase.raw(sql)
 
        if(Array.isArray(result))
            return Number(result[0][0].id_recuperacao)
        else
            return false

    } catch (error) {

        return false
    }
}


const setInsertPassword = async function(recuperacao_senha){
    try {
        let sql = `insert into tb_recuperacao_senha (usuario_id, expira_em, tentativas)
                    values( "${recuperacao_senha.usuario_id}",
                            "${recuperacao_senha.expira_em}", 
                            "${recuperacao_senha.tentativas}"`

               
        let result = await knexDatabase.raw(sql)

        if(result)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}


const setUpdatePassword = async function(recuperacao_senha){
    try {
        let sql = `update tb_recuperacao_senha set 
                        usuario_id         = "${recuperacao_senha.usuario_id}",
                        expira_em          = "${recuperacao_senha.expira_em}",
                        tentativa          = "${recuperacao_senha.tentativas}"
                
                    where id_recuperacao
         = ${recuperacao_senha.id_recuperacao}`

        let result = await knexDatabase.raw(sql)

        if(result)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}

const setDeletePassword = async function(id){
    try {
      
        let sql = `delete from tb_recuperacao_senha where id_recuperacao=${id}`
        
        
       
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
    getSelectAllPassword,
    getSelectByIdPassword,
    setInsertPassword ,
    setUpdatePassword ,
    getSelectLastID,
    setDeletePassword
} 