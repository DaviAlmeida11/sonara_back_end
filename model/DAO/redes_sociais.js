/******************************************************************************
 * Objetivo: Arquivo responsável pela conexãode cassa de show com cantores
 * Data: 29/04/2026
 * Autor: Davi de Alemida Santos
 * Versão: 1.0
*****************************************************************************/

const knex = require('knex');
const knexConfig = require('../database_conf/knex');

const knexDatabase = knex(knexConfig.development);



const getSelectAllRedesSociais = async function(){
    try {
      
        let sql = `select * from tb_redes_sociais order by id_redes_sociais desc`
    
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
const getSelectByIdRedesSociais = async function(id){
    try {
    
        let sql = `select * from tb_redes_sociais where id_redes_sociais=${id}`
        
       
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
        
        let sql = `select id_redes_sociais from tb_redes_sociais order by id_redes_sociais desc limit 1`

       
        let result = await knexDatabase.raw(sql)
 
        if(Array.isArray(result))
            return Number(result[0][0].id_redes_sociais)
        else
            return false

    } catch (error) {

        return false
    }
}


const setInserRedesSociais = async function(redes_sociais){
    try {
       let sql = `insert into tb_redes_sociais 
            (link, tipo_id, usuario_id)
           values
            ("${redes_sociais.link}", ${redes_sociais.tipo_id}, ${redes_sociais.usuario_id})`

               
        let result = await knexDatabase.raw(sql)

        if(result)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}


const setUpdateRedesSociais = async function(redes_sociais){
    try {
      let sql = `update tb_redes_sociais set
                link       = "${redes_sociais.link}",
                tipo_id    = ${redes_sociais.tipo_id},
                usuario_id = ${redes_sociais.usuario_id}
           where id_redes_sociais = ${redes_sociais.id_redes_sociais}`

        let result = await knexDatabase.raw(sql)

        if(result)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}

const setDeleteRedesSociais = async function(id){
    try {
      
        let sql = `delete from tb_redes_sociais where id_redes_sociais=${id}`
        

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
    getSelectAllRedesSociais,
    getSelectByIdRedesSociais,
    setInserRedesSociais,
    setUpdateRedesSociais,
    getSelectLastID,
    setDeleteRedesSociais
} 