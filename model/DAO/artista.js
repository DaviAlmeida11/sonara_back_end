/******************************************************************************
 * Objetivo: Arquivo responsável pela conexãode cassa de show com cantores
 * Data: 25/04/2026
 * Autor: Davi de Alemida Santos
 * Versão: 1.0
*****************************************************************************/

const knex = require('knex');
const knexConfig = require('../database_conf/knex');

const knexDatabase = knex(knexConfig.development);



const getSelectAllArtist = async function(){
    try {
      
        let sql = `select * from tb_artista order by id_artista desc `

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
const getSelectByIdArtist = async function(id){
    try {
    
        let sql = `select * from tb_artista where id_artista=${id}`
        
       
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
        
        let sql = `select id_artista from tb_artista order by id_artista desc limit 1`

       
        let result = await knexDatabase.raw(sql)
 
        if(Array.isArray(result))
            return Number(result[0][0].id_artista)
        else
            return false

    } catch (error) {

        return false
    }
}


const setInsertArtist = async function(artista){
    try {
  let sql = `insert into tb_artista (
    nome_artistico  ,
    usuario_id,
    descricao
) values (
    "${artista.nome_artistico}",
    "${artista.usuario_id}",
    "${artista.descricao}"

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


const setUpdateArtist = async function(artista){
    try {
      let sql = `update tb_artista set 
    nome_artistico = "${artista.nome_artistico}",
    usuario_id = "${artista.usuario_id}",
    descricao = "${artista.descricao}"
where id_artista = ${artista.id_artista}`;
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

const setDeleteArtist = async function(id){
    try {
      
        let sql = `delete from tb_artista where id_artista=${id}`
        
       
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
    getSelectAllArtist,
    getSelectByIdArtist,
    setInsertArtist,
    setUpdateArtist,
    getSelectLastID,
    setDeleteArtist
} 