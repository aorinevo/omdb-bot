'use strict'

const Wreck = require('@hapi/wreck')
const Joi = require('@hapi/joi')
const { movieCall } = require('./movie');

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
        let findPoster
        try {
          const { title } = request.params;
          const movieResponseBuffer = await movieCall(process.env.API_KEY, title);
          let responseBody;

          try {
            responseBody = JSON.parse(movieResponseBuffer.toString());
          } catch (err) {
            return h.response({ message: "Try later" }); // TODO: set 522
          }

          if (responseBody.Response === "False") {
            return h.response({ message: "Not Found" }); // TODO: set 404
          }

          // fetch data
          // check response
          // posterCall(response.imageId)
          findPoster = await posterCall(process.env.API_KEY, responseBody.imdbID);
        } catch (err) {
          console.error(err)
        }
        return h.response(findPoster).type('image/jpeg')
      }
    })
  }
}

module.exports = plugin
