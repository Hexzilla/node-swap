const router = require('express').Router()
const axios = require('axios')

const isNullOrUndefined = (value) => {
  return value === null || value === undefined
}

router.get('/history/:tokenId/:address', (req, res, next) => {
  const { tokenId, address } = req.params;
  const { not_send_call_data, limit } = req.query;
  const url = `https://history.1inch.io/v1.0/history/${tokenId}/${address}?not_send_call_data=${not_send_call_data}&limit=${limit}`
  axios.get(url)
    .then((result) => {
      return res.json(result.data)
    })
    .catch(console.error)
})

router.get('/:tokenId/limit-order/address/:address', (req, res, next) => {
  const { tokenId, address } = req.params;
  const { page, limit, statuses, sortBy } = req.query;
  const url = `https://limit-orders.1inch.io/v1.0/${tokenId}/limit-order/address/${address}?page=${page}&limit=${limit}&statuses=${statuses}&sortBy=${sortBy}`
  axios.get(url)
    .then((result) => {
      return res.json(result.data)
    })
    .catch(console.error)
})

router.get('/:tokenId/limit-order/address/:address', (req, res, next) => {
  const { tokenId, address } = req.params;
  const { page, limit, statuses, sortBy } = req.query;
  const url = `https://limit-orders.1inch.io/v2.0/${tokenId}/limit-order/address/${address}?page=${page}&limit=${limit}&statuses=${statuses}&sortBy=${sortBy}`
  axios.get(url)
    .then((result) => {
      return res.json(result.data)
    })
    .catch(console.error)
})

router.post('/:tokenId/allowancesAndBalances/:contract/:address', (req, res, next) => {
  const { tokenId, contract, address } = req.params;
  const { tokensFetchType } = req.query;
  const url = `https://balances.1inch.io/v1.1/${tokenId}/allowancesAndBalances/${contract}/${address}?tokensFetchType=${tokensFetchType}`
  axios.post(url, req.body)
    .then((result) => {
      return res.json(result.data)
    })
    .catch(console.error)
})

router.get('/:tokenId/allowancesAndBalances/:contract/:address', (req, res, next) => {
  const { tokenId, contract, address } = req.params;
  const { tokensFetchType } = req.query;
  const url = `https://balances.1inch.io/v1.1/${tokenId}/allowancesAndBalances/${contract}/${address}?tokensFetchType=${tokensFetchType}`
  axios.get(url)
    .then((result) => {
      return res.json(result.data)
    })
    .catch(console.error)
})

router.get('/:tokenId', (req, res, next) => {
  const { tokenId } = req.params;
  axios.get(`https://token-prices.1inch.io/v1.1/${tokenId}`)
    .then((result) => {
      return res.json(result.data)
    })
    .catch(console.error)
})

module.exports = router
