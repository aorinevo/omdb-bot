const Wreck = require('@hapi/wreck')

exports.movieCall = async (key, title) => {
  const { payload } = await Wreck.get(`http://www.omdbapi.com/?apikey=${key}&t=${title}`)
  return payload
}

exports.posterCall = async (api, id) => {
  const { payload } = await Wreck.get(`http://img.omdbapi.com/?apikey=${api}&i=${id}`)
  return payload
}
