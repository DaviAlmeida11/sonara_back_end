/******************************************************************************
 * Objetivo: Arquivo responsável pela conexãode cassa de show com cantores
 * Data: 25/04/2026
 * Autor: Davi de Alemida Santos
 * Versão: 1.0
*****************************************************************************/

const knex = require('knex');
const knexConfig = require('../database_conf/knex');

const knexDatabase = knex(knexConfig.development);



const getSelectAllArtistGendersSong = async function(){
    try {
      
        let sql = `select * from tb_artista_genero_musical order by id_artista_genero_musical desc `

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
const getSelectByIdArtistGendersSong = async function(id){
    try {
    
        let sql = `select * from tb_artista_genero_musical where id_artista_genero_musical=${id}`
        
       
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
        
        let sql = `select id_artista_genero_musical from tb_artista_genero_musical order by id_artista_genero_musical desc limit 1`

      
        let result = await knexDatabase.raw(sql)
 
        if(Array.isArray(result))
            return Number(result[0][0].id_artista_genero_musical)
        else
            return false

    } catch (error) {

        return false
    }
}


const setInsertArtistGendersSong = async function(artista_genero_musical){
    try {
let sql = `insert into tb_artista_genero_musical (
    genero_musical_id,
    artista_id
) values (
    ${artista_genero_musical.genero_musical_id},
    ${artista_genero_musical.artista_id}
 
)`;

 

        let result = await knexDatabase.raw(sql)

        if(result)
            return true
        else
            return false

    } catch (error) {
 
    }
}


const setUpdateArtistGendersSong = async function(artista_genero_musical){
    try {
      let sql = `update tb_artista_genero_musical set 
    genero_musical_id = "${artista_genero_musical.genero_musical_id}",
    artista_id = "${artista_genero_musical.artista_id}"
where id_artista_genero_musical = ${artista_genero_musical.id_artista_genero_musical}`;

        let result = await knexDatabase.raw(sql)

        if(result)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}

const setDeleteArtistGendersSong = async function(id){
    try {
      
        let sql = `delete from tb_artista_genero_musical where id_artista_genero_musical=${id}`
        
       
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
    getSelectAllArtistGendersSong,
    getSelectByIdArtistGendersSong,
    setInsertArtistGendersSong,
    setUpdateArtistGendersSong,
    getSelectLastID,
    setDeleteArtistGendersSong
} 