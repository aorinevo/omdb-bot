"use strict";

const Wreck = require("@hapi/wreck");
const Joi = require("@hapi/joi");

let posterCall = async (api, id) => {
  const { req, res, payload } = await Wreck.get(
    `http://img.omdbapi.com/?apikey=${api}&i=${id}`
  );
  return payload;
};

const plugin = {
  name: "poster",
  version: "0.1.0",
  register: (server, options) => {
    server.route({
      method: ["GET", "PUT", "POST"],
      path: "/api/poster/{id?}",
      config: {
        validate: {
          params: {
            id: Joi.string().required()
          }
        }
      },
      handler: async (request, h) => {
        let findPoster;
        let paramId = request.params.id;
        try {
          const { req, res, payload } = await Wreck.get(
            `http://www.omdbapi.com/?apikey=${
              process.env.API_KEY
            }&t=${request.params.id.toString()}`
          );

          if (payload) {
            paramId = JSON.parse(payload.toString())["imdbID"];
          }

          findPoster = await posterCall(process.env.API_KEY, paramId);
        } catch (err) {
          console.error(err);
        }
        return h.response(findPoster).type("image/jpeg");
      }
    });
  }
};

module.exports = plugin;
