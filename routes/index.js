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
    .then((res) => {
      console.log('res', res)
      return res.json(res.data)
    })
    .catch(console.error)
})

module.exports = router
