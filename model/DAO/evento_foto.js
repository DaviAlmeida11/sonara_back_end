/******************************************************************************
 * Objetivo: Arquivo responsável pela conexãode cassa de show com cantores
 * Data: 11/05/2026
 * Autor: Davi de Alemida Santos
 * Versão: 1.0
*****************************************************************************/

const knex = require('knex');
const knexConfig = require('../database_conf/knex');

const knexDatabase = knex(knexConfig.development);



const getSelectAllPhotoEvent = async function(){
    try {
      
        let sql = `select * from tb_evento_foto order by id_evento_foto desc `

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
const getSelectByIdPhotoEvent= async function(id){
    try {
    
        let sql = `select * from tb_evento_foto where id_evento_foto=${id}`
        
       
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
        
        let sql = `select id_evento_foto from tb_evento_foto order by id_evento_foto desc limit 1`

      
        let result = await knexDatabase.raw(sql)
 
        if(Array.isArray(result))
            return Number(result[0][0].id_evento_foto)
        else
            return false

    } catch (error) {

        return false
    }
}


const setInsertPhotoEvent = async function(evento_foto){
    try {
let sql = `
INSERT INTO tb_evento_foto (
  foto_id,
  evento_id,
  data_hora
) VALUES (
  ${evento_foto.foto_id},
  ${evento_foto.evento_id},
  ${evento_foto.data_hora ? `'${evento_foto.data_hora}'` : null}
)`;


        let result = await knexDatabase.raw(sql)

        if(result)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}


const setUpdatePhotoEvent = async function(evento_foto){
    try {
let sql = `
UPDATE tb_evento_foto SET
  foto_id = ${evento_foto.foto_id},
  evento_id = ${evento_foto.evento_id},
  data_hora = ${evento_foto.data_hora ? `'${evento_foto.data_hora}'` : null}
WHERE id_evento_foto = ${evento_foto.id_evento_foto};
`;

//precisa colocar data_hora na tabela do banco

        let result = await knexDatabase.raw(sql)

        if(result)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}


const setDeletePhotoEvent = async function(id){
    try {
      
        let sql = `delete from tb_evento_foto where id_evento_foto=${id}`
        
       
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
    getSelectAllPhotoEvent,
    getSelectByIdPhotoEvent,
    setInsertPhotoEvent,
    setUpdatePhotoEvent,
    setDeletePhotoEvent,
    getSelectLastID
} 