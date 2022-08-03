const router = require('express').Router()
const axios = require('axios')

const isNullOrUndefined = (value) => {
  return value === null || value === undefined
}

router.get('/:tokenId', (req, res, next) => {
  const { tokenId } = req.params;
  axios.get(`https://gas-price-api.1inch.io/v1.2/${tokenId}`)
    .then((result) => {
      return res.json(result.data)
    })
})
module.exports = router
