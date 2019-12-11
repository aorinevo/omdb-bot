'use strict'

const Wreck = require('@hapi/wreck')
const Joi = require('@hapi/joi')

let movieCall = async (key, title) => {
  const { req, res, payload } = await Wreck.get(`http://www.omdbapi.com/?apikey=${key}&t=${title}`)
  return payload
}

let posterCall = async (api, id) => {
  const { req, res, payload } = await Wreck.get(`http://img.omdbapi.com/?apikey=${api}&i=${id}`)
  return payload
}

const plugin = {
  name: 'poster',
  version: '0.1.0',
  register: (server, options) => {
    server.route({
      method: ['GET', 'PUT', 'POST'],
      path: '/api/poster/{id?}',
      config: {
        validate: {
          params: {
            id: Joi.string().max(50).required()
          }
        }
      },
      handler: async (request, h) => {
        let findMovie, findPoster
        try {
          findMovie = await movieCall(process.env.API_KEY, request.params.id)
		  const data = JSON.parse(findMovie.toString())
          findPoster = await posterCall(process.env.API_KEY, data["imdbID"])
          console.log(findPoster)
        } catch (err) {
          console.error(err)
        }
        return h.response(findPoster).type('image/jpeg')
      }
    })
  }
}

module.exports = plugin
