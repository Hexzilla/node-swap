const axios = require('axios')

const config = {
  headers: {
    Accept: 'application/json',
    'X-API-KEY': process.env.OPENSEA_API_KEY,
  },
}

const getUserAssets = async (walletAddress) => {
  const openseaApi = process.env.OPENSEA_API
  return axios
    .get(
      `${openseaApi}/api/v1/collections?asset_owner=${walletAddress}&offset=0&limit=300`,
      config
    )
    .then((res) => {
      return res.data
    })
    .catch(console.error)
}

const getAssets = async (owner, contract_address) => {
  const openseaApi = process.env.OPENSEA_API
  return axios
    .get(
      `${openseaApi}/api/v1/assets?owner=${owner}&asset_contract_address=${contract_address}`,
      config
    )
    .then((res) => {
      //console.log('opensea', res.data.assets)
      return res.data.assets
    })
    .catch(e => {
      console.error('http.axio.error');
      return 'error';
    })
}

const notification = async (message) => {
  const payload = { content: message };
  const url = 'https://discord.com/api/webhooks/989449892890030090/MFwCcQoMy6psuriEEo0GXSf9ACJzrKcMnLP3xuXCk1zXLloXorPfpXAlEkr7_oMtxR8S'
  return axios
    .post(url, payload)
    .then(() => true)
    .catch(e => {
      console.error(e)
      return false;
    })
}

module.exports = {
  getUserAssets,
  getAssets,
  notification,
}
