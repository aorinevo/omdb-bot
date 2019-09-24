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
      method: ['GET', 'PUT', 'POST'],
      path: '/api/poster/{id?}',
      config: {
        validate: {
          params: {
            id: Joi.string().min(1).required()
          }
        }
      },
      handler: async (request, h) => {
        let movieData = ''
        let posterData = ''
        try {
           movieData = await movieCall(process.env.API_KEY, request.params.id)
           let movieInformation = JSON.parse(movieData.toString())

           console.log(JSON.stringify(movieInformation))
           posterData = await posterCall(process.env.API_KEY, movieInformation.imdbID)
        } catch (err) {
          console.error(err)
        }
        return h.response(posterData).type('image/jpeg')
      }
    })
  }
}

module.exports = plugin
