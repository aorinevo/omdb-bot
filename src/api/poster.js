'use strict'

const Wreck = require('@hapi/wreck')
const Joi = require('@hapi/joi')
const { movieCall } = require('./movie')

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
      path: '/api/poster/{title?}',
      config: {
        validate: {
          params: {
            // id: Joi.string().min(9).max(10).required()
            title: Joi.string().required()
          }
        }
      },
      handler: async (request, h) => {
        let findPoster
        let findMovie
        try {
          findMovie = await movieCall(process.env.API_KEY, request.params.title)
          const json = JSON.parse(Buffer.from(findMovie).toString())
          findPoster = await posterCall(process.env.API_KEY, json.imdbID)
        } catch (err) {
          console.error(err)
        }
        return h.response(findPoster).type('image/jpeg')
      }
    })
  }
}

module.exports = plugin
