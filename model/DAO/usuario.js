/******************************************************************************
 * Objetivo: DAO de usuário - CORRIGIDO
 * Data: 25/04/2026
 * Autor: Davi de Almeida Santos
 * Versão: 1.1
 *
 * CORREÇÕES:
 *  - setInsertUsers: removida vírgula sobrando antes do ')' no SQL
 *  - setInsertUsers: substituído SQL manual por knex query builder (sem SQL injection)
 *  - getSelectByIdUsers: corrigido retorno de result[0] em vez de result
 *****************************************************************************/

const knex = require('knex')
const knexConfig = require('../database_conf/knex')

const knexDatabase = knex(knexConfig.development)


const getSelectAllUsers = async function () {
    try {
        let sql = `select * from vw_usuario`
        let result = await knexDatabase.raw(sql)

        if (Array.isArray(result[0]))
            return result[0]
        else
            return false

    } catch (error) {
        return false
    }
}


// CORREÇÃO: retorna result[0] (array de linhas), não result inteiro
const getSelectByIdUsers = async function (id) {
    try {
        let result = await knexDatabase('tb_usuario')
            .where({ id_usuario: id })

        if (Array.isArray(result))
            return result   // retorna array; se vazio, controller detecta .length === 0
        else
            return false

    } catch (error) {
        return false
    }
}


const getSelectByIdUsersOrganizer = async function (id) {
    try {
        let result = await knexDatabase('tb_organizador')
            .where({ usuario_id: id })

        if (Array.isArray(result))
            return result
        else
            return false

    } catch (error) {
        return false
    }
}


const getSelectLastID = async function () {
    try {
        let result = await knexDatabase('tb_usuario')
            .max('id_usuario as id_usuario')
            .first()

        return result
    } catch (error) {
        console.log(error)
        return false
    }
}


// Recebe a string de email diretamente
const getUsuarioByUsuarioEmail = async function (email) {
    try {
        let result = await knexDatabase('vw_usuario_com_senha')
            .where({ email })
            .first()   // .first() retorna objeto ou undefined — sem SQL injection

        return result || false

    } catch (error) {
        console.log(error)
        return false
    }
}


const getUsuarioByUsuarioCPF = async function (cpf) {
    try {
        let result = await knexDatabase('vw_usuario')
            .where({ cpf })
            .first()

        return result || false

    } catch (error) {
        return false
    }
}


// CORREÇÃO: removida a vírgula sobrando antes do ')' e uso de knex insert para evitar SQL injection
const setInsertUsers = async function (usuario) {
    try {
        await knexDatabase('tb_usuario').insert({
            nome:              usuario.nome,
            email:             usuario.email,
            senha:             usuario.senha,
            cpf:               usuario.cpf,
            data_nasc:         usuario.data_nasc,
            nacionalidade_id:  usuario.nacionalidade_id,
            genero_id:         usuario.genero_id,
            telefone:          usuario.telefone || null,
            foto:              usuario.foto     || null,
        })

        return true

    } catch (error) {
        console.log(error)
        return false
    }
}


const setUpdateUsers = async function (usuario) {
    try {
        let result = await knexDatabase('tb_usuario')
            .where({ id_usuario: usuario.id_usuario })
            .update({
                nome:             usuario.nome,
                email:            usuario.email,
                senha:            usuario.senha,
                telefone:         usuario.telefone   || null,
                cpf:              usuario.cpf,
                data_nasc:        usuario.data_nasc,
                nacionalidade_id: usuario.nacionalidade_id,
                genero_id:        usuario.genero_id,
                foto:             usuario.foto       || null,
            })

        return result > 0   // knex update retorna nº de linhas afetadas

    } catch (error) {
        return false
    }
}


const setDeleteUsers = async function (id) {
    try {
        let result = await knexDatabase('tb_usuario')
            .where({ id_usuario: id })
            .del()

        return result > 0

    } catch (error) {
        return false
    }
}


module.exports = {
    getSelectAllUsers,
    getSelectByIdUsers,
    setInsertUsers,
    setUpdateUsers,
    getSelectLastID,
    setDeleteUsers,
    getSelectByIdUsersOrganizer,
    getUsuarioByUsuarioEmail,
    getUsuarioByUsuarioCPF,
}