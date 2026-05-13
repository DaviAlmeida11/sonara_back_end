/******************************************************************************
 * Objetivo: Arquivo responsável pela conexãode cassa de show com cantores
 * Data: 25/04/2026
 * Autor: Davi de Alemida Santos
 * Versão: 1.0
*****************************************************************************/

const knex = require('knex');
const knexConfig = require('../database_conf/knex');

const knexDatabase = knex(knexConfig.development);



const getSelectAllArtistReview = async function(){
    try {
      
        let sql = `select * from tb_avaliacao_artista order by id_avaliacao_artista desc `

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
const getSelectByIdArtistReview= async function(id){
    try {
    
        let sql = `select * from tb_avaliacao_artista where id_avaliacao_artista=${id}`
        
       
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
        
        let sql = `select id_avaliacao_artista from tb_avaliacao_artista order by id_avaliacao_artista desc limit 1`

      
        let result = await knexDatabase.raw(sql)
 
        if(Array.isArray(result))
            return Number(result[0][0].id_avaliacao_artista)
        else
            return false

    } catch (error) {

        return false
    }
}


const setInsertArtistReview = async function(artista){
    try {
  let sql = `insert into tb_avaliacao_artista (
    numero_estrelas,
    usuario_id,
    artista_id,
    data_avaliacao
) values (
    "${artista.numero_estrelas}",
    ${artista.usuario_id},
    ${artista.artista_id},
    "${artista.data_avaliacao}"

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


const setUpdateArtistReview = async function(artista){
    try {
      let sql = `update tb_avaliacao_artista set 
    numero_estrelas = ${artista.numero_estrelas},
    usuario_id = ${artista.usuario_id},
    artista_id = ${artista.artista_id}
where id_avaliacao_artista = ${artista.id_avaliacao_artista}`;


        let result = await knexDatabase.raw(sql)

        if(result)
            return true
        else
            return false

    } catch (error) {
     
    }
}

const setDeleteArtistReview = async function(id){
    try {
      
        let sql = `delete from tb_avaliacao_artista where id_avaliacao_artista=${id}`
        
       
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
    getSelectAllArtistReview,
    getSelectByIdArtistReview,
    setInsertArtistReview,
    setUpdateArtistReview,
    getSelectLastID,
    setDeleteArtistReview
} 