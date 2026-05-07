/******************************************************************************
 * Objetivo: Arquivo responsável pela conexãode cassa de show com cantores
 * Data: 25/04/2026
 * Autor: Davi de Alemida Santos
 * Versão: 1.0
*****************************************************************************/

const knex = require('knex');
const knexConfig = require('../database_conf/knex');

const knexDatabase = knex(knexConfig.development);



const getSelectAllArtistGenders = async function(){
    try {
      
        let sql = `select * from tb_artista_genero order by id_artista_genero desc `

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
const getSelectByIdArtistGenders = async function(id){
    try {
    
        let sql = `select * from tb_artista_genero where id_artista_genero=${id}`
        
       
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
        
        let sql = `select id_artista_genero from tb_artista_genero order by id_artista_genero desc limit 1`

      
        let result = await knexDatabase.raw(sql)
 
        if(Array.isArray(result))
            return Number(result[0][0].id_artista_genero)
        else
            return false

    } catch (error) {

        return false
    }
}


const setInsertArtistGenders = async function(artista_genero){
    try {
  let sql = `insert into tb_artista_genero (
    genero_id  
    artista_id,
) values (
    "${artista_genero.genero_id}",
    "${artista_genero.artista_id}"

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


const setUpdateArtistGenders = async function(artista_genero){
    try {
      let sql = `update tb_artista_genero set 
    genero_id = "${artista_genero.genero_id}",
    artista_id = "${artista_genero.artista_id}",
where id_artista_genero = ${artista_genero.id_artista}`;

        let result = await knexDatabase.raw(sql)

        if(result)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}

const setDeleteArtistGenders = async function(id){
    try {
      
        let sql = `delete from tb_artista_genero where id_artista_genero=${id}`
        
       
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
    getSelectAllArtistGenders,
    getSelectByIdArtistGenders,
    setInsertArtistGenders,
    setUpdateArtistGenders,
    getSelectLastID,
    setDeleteArtistGenders
} 