'use strict'

const Wreck = require('@hapi/wreck')
const Joi = require('@hapi/joi')

let posterCall = async (api, id) => {
  const { req, res, payload } = await Wreck.get(`http://img.omdbapi.com/?apikey=${api}&i=${id}`)
  return payload
}

let movieCall = async (key, title) => {
  const { req, res, payload } = await Wreck.get(`http://www.omdbapi.com/?apikey=${key}&t=${title}`)
  return payload
}

const plugin = {
  name: 'poster',
  version: '0.1.0',
  register: (server, options) => {
    server.route({
      method: 'GET',
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
        let imdbID;
        let findPoster;

        try {
          console.log('call find movie')
          findMovie = await movieCall(process.env.API_KEY, request.params.title)
          const stringified = findMovie.toString()
          console.log(stringified)

          const jsonified = JSON.parse(stringified)

          console.log(jsonified)

          imdbID = jsonified.imdbID;

          console.log('imdbId', imdbID)
          findPoster = await posterCall(process.env.API_KEY, imdbID)
          console.log('findPoster res', findPoster)
        } catch (err) {
          console.error(err)
          return h.response(err);
        }
        return h.response(findPoster).type('image/jpeg')
      }
    })
  }
}

module.exports = plugin
