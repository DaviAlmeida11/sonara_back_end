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
      
        let sql = `select * from vw_usuario`
    
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
    
        let sql = `select * from tb_usuario where id_usuario=${id}`
        
       
        let result = await knexDatabase.raw(sql)

        if(Array.isArray(result[0]))
            return result
        else
            return false

    } catch (error) {
      
        return false
    }
}


const getSelectByIdUsersOrganizer = async function(id){
    try {
    
        let sql = `select * from tb_organizador where usuario_id=${id}`
        
       
        let result = await knexDatabase.raw(sql)

        if(Array.isArray(result[0]))
            return result
        else
            return false

    } catch (error) {
      
        return false
    }
}


const getSelectLastID = async function() {
    try {
        let result = await knexDatabase('tb_usuario')
            .max('id_usuario as id_usuario')
            .first()
        
        console.log('getSelectLastID result:', result) 
        return result
    } catch (error) {
        console.log(error)
        return false
    }
}

const getUsuarioByUsuarioEmail = async function(email) {
    try {
        let sql = `select * from tb_usuario where email = '${email}'`

        const result = await knexDatabase.raw(sql)

        if (Array.isArray(result[0]) && result[0].length > 0)
            return result[0][0]
        else
            return false

    } catch (error) {
        return false
    }
}


const getUsuarioByUsuarioCPF = async function(cpf) {
    try {
        let sql = `select * from tb_usuario where email = '${cpf}'`

        const result = await knexDatabase.raw(sql)

        if (Array.isArray(result[0]) && result[0].length > 0)
            return result[0][0]
        else
            return false

    } catch (error) {
        return false
    }
}

const setInsertUsers = async function(usuario){
    try {
        let sql = `
        INSERT INTO tb_usuario (
            nome,
            email,
            senha,
            cpf,
            data_nasc,
            nacionalidade_id,
            genero_id,
            telefone
        ) VALUES (
            '${usuario.nome}',
            '${usuario.email}',
            '${usuario.senha}',
            '${usuario.cpf}',
            '${usuario.data_nasc}',
            ${usuario.nacionalidade_id},
            ${usuario.genero_id},
            ${usuario.telefone ? `'${usuario.telefone}'` : null}
        );`


        let result = await knexDatabase.raw(sql)


        return !!result

    } catch (error) {
        console.log(error)
    
    }
}


const setUpdateUsers = async function(usuario){
    try {
  
        let sql = `update tb_usuario set 
        nome = "${usuario.nome}",
        email = "${usuario.email}",
        senha = "${usuario.senha}",
        telefone = ${usuario.telefone === null ? "NULL" : `"${usuario.telefone}"`},
        cpf = "${usuario.cpf}",
        data_nasc = "${usuario.data_nasc}",
        nacionalidade_id = ${usuario.nacionalidade_id},
        endereco_id = ${usuario.endereco_id},
        genero_id = ${usuario.genero_id}
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
      
        let sql = `delete from tb_usuario where id_usuario=${id}`
        
       
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
    setDeleteUsers,
    getSelectByIdUsersOrganizer,
    getUsuarioByUsuarioEmail,
    getUsuarioByUsuarioCPF
} 