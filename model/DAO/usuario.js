/******************************************************************************
 * Objetivo: Arquivo responsável pela conexãode cassa de show com cantores
 * Data: 25/04/2026
 * Autor: Davi de Alemida Santos
 * Versão: 1.0
*****************************************************************************/

const knex = require('knex');
const knexConfig = require('../database_conf/knex');

const knexDatabase = knex(knexConfig.development);



const getSelectAllUsers = async function(){
    try {
      
        let sql = `select * from tbl_usuario order by id_usuario desc`
    
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
const getSelectByIdUsers = async function(id){
    try {
    
        let sql = `select * from tbl_usuario where id_usuario=${id}`
        
       
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
        
        let sql = `select id_usuario from tbl_usuario order by id_usuario desc limit 1`

       
        let result = await knexDatabase.raw(sql)
 
        if(Array.isArray(result))
            return Number(result[0][0].id_usuario)
        else
            return false

    } catch (error) {

        return false
    }
}


const setInsertUsers = async function(usuario){
    try {
  let sql = `insert into tbl_usuario (
    nome,
    email,
    senha,
    cpf,
    data_nascimento,
    nacionalidade,
    endereco
) values (
    "${usuario.nome}",
    "${usuario.email}",
    "${usuario.senha}",
    "${usuario.cpf}",
    "${usuario.data_nascimento}",
    "${usuario.nacionalidade}",
    "${usuario.endereco}"
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


const setUpdateUsers = async function(usuario){
    try {
      let sql = `update tbl_usuario set 
    nome = "${usuario.nome}",
    email = "${usuario.email}",
    senha = "${usuario.senha}",
    cpf = "${usuario.cpf}",
    data_nascimento = "${usuario.data_nascimento}",
    nacionalidade = "${usuario.nacionalidade}",
    endereco = "${usuario.endereco}"
where id_usuario = ${usuario.id_usuario}`;

        let result = await knexDatabase.raw(sql)

        if(result)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}

const setDeleteUsers = async function(id){
    try {
      
        let sql = `delete from tbl_usuario where id_usuario=${id}`
        
       
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
    getSelectAllUsers,
    getSelectByIdUsers,
    setInsertUsers,
    setUpdateUsers,
    getSelectLastID,
    setDeleteUsers
} 