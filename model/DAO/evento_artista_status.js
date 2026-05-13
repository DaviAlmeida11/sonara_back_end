/******************************************************************************
 * Objetivo: Arquivo responsável pela conexãode cassa de show com cantores
 * Data: 25/04/2026
 * Autor: Davi de Alemida Santos
 * Versão: 1.0
*****************************************************************************/

const knex = require('knex');
const knexConfig = require('../database_conf/knex');

const knexDatabase = knex(knexConfig.development);



const getSelectAllArtistEventStatus = async function(){
    try {
      
        let sql = `select * from tb_evento_artista_status order by id_evento_artista_status desc `

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
const getSelectByIdArtistEventStatus = async function(id){
    try {
    
        let sql = `select * from tb_evento_artista_status where id_evento_artista_status=${id}`
        
       
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
        
        let sql = `select id_evento_artista_status from tb_evento_artista_status order by id_evento_artista_status desc limit 1`

      
        let result = await knexDatabase.raw(sql)
 
        if(Array.isArray(result))
            return Number(result[0][0].id_evento_artista_status)
        else
            return false

    } catch (error) {

        return false
    }
}


const setInsertArtistEventStatus  = async function(evento_artista_status){
    try {
 let sql = `
INSERT INTO tb_evento_artista_status (
  evento_artista_id,
  status_id,
  data_hora
) VALUES (
  ${evento_artista_status.evento_artista_id},
  ${evento_artista_status.status_id},
  ${evento_artista_status.data_hora ? `'${evento_foto.data_hora}'` : null}
)`

 

        let result = await knexDatabase.raw(sql)

        if(result)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}


const setUpdateArtistEventStatus = async function(evento_artista_status){
    try {
    let sql = `
UPDATE tb_evento_artista_status SET
  evento_artista_id = ${evento_artista_status.evento_artista_id},
  status_id = ${evento_artista_status.status_id},
data_hora = ${evento_artista_status.data_hora ? `'${evento_artista_status.data_hora}'` : null}
WHERE id_evento_artista_status = ${evento_artista_status.id_evento_artista_status};
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

const setDeleteArtistEventStatus = async function(id){
    try {
      
        let sql = `delete from tb_evento_artista_status where id_evento_artista_status=${id}`
        
       
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
    getSelectAllArtistEventStatus,
    getSelectByIdArtistEventStatus,
    setInsertArtistEventStatus,
    setUpdateArtistEventStatus,
    setDeleteArtistEventStatus,
    getSelectLastID
} 