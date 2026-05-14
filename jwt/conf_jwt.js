// src/auth/jwt.js

const jwt = require('jsonwebtoken')

const SECRET = process.env.JWT_SECRET

function criarToken(userId, role) {
  return jwt.sign(
    {
      sub: userId,
      role
    },
    SECRET,
    {
      expiresIn: '2h'
    }
  )
}

function validarToken(token) {
  return jwt.verify(token, SECRET)
}

function authMiddleware(req, res, next) {
  const bearer = req.headers.authorization

  if (!bearer) {
    return res.status(401).json({
      error: 'Token ausente'
    })
  }

  const token = bearer.replace('Bearer ', '')

  try {
    const payload = validarToken(token)

    req.auth = payload

    next()
  } catch {
    return res.status(401).json({
      error: 'Token inválido'
    })
  }
}

module.exports = {
  criarToken,
  authMiddleware
}