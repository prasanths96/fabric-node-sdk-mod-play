# fabric-node-sdk-mod-play
Fabric-samples, but used for playing with modified node-sdk

## Modifications include:
- Pluggable signing / outside signing. (With this, external wallets can be plugged in. Keys wont leave wallet, backend server / hyperledger client won't have the keys & wallet(online/cloud) will open up remote signing like functionality - similar to KMS, which will be used by hyperledger client)
- Local signing - separated out transaction generation part and transaction submission part. This will allow web/mobile apps to be able to sign the transaction locally, before submitting to the server + this way, it doesn't need to know about blockchain node addresses.
