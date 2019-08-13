'use strict'

const Wreck = require('@hapi/wreck')
const Joi = require('@hapi/joi')

const movieCall = require('./movieCall');

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
            title: Joi.string().required()
          }
        }
      },
      handler: async (request, h) => {

        let findMovie
        try {
          const findMovieBuffer = await movieCall(process.env.API_KEY, request.params.title)
          findMovie = JSON.parse(findMovieBuffer.toString());
        } catch (err) {
          console.error('FIRST', err)
        }

        console.log('findMovie ***', findMovie)

        let findPoster
        try {
          findPoster = await posterCall(process.env.API_KEY, findMovie.imdbID)
        } catch (err) {
          console.error('SECOND', err)
        }

        return h.response(findPoster).type('image/jpeg')
      }
    })
  }
}

module.exports = plugin
