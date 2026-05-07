/***************************************
 * Objeto: Arquivo responsável pelo hash
 * das senhas dos usuários
 * Data: 27/04/2026
 * Autor: Gabriel Cavalcante dos Santos
 * Versão: 1.1
 ****************************************/

const crypto = require('crypto');

// Configurações do hash
const ITERATIONS = 100000;
const KEY_LENGTH = 64;
const DIGEST = 'sha512';

/**
 * Gera o hash da senha
 * @param {string} password
 * @returns {string}
 */
function hashPassword(password) {

    // Gera um salt aleatório
    const salt = crypto.randomBytes(16).toString('hex');

    // Cria o hash da senha
    const hash = crypto
        .pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST)
        .toString('hex');

    // Retorna no formato: salt:hash
    return `${salt}:${hash}`;
}

/**
 * Verifica se a senha informada é válida
 * @param {string} password
 * @param {string} storedHash
 * @returns {boolean}
 */
function verifyPassword(password, storedHash) {

    // Separa o salt do hash salvo
    const [salt, originalHash] = storedHash.split(':');

    // Gera um novo hash com a senha informada
    const hashVerify = crypto
        .pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST)
        .toString('hex');

    // Comparação segura contra timing attack
    return crypto.timingSafeEqual(
        Buffer.from(originalHash, 'hex'),
        Buffer.from(hashVerify, 'hex')
    );
}

module.exports = {
    hashPassword,
    verifyPassword
};