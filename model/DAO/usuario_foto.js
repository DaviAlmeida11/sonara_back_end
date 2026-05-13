/******************************************************************************
 * Objetivo: Arquivo responsável pela conexãode cassa de show com cantores
 * Data: 25/04/2026
 * Autor: Davi de Alemida Santos
 * Versão: 1.0
*****************************************************************************/

const knex = require('knex');
const knexConfig = require('../database_conf/knex');

const knexDatabase = knex(knexConfig.development);



const getSelectAllPhotoUser = async function(){
    try {
      
        let sql = `select * from tb_usuario_foto order by id_usuario_foto desc `

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
const getSelectByIdPhotoUser = async function(id){
    try {
    
        let sql = `select * from tb_usuario_foto where id_usuario_foto=${id}`
        
       
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
        
        let sql = `select id_usuario_foto from tb_usuario_foto order by id_usuario_foto desc limit 1`

      
        let result = await knexDatabase.raw(sql)
 
        if(Array.isArray(result))
            return Number(result[0][0].id_usuario_foto)
        else
            return false

    } catch (error) {

        return false
    }
}


const setInsertPhotoUser = async function(usuario_foto){
    try {
  let sql = `insert into tb_usuario_foto (
    foto_id,
    usuario_id
) values (
    "${usuario_foto.foto_id}",
    "${usuario_foto.usuario_id}"

);`
    console.log(sql)
        let result = await knexDatabase.raw(sql)

        if(result)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}


const setUpdatePhotoUser = async function(usuario_foto){
    try {
      let sql = `update tb_usuario_foto set 
    foto_id = ${usuario_foto.foto_id},
    usuario_id = ${usuario_foto.usuario_id}
where id_usuario_foto = ${usuario_foto.id_usuario_foto}`;


        let result = await knexDatabase.raw(sql)

        if(result)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}

const setDeletePhotoUser = async function(id){
    try {
      
        let sql = `delete from tb_usuario_foto where id_usuario_foto=${id}`
        
       
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
    getSelectAllPhotoUser,
    getSelectByIdPhotoUser,
    setInsertPhotoUser,
    setUpdatePhotoUser,
    getSelectLastID,
    setDeletePhotoUser
} 