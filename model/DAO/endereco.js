/******************************************************************************
 * Objetivo: Arquivo responsável pela conexãode cassa de show com cantores
 * Data: 25/04/2026
 * Autor: Davi de Alemida Santos
 * Versão: 1.0
*****************************************************************************/

const knex = require('knex');
const knexConfig = require('../database_conf/knex');

const knexDatabase = knex(knexConfig.development);



const getSelectAllAddress = async function(){
    try {
      
        let sql = `select * from tb_endereco order by id_endereco desc`
    
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
const getSelectByIdAddress = async function(id){
    try {
    
        let sql = `select * from tb_endereco where id_endereco=${id}`
        
       
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
        
        let sql = `select id_endereco from tb_endereco order by id_endereco desc limit 1`

       
        let result = await knexDatabase.raw(sql)
 
        if(Array.isArray(result))
            return Number(result[0][0].id_endereco)
        else
            return false

    } catch (error) {

        return false
    }
}


const setInsertAddress = async function(endereco){
    try {
  let sql = `insert into tb_endereco (
    cep,
    cidade,
    estado,
    logradouro,
    numero
) values (
    "${endereco.cep}",
    "${endereco.cidade}",
    "${endereco.estado}",
    "${endereco.logradouro}",
    "${endereco.numero}"
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


const setUpdateAddress = async function(endereco){
    try {
      let sql = `update tb_endereco set 
    cep = "${endereco.cep}",
    cidade = "${endereco.cidade}",
    estado = "${endereco.estado}",
    logradouro = "${endereco.logradouro}",
    numero = "${endereco.numero}"
where id_endereco = ${endereco.id_endereco}`;

        let result = await knexDatabase.raw(sql)

        if(result)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}

const setDeleteAddress = async function(id){
    try {
      
        let sql = `delete from tb_endereco where id_endereco=${id}`
        
       
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
    getSelectAllAddress,
    getSelectByIdAddress,
    setInsertAddress,
    setUpdateAddress,
    getSelectLastID,
    setDeleteAddress
} 