const router = require('express').Router()
const axios = require('axios')

const isNullOrUndefined = (value) => {
  return value === null || value === undefined
}

router.get('/:tokenId', (req, res, next) => {
  axios.get(`https://token-prices.1inch.io/v1.1/${req.params.tokenid}`)
    .then((result) => {
      return res.json(result.data)
    })
    .catch(console.error)
})

router.get('/distribution/v2/:address', (req, res, next) => {
  axios.get(`https://governance.1inch.io/v1.1/distribution/v2/${req.params.address}`)
    .then((result) => {
      return res.json(result.data)
    })
    .catch(console.error)
})

router.get('/distribution/:address', (req, res, next) => {
  axios.get(`https://governance.1inch.io/v1.1/distribution/${req.params.address}`)
    .then((result) => {
      return res.json(result.data)
    })
    .catch(console.error)
})

router.get('/:tokenId/limit-order/address/:address', (req, res, next) => {
  const { tokenId, address } = req.params;
  const { page, limit, statuses, sortBy } = req.params;
  const url = `https://limit-orders.1inch.io/v1.0/${tokenId}/limit-order/address/${address}?page=${page}&limit=${limit}&statuses=${statuses}&sortBy=${sortBy}`
  console.log('url', url)
  axios.get(url)
    .then((result) => {
      return res.json(result.data)
    })
    .catch(console.error)
})

router.get('/:tokenId/limit-order/address/:address', (req, res, next) => {
  const { tokenId, address } = req.params;
  const { page, limit, statuses, sortBy } = req.params;
  const url = `https://limit-orders.1inch.io/v2.0/${tokenId}/limit-order/address/${address}?page=${page}&limit=${limit}&statuses=${statuses}&sortBy=${sortBy}`
  console.log('url', url)
  axios.get(url)
    .then((result) => {
      return res.json(result.data)
    })
    .catch(console.error)
})

router.get('/:tokenId/allowancesAndBalances/:contract/:address', (req, res, next) => {
  const { tokenId, contract, address, tokensFetchType } = req.params;
  const url = `https://balances.1inch.io/v1.1/${tokenId}/allowancesAndBalances/${contract}/${address}?tokensFetchType=${tokensFetchType}`
  console.log('url', url)
  axios.get(url)
    .then((result) => {
      return res.json(result.data)
    })
    .catch(console.error)
})

module.exports = router
