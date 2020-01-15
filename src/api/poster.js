'use strict'

const Joi = require('@hapi/joi')

const { movieCall, posterCall } = require('../services/omdb')

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
        try {
          let movieData = await movieCall(process.env.API_KEY, request.params.title)
          let raw = Buffer.from(movieData).toString('utf8')
          let parsed = JSON.parse(raw)
          findPoster = await posterCall(process.env.API_KEY, parsed.imdbID)
        } catch (err) {
          console.error(err)
        }
        return h.response(findPoster).type('image/jpeg')
      }
    })
  }
}

module.exports = plugin
