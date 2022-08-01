const router = require('express').Router()
const axios = require('axios')

const isNullOrUndefined = (value) => {
  return value === null || value === undefined
}

router.get('/', (req, res, next) => {
  res.send('node')
})

router.post('/', async (req, res, next) => {
  axios.post('https://nodes.pancakeswap.com', req.body)
    .then((result) => {
      console.log('result', result)
      return res.json(result.data)
    })
    .catch(console.error)
})

module.exports = router
