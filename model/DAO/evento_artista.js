/******************************************************************************
 * Objetivo: Arquivo responsável pela conexãode cassa de show com cantores
 * Data: 25/04/2026
 * Autor: Davi de Alemida Santos
 * Versão: 1.0
*****************************************************************************/

const knex = require('knex');
const knexConfig = require('../database_conf/knex');

const knexDatabase = knex(knexConfig.development);



const getSelectAllArtistEvent = async function(){
    try {
      
        let sql = `select * from tb_evento_artista order by id_evento_artista desc `

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
const getSelectByIdArtistEvent  = async function(id){
    try {
    
        let sql = `select * from tb_evento_artista where id_evento_artista=${id}`
        
       
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
        
        let sql = `select id_evento_artista from tb_evento_artista order by id_evento_artista desc limit 1`

      
        let result = await knexDatabase.raw(sql)
 
        if(Array.isArray(result))
            return Number(result[0][0].id_evento_artista)
        else
            return false

    } catch (error) {

        return false
    }
}


const setInsertArtistEvent  = async function(evento_artista){
    try {
let sql = `
INSERT INTO tb_evento_artista (
  artista_id,
  evento_id,
  cache_esperado,
  cache_ofertado,
  cache_final,
  contra_proposta,
  sobre_artista,
  motivo_inscricao
) VALUES (
  ${evento_artista.artista_id},
  ${evento_artista.evento_id},
  ${evento_artista.cache_esperado},
  ${evento_artista.cache_ofertado},
  ${evento_artista.cache_final},
  ${evento_artista.contra_proposta ?? 'null'},
  ${evento_artista.sobre_artista ? `"${evento_artista.sobre_artista}"` : 'null'},
  ${evento_artista.motivo_inscricao ? `"${evento_artista.motivo_inscricao}"` : 'null'}
)
`
        let result = await knexDatabase.raw(sql)

        if(result)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}


const setUpdateArtistEvent = async function(evento_artista){
    try {
   let sql = `
UPDATE tb_evento_artista SET
  artista_id = ${evento_artista.artista_id},
  evento_id = ${evento_artista.evento_id},
  cache_esperado = ${evento_artista.cache_esperado},
  cache_ofertado = ${evento_artista.cache_ofertado},
  cache_final = ${evento_artista.cache_final},
  contra_proposta = ${evento_artista.contra_proposta ?? 'null'},
  sobre_artista = ${evento_artista.sobre_artista ? `"${evento_artista.sobre_artista}"` : 'null'},
  motivo_inscricao = ${evento_artista.motivo_inscricao ? `"${evento_artista.motivo_inscricao}"` : 'null'}
WHERE id_evento_artista = ${evento_artista.id_evento_artista};
`

        let result = await knexDatabase.raw(sql)

        if(result)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}

const setDeleteArtistEvent = async function(id){
    try {
      
        let sql = `delete from tb_evento_artista where id_evento_artista=${id}`
        
       
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
    getSelectAllArtistEvent,
    getSelectByIdArtistEvent,
    setInsertArtistEvent,
    setUpdateArtistEvent,
    setDeleteArtistEvent,
    getSelectLastID
} 