const router = require('express').Router()
const axios = require('axios')
const inch = require('./inch');
const gas = require('./inch/gas');

const isNullOrUndefined = (value) => {
  return value === null || value === undefined
}

router.get('/v1.1/distribution/v2/:address', (req, res, next) => {
  const { address } = req.params;
  axios.get(`https://governance.1inch.io/v1.1/distribution/v2/${address}`)
    .then((result) => {
      return res.json(result.data)
    })
    .catch(console.error)
})

router.get('/v1.1/distribution/:address', (req, res, next) => {
  const { address } = req.params;
  axios.get(`https://governance.1inch.io/v1.1/distribution/${address}`)
    .then((result) => {
      return res.json(result.data)
    })
    .catch(console.error)
})

router.use('/v1.0', inch)
router.use('/v1.1', inch)
router.use('/v1.2', gas)
router.use('/v2.0', inch)

router.post('/', async (req, res, next) => {
  axios.post('https://nodes.pancakeswap.com', req.body)
    .then((result) => {
      console.log('result', result)
      return res.json(result.data)
    })
    .catch(console.error)
})

module.exports = router
