const router = require('express').Router()
const axios = require('axios')

const isNullOrUndefined = (value) => {
  return value === null || value === undefined
}

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
})

module.exports = router
