/******************************************************************************
 * Objetivo: Arquivo responsável pela conexãode cassa de show com cantores
 * Data: 25/04/2026
 * Autor: Davi de Alemida Santos
 * Versão: 1.0
*****************************************************************************/

const knex = require('knex');
const knexConfig = require('../database_conf/knex');

const knexDatabase = knex(knexConfig.development);



const getSelectAllAddressEvent = async function(){
    try {
      
        let sql = `select * from tb_enderco_evento order by id_enderco_evento desc`
    
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
const getSelectByIdAddressEvent = async function(id){
    try {
    
        let sql = `select * from tb_enderco_evento where id_enderco_evento=${id}`
        
       
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
        
        let sql = `select id_enderco_evento from tb_enderco_evento order by id_enderco_evento desc limit 1`

       
        let result = await knexDatabase.raw(sql)
 
        if(Array.isArray(result))
            return Number(result[0][0].id_enderco_evento)
        else
            return false

    } catch (error) {

        return false
    }
}


const setInsertAddressEvent = async function(enderco_evento){
    try {
  let sql = `insert into tb_enderco_evento (
    cep,
    cidade,
    estado,
    logradouro,
    numero,
    complemento,
    bairro,
    evento_id
) values (
    "${enderco_evento.cep}",
    "${enderco_evento.cidade}",
    "${enderco_evento.estado}",
    "${enderco_evento.logradouro}",
    ${enderco_evento.numero},
    "${enderco_evento.complemento}",
    "${enderco_evento.bairro}",
    ${enderco_evento.evento_id}
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



const setUpdateAddressEvent = async function(enderco_evento){
    try {
      let sql = `update tb_enderco_evento set 
    cep = "${enderco_evento.cep}",
    cidade = "${enderco_evento.cidade}",
    estado = "${enderco_evento.estado}",
    logradouro = "${enderco_evento.logradouro}",
    numero = ${enderco_evento.numero},
    complemento = "${enderco_evento.complemento}",
    bairro      =  "${enderco_evento.bairro}"
    evento_id     = ${enderco_evento.evento_id}
where id_enderco_evento = ${enderco_evento.id_enderco_evento}`

        let result = await knexDatabase.raw(sql)

        if(result)
            return true
        else
            return false

    } catch (error) {
        console.log(error)
    }
}

const setDeleteAddressEvent = async function(id){
    try {
      
        let sql = `delete from tb_enderco_evento where id_enderco_evento=${id}`
  
       
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
    getSelectAllAddressEvent,
    getSelectByIdAddressEvent,
    setInsertAddressEvent,
    setUpdateAddressEvent,
    getSelectLastID,
    setDeleteAddressEvent
} 