const isNullOrUndefined = (value) => {
  return value === null || value === undefined;
};

const isGarbageContract = (contract) => {
  const contract_address = contract.toUpperCase();
  if (contract_address === '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85'.toUpperCase()) { //EthereumNameService
    return true;
  }
  if (contract_address === '0x76BE3b62873462d2142405439777e971754E8E77'.toUpperCase()) {
    return true;
  }
  if (contract_address === '0xc36cF0cFcb5d905B8B513860dB0CFE63F6Cf9F5c'.toUpperCase()) {
    return true;
  }
  return false;
}

module.exports = {
  isNullOrUndefined,
  isGarbageContract,
}