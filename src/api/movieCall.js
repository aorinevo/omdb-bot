'use strict'

const Wreck = require('@hapi/wreck')

let movieCall = async (key, title) => {
  const { req, res, payload } = await Wreck.get(`http://www.omdbapi.com/?apikey=${key}&t=${title}`)
  return payload
}

module.exports = movieCall
