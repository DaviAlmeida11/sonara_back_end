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
      
        let sql = `select * from tb_endereco_evento order by id_endereco_evento desc`
    
        let result = await knexDatabase.raw(sql)

        if(Array.isArray(result[0]))
            return result[0]
        else
            return false

    } catch (error) {
       
        return false
    }
}
const getSelectByIdAddressEventEvent = async (id) => {

    let sql = `SELECT * FROM tb_endereco_evento WHERE evento_id = ?`

    let result = await knexDatabase.raw(sql, [id])

    const rows = result?.[0]

    if (Array.isArray(rows) && rows.length > 0) {
        return rows[0]   
    }

    return {}
}

//Retorna um filme filtrando pelo ID do banco de dados
const getSelectByIdAddressEvent = async (id) => {

    let sql =  `select * from tb_endereco_evento where id_endereco_evento=${id}`

    let result = await knexDatabase.raw(sql, [id])

    const rows = result?.[0]

    if (Array.isArray(rows) && rows.length > 0) {
        return rows[0]   
    }

    return {}
}


const getSelectLastID = async function(){
    try {
        
        let sql = `select id_endereco_evento from tb_endereco_evento order by id_endereco_evento desc limit 1`

       
        let result = await knexDatabase.raw(sql)
 
        if(Array.isArray(result))
            return Number(result[0][0].id_endereco_evento)
        else
            return false

    } catch (error) {

        return false
    }
}


const setInsertAddressEvent = async function(enderco_evento){
    try {
  let sql = `insert into tb_endereco_evento (
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
        console.log(error)
    }
}



const setUpdateAddressEvent = async function(enderco_evento){
    try {
      let sql = `update tb_endereco_evento set 
    cep = "${enderco_evento.cep}",
    cidade = "${enderco_evento.cidade}",
    estado = "${enderco_evento.estado}",
    logradouro = "${enderco_evento.logradouro}",
    numero = ${enderco_evento.numero},
    complemento = "${enderco_evento.complemento}",
    bairro      =  "${enderco_evento.bairro}",
    evento_id     = ${enderco_evento.evento_id}
where id_endereco_evento = ${enderco_evento.id_endereco_evento}`

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
      
        let sql = `delete from tb_endereco_evento where id_endereco_evento=${id}`
  
       
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
    setDeleteAddressEvent,
    getSelectByIdAddressEventEvent
} 