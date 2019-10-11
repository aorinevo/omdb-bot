'use strict'

const Wreck = require('@hapi/wreck')
const Joi = require('@hapi/joi')

let posterCall = async (api, id) => {
  const { req, res, payload } = await Wreck.get(`http://img.omdbapi.com/?apikey=${api}&i=${id}`)
  return payload
}

let movieCall = async (key, title) => {
  const { req, res, payload } = await Wreck.get(`http://www.omdbapi.com/?apikey=${key}&t=${title}`)
  console.log(`http://www.omdbapi.com/?apikey=${key}&t=${title}`)
  return payload.toString()
}

const plugin = {
  name: 'poster',
  version: '0.1.0',
  register: (server, options) => {
    server.route({
      method: ['GET', 'PUT', 'POST'],
      path: '/api/poster/{title?}',
      config: {
        validate: {
          params: {
            title: Joi.string().required()
          }
        }
      },
      handler: async (request, h) => {
        let findPoster
        let findMovie
        try {
          findMovie = await movieCall(process.env.API_KEY, request.params.title)
          let answer=JSON.parse(findMovie)
          console.log(answer.imdbID)
          findPoster = await posterCall(process.env.API_KEY, answer.imdbID)
        } catch (err) {
          console.error(err)
        }
        return h.response(findPoster).type('image/jpeg')
      }
    })
  }
}

module.exports = plugin
