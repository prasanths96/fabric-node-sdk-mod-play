/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
// import { Gateway, GatewayOptions } from 'fabric-network';
import { Gateway, GatewayOptions, X509Identity } from '/home/osboxes/github.com/prasanths96/fabric-sdk-node/fabric-network';
import * as path from 'path';
import { buildCCPOrg1, buildWallet, prettyJSONString } from './utils//AppUtil';
import { buildCAClient, enrollAdmin, registerAndEnrollUser } from './utils/CAUtil';
import { Client, User, Proposal, BuildProposalRequest, IdentityContext, Endorsement, EndorsementResponse } from '/home/osboxes/github.com/prasanths96/fabric-sdk-node/fabric-common'

// import CryptoJS from 'crypto-js';
// import * as elliptic from 'elliptic';
// import { KEYUTIL } from 'jsrsasign';

const crypto = require('crypto');
const elliptic = require('elliptic');
const { KEYUTIL } = require('jsrsasign');
const fabproto6 = require('fabric-protos');

const channelName = 'mychannel';
const chaincodeName = 'basic';
const mspOrg1 = 'Org1MSP';
const walletPath = path.join(__dirname, 'wallet');
const org1UserId = 'appUser1';
var gateway: Gateway;
var gateway2: Gateway;
var gatewayOpts: GatewayOptions;
var wallet: any;
var user: any;
// pre-requisites:
// - fabric-sample two organization test-network setup with two peers, ordering service,
//   and 2 certificate authorities
//         ===> from directory /fabric-samples/test-network
//         ./network.sh up createChannel -ca
// - Use any of the asset-transfer-basic chaincodes deployed on the channel "mychannel"
//   with the chaincode name of "basic". The following deploy command will package,
//   install, approve, and commit the javascript chaincode, all the actions it takes
//   to deploy a chaincode to a channel.
//         ===> from directory /fabric-samples/test-network
//         ./network.sh deployCC -ccn basic -ccp ../asset-transfer-basic/chaincode-typescript/ -ccl javascript
// - Be sure that node.js is installed
//         ===> from directory /fabric-samples/asset-transfer-basic/application-typescript
//         node -v
// - npm installed code dependencies
//         ===> from directory /fabric-samples/asset-transfer-basic/application-typescript
//         npm install
// - to run this test application
//         ===> from directory /fabric-samples/asset-transfer-basic/application-typescript
//         npm start

// NOTE: If you see  kind an error like these:
/*
    2020-08-07T20:23:17.590Z - error: [DiscoveryService]: send[mychannel] - Channel:mychannel received discovery error:access denied
    ******** FAILED to run the application: Error: DiscoveryService: mychannel error: access denied

   OR

   Failed to register user : Error: fabric-ca request register failed with errors [[ { code: 20, message: 'Authentication failure' } ]]
   ******** FAILED to run the application: Error: Identity not found in wallet: appUser
*/
// Delete the /fabric-samples/asset-transfer-basic/application-typescript/wallet directory
// and retry this application.
//
// The certificate authority must have been restarted and the saved certificates for the
// admin and application user are not valid. Deleting the wallet store will force these to be reset
// with the new certificate authority.
//

/**
 *  A test application to show basic queries operations with any of the asset-transfer-basic chaincodes
 *   -- How to submit a transaction
 *   -- How to query and check the results
 *
 * To see the SDK workings, try setting the logging to show on the console before running
 *        export HFC_LOGGING='{"debug":"console"}'
 */
async function main() {
    try {
        // build an in memory object with the network configuration (also known as a connection profile)
        const ccp = buildCCPOrg1();

        // build an instance of the fabric ca services client based on
        // the information in the network configuration
        const caClient = buildCAClient(ccp, 'ca.org1.example.com');

        // setup the wallet to hold the credentials of the application user
        wallet = await buildWallet(walletPath);

        // in a real application this would be done on an administrative flow, and only once
        await enrollAdmin(caClient, wallet, mspOrg1);

        // in a real application this would be done only when a new user was required to be added
        // and would be part of an administrative flow
        await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'org1.department1');

        // Create a new gateway instance for interacting with the fabric network.
        // In a real application this would be done as the backend server session is setup for
        // a user that has been verified.
        gateway = new Gateway();
        gateway2 = new Gateway();

        gatewayOpts = {
            wallet,
            identity: org1UserId,
            discovery: { enabled: true, asLocalhost: true }, // using asLocalhost as this gateway is using a fabric network deployed locally
        };
        

        try {
            // setup the gateway instance
            // The user will now be able to create connections to the fabric network and be able to
            // submit transactions and query. All transactions submitted by this gateway will be
            // signed by this user using the credentials stored in the wallet.



            

            
            await gateway.connect(ccp, gatewayOpts);



            const identity = gateway.getIdentity()
            // @ts-ignore
            const cert = identity.credentials.certificate.toString();

            gateway.disconnect();
            // console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
            // console.log("Credentials: ", identity)
            // console.log("certificate: ", identity.credentials.certificate.toString())
            // console.log("Privatekey: ", identity.credentials.privateKey.toString())
            // console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
            // const provider = wallet!.getProviderRegistry().getProvider(identity.type);
            // user = await provider.getUserContext(identity, gatewayOpts.identity);

            // Build a network instance based on the channel where the smart contract is deployed
            // const network = await gateway.getNetwork(channelName);

            // Get the contract from the network.
            // const contract = network.getContract(chaincodeName);

            // Initialize a set of asset data on the channel using the chaincode 'InitLedger' function.
            // This type of transaction would only be run once by an application the first time it was started after it
            // deployed the first time. Any updates to the chaincode deployed later would likely not need to run
            // an "init" type function.
            // console.log('\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger');
            // await contract.submitTransaction('InitLedger');
            // console.log('*** Result: committed');

            // Let's try a query type operation (function).
            // This will be sent to just one peer and the results will be shown.
            // console.log('\n--> Evaluate Transaction: GetAllAssets, function returns all the current assets on the ledger');
            // let result = await contract.evaluateTransaction('GetAllAssets');
            // console.log(`*** Result: ${prettyJSONString(result.toString())}`);

            // Now let's try to submit a transaction.
            // This will be sent to both peers and if both peers endorse the transaction, the endorsed proposal will be sent
            // to the orderer to be committed by each of the peer's to the channel ledger.
            // console.log('\n--> Submit Transaction: CreateAsset, creates new asset with ID, color, owner, size, and appraisedValue arguments');
            // await contract.submitTransaction('CreateAsset', 'asset13', 'yellow', '5', 'Tom', '1300');
            // console.log('*** Result: committed');

            // console.log('\n--> Evaluate Transaction: ReadAsset, function returns an asset with a given assetID');
            // result = await contract.evaluateTransaction('ReadAsset', 'asset13');
            // console.log(`*** Result: ${prettyJSONString(result.toString())}`);

            // console.log('\n--> Evaluate Transaction: AssetExists, function returns "true" if an asset with given assetID exist');
            // result = await contract.evaluateTransaction('AssetExists', 'asset1');
            // console.log(`*** Result: ${prettyJSONString(result.toString())}`);

            // console.log('\n--> Submit Transaction: UpdateAsset asset1, change the appraisedValue to 350');
            // await contract.submitTransaction('UpdateAsset', 'asset1', 'blue', '5', 'Tomoko', '350');
            // console.log('*** Result: committed');

            // console.log('\n--> Evaluate Transaction: ReadAsset, function returns "asset1" attributes');
            // result = await contract.evaluateTransaction('ReadAsset', 'asset1');
            // console.log(`*** Result: ${prettyJSONString(result.toString())}`);

            // try {
            //     // How about we try a transactions where the executing chaincode throws an error
            //     // Notice how the submitTransaction will throw an error containing the error thrown by the chaincode
            //     console.log('\n--> Submit Transaction: UpdateAsset asset70, asset70 does not exist and should return an error');
            //     await contract.submitTransaction('UpdateAsset', 'asset70', 'blue', '5', 'Tomoko', '300');
            //     console.log('******** FAILED to return an error');
            // } catch (error) {
            //     console.log(`*** Successfully caught the error: \n    ${error}`);
            // }

            // console.log('\n--> Submit Transaction: TransferAsset asset1, transfer to new owner of Tom');
            // await contract.submitTransaction(signFunc, 'TransferAsset', 'asset1', 'Tom');
            // console.log('*** Result: committed');

            // console.log("Starts here =======================================================================================================")
            // console.log('\n--> Evaluate Transaction: ReadAsset, function returns "asset1" attributes');
            // let result = await contract.evaluateTransaction(signFunc, 'ReadAsset', 'asset1');
            // console.log(`*** Result: ${prettyJSONString(result.toString())}`);

            // let result = await contract.evaluateTransaction(signFunc, 'ReadAsset', 'asset1');
            const signedEnvelope = await proposalGenerator(signFunc, cert, 'ReadAsset', 'asset1')
            // const signedEnvelope = await proposalGenerator(signFunc, cert, 'TransferAsset', 'asset1', 'Pras3')
            user = User.createUser(signedEnvelope.extra.userOpts.name, signedEnvelope.extra.userOpts.pass, signedEnvelope.extra.userOpts.mspid, signedEnvelope.extra.userOpts.signedCertPEM)
            // const identity2 = user.getIdentity()
            const identity2 = {
                type: identity.type,
                mspId: identity.mspId,
                credentials: {
                    // @ts-ignore
                    // certificate: identity.credentials.certificate,
                    certificate: "-----BEGIN CERTIFICATE-----\nMIIB8jCCAZmgAwIBAgIUEoAx1J24JuZxMa03BKkCgITDif8wCgYIKoZIzj0EAwIw\ncDELMAkGA1UEBhMCVVMxFzAVBgNVBAgTDk5vcnRoIENhcm9saW5hMQ8wDQYDVQQH\nEwZEdXJoYW0xGTAXBgNVBAoTEG9yZzEuZXhhbXBsZS5jb20xHDAaBgNVBAMTE2Nh\nLm9yZzEuZXhhbXBsZS5jb20wHhcNMjAxMjI1MjA0OTAwWhcNMjExMjI1MjA1NDAw\nWjAhMQ8wDQYDVQQLEwZjbGllbnQxDjAMBgNVBAMTBWFkbWluMFkwEwYHKoZIzj0C\nAQYIKoZIzj0DAQcDQgAEIdQr6zKkvN4ks5oixfTcUL16ou2F+n18zmFsgZUPUb/X\nKzmZ4InvMLVAMJeBY0Vmn2rK8TNvzC+r5G57XmxRIqNgMF4wDgYDVR0PAQH/BAQD\nAgeAMAwGA1UdEwEB/wQCMAAwHQYDVR0OBBYEFPAdfhAB0J2QKicUIjKxWLd0pA1C\nMB8GA1UdIwQYMBaAFK2h7PloOU4I4terPm+uVVZOde4fMAoGCCqGSM49BAMCA0cA\nMEQCIFukUZsoBqWtN14jMbaChuT04bl4hy3AH/tvHGdqU+kBAiA27wHJ0Dpl8FaN\nXcd0aLsqNy4Tk/k/6dCLgOrRVfp0qQ==\n-----END CERTIFICATE-----\n",
                    // dummy priv key / admin priv key
                    // It is using the priv key for discovery service dammit
                    privateKey: "-----BEGIN PRIVATE KEY-----\nMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgc34g+Qf2q5ofmBX3\nt5JrwLubbafO4FvwkleNrP1mvzuhRANCAAQh1CvrMqS83iSzmiLF9NxQvXqi7YX6\nfXzOYWyBlQ9Rv9crOZngie8wtUAwl4FjRWafasrxM2/ML6vkbntebFEi\n-----END PRIVATE KEY-----\n",
                    // @ts-ignore
                    // privateKey: identity.credentials.privateKey,
                }
            }
            

            console.log('Idenity: ', identity2)
            // IdentityContext
            const client = new Client('new client')
            const idx: IdentityContext = client.newIdentityContext(user)
            const gatewayOpts2: GatewayOptions = {
                identity: identity2,
                identityContext: idx,
                discovery: { enabled: true, asLocalhost: true }, // using asLocalhost as this gateway is using a fabric network deployed locally
            };
            await gateway2.connect(ccp, gatewayOpts2);
            const network2 = await gateway2.getNetwork(channelName);

            // Get the contract from the network.
            const contract2 = network2.getContract(chaincodeName);

            let result = await contract2.evaluateBySignedEnvelope(signedEnvelope.proposal_bytes, signedEnvelope.signature);
            console.log("Result:")
            console.log(result.toString())

            // // INVOKE!!!!! WEEEEEE
            // // STEP 1!!!
            // let result = await contract2.endorseBySignedEnvelope(signedEnvelope.proposal_bytes, signedEnvelope.signature);
            // console.log("Endorse Result:")
            // let resultJSON = JSON.parse(result.toString())
            // console.log(resultJSON)

            // // STEP 2!!!!!!
            // const signedEnvelope2 = await commitGenerator(signFunc, cert, signedEnvelope.extra._action, result)
            // let result2 = await contract2.commitBySignedEnvelope(signedEnvelope2.commit_bytes, signedEnvelope2.signature, signedEnvelope.extra._txId);
            // console.log("Commit Result:")
            // console.log(result2)
        } finally {
            // Disconnect from the gateway when the application is closing
            // This will close all connections to the network
            gateway.disconnect();
            gateway2.disconnect();

        }
    } catch (error) {
        console.error(`******** FAILED to run the application: ${error}`);
    }
}

let signFunc = async function (msg : string) : Promise<Buffer> {
    // const payload = Buffer.from(JSON.parse(msg).data);
    // console.log("Inside App.ts, Payload string: ", msg)
    // console.log("Length: ", msg.length)
    const privateKeyPEM = '-----BEGIN PRIVATE KEY-----\nMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgaxyoWINxdoec2acu\neZqHIzpyoHu9TO5eM9OiXYlMulGhRANCAARn1aSOIYDgCgQNOPucelKN1UUmylYt\nj4yXUbyw8+pFVDNjLwxC110K7JRgSjYF6Opz+k15darTpO7bDWWYsxCg\n-----END PRIVATE KEY-----\n';
    
    const { prvKeyHex } = KEYUTIL.getKey(privateKeyPEM); // convert the pem encoded key to hex encoded private key

    const EC = elliptic.ec;
    const ecdsaCurve = elliptic.curves['p256'];

    const ecdsa = new EC(ecdsaCurve);
    const signKey = ecdsa.keyFromPrivate(prvKeyHex, 'hex');
    var sig = ecdsa.sign(Buffer.from(msg, 'hex'), signKey);
    sig = _preventMalleability(sig);
    // now we have the signature, next we should send the signed transaction proposal to the peer
    const signature = Buffer.from(sig.toDER());

    return signature
    // // console.log("User to string!! App.ts:")
    // // console.log(user.toString())
    // const signer = user.getSigningIdentity()
    // const cryptosuite = user.getCryptoSuite()
    // const hashfunc = cryptosuite.hash.bind(cryptosuite);

    // // console.log("This is the cryptosuite hash:");
    // // const hashDigest = hashfunc(payload);
    // // console.log(hashDigest);
    // const signature = Buffer.from(signer.sign(payload));  
    // // console.log("External signed proposal:")
    // // console.log(signature.toString())

    // // console.log("Sign at app.ts - IDContext style: ", Buffer.from(signer.sign(payload)))
    // // console.log("Sign at app.ts - double buffer: ", signature)

    // // const identityContext = gateway.identityContext!.calculateTransactionId()
    // // console.log("App.ts -> now with identity context signing: ")
    // // console.log(Buffer.from(identityContext.sign(payload)))   

    // // const identityContext2 = gateway.identityContext!.calculateTransactionId()
    // // console.log("App.ts -> now with identity context 2 signing: ")
    // // console.log(Buffer.from(identityContext2.sign(payload)))   

    // console.log("At app.ts: User.isenrolled?", user.isEnrolled())



    // return signature;
}

function _preventMalleability(sig: any) {
	const halfOrder = elliptic.curves.p256.n.shrn(1);

	// in order to guarantee 's' falls in the lower range of the order, as explained in the above link,
	// first see if 's' is larger than half of the order, if so, it needs to be specially treated
	if (sig.s.cmp(halfOrder) === 1) { // module 'bn.js', file lib/bn.js, method cmp()
		// convert from BigInteger used by jsrsasign Key objects and bn.js used by elliptic Signature objects
		const bigNum = elliptic.curves.p256.n;
		sig.s = bigNum.sub(sig.s);
	}
	return sig;
}
/**
1. Generates the transaction proposal
2. Sends it to Endorsement Server
3. Gets response with transaction to be signed
4. Signs and sends it back to Orderer Submition
*/
async function commitGenerator(sign: {(msg: string) : Promise<Buffer>}, cert: string, action: object, endorseResponse: Buffer) {
    // Parse the endorseResponse
    let endorsementResponses: EndorsementResponse[] = JSON.parse(endorseResponse.toString())
    // Parse Buffers inside json object 
    for ( let i = 0; i < endorsementResponses.length; i ++){
        // @ts-ignore
        endorsementResponses[i] = parseJSONBuffers(endorsementResponses[i])
    }

    // Client
    const client = new Client('new client')
    // Channel
    const channel = client.newChannel(channelName)
    // Endorsement
    const endorsement = new Endorsement(chaincodeName, channel)
    endorsement.setAction(action)

    endorsement.setProposalResponses(endorsementResponses)

    console.log("Check endorsements:")
    console.log(JSON.stringify(endorsementResponses[0].endorsement))
    
    const commit = endorsement.newCommit();
    // User
    const userOpts = {
        name: org1UserId,
        pass:'',
        mspid: mspOrg1,
        signedCertPEM: cert,
    }
    const user = User.createUser(userOpts.name, userOpts.pass, userOpts.mspid, userOpts.signedCertPEM)
    // IdentityContext
    const idx = client.newIdentityContext(user)
    const identityContext = idx.calculateTransactionId();

    
    // Building commit
    const commitBytes = commit.build(identityContext);
    const digest = computeHash(commitBytes)
    // console.log("Commit id: ", commit.getTransactionId())
    // Sign it
    const signatureBytes = await sign(digest)

    const signedEnvelope = {
        signature: signatureBytes,
        commit_bytes: commitBytes,
        extra: {
            userOpts
        }
    };

    return signedEnvelope

}

function parseJSONBuffers(jsonObj: Object) : Object {
    Object.keys(jsonObj).forEach(function(key) {
        // @ts-ignore
        let val = jsonObj[key];
        let valType = typeof val;
        if (val && valType === 'object') {
            // Recurse through fields
            val = parseJSONBuffers(val)

            // Parse buffer
            if (val.type && val.type === 'Buffer' && val.data) {
                // @ts-ignore
                jsonObj[key] = Buffer.from(val.data)
            }
        }
    });

    return jsonObj
}


async function invokeOrchestrator() {
    
}

async function proposalGenerator(sign: {(msg: string) : Promise<Buffer>}, cert: string, funcName: string,...args: string[]) {
    // Client
    const client = new Client('new client')
    // Channel
    const channel = client.newChannel(channelName)
    // Proposal
    const proposal = new Proposal(chaincodeName, channel)
    // User
    const userOpts = {
        name: org1UserId,
        pass:'',
        mspid: mspOrg1,
        signedCertPEM: cert,
    }
    const user = User.createUser(userOpts.name, userOpts.pass, userOpts.mspid, userOpts.signedCertPEM)
    // IdentityContext
    const idx = client.newIdentityContext(user)
    const identityContext = idx.calculateTransactionId();


    // Building proposal
    verifyTransactionName(funcName); 
    const qualifiedName = _getQualifiedName(funcName);
    const buildProposalRequest = newBuildProposalRequest(qualifiedName, args);

    const proposalBytes = proposal.build(identityContext, buildProposalRequest);
    const digest = computeHash(proposalBytes);
    console.log("Proposal id:", proposal.getTransactionId())
    // Sign it
    const signatureBytes = await sign(digest);

    // const signedProposal = fabproto6.protos.SignedProposal.create({
    //     signature: signatureBytes,
    //     proposal_bytes: proposalBytes
    // });
    const _action = proposal.getAction();
    const _txId = proposal.getTransactionId();
    const signedEnvelope = {
        signature: signatureBytes,
        proposal_bytes: proposalBytes,
        extra: {
            _txId: _txId,
            _action: _action,
            userOpts
        }
    };

    return signedEnvelope;

}

function computeHash(data: any) {
	const sha256 = crypto.createHash('sha256');
	return sha256.update(data).digest();
}

// TODO transient!!
function newBuildProposalRequest(fullyQualifiedFuncName: string, args: string[]): BuildProposalRequest {
    const request: BuildProposalRequest = {
        fcn: fullyQualifiedFuncName,
        args: args,
        generateTransactionId: false
    };
    // if (this.transientMap) {
    //     request.transientMap = this.transientMap;
    // }
    return request;
}


/**
 * Ensure transaction name is a non-empty string.
 * @private
 * @param {string} name Transaction name.
 * @throws {Error} if the name is invalid.
 */
function verifyTransactionName(name: string): void {
	if (typeof name !== 'string' || name.length === 0) {
		const msg = `Transaction name must be a non-empty string: ${name}`;
		throw new Error(msg);
	}
}

/**
 * Ensure that, if a namespace is defined, it is a non-empty string
 * @private
 * @param {string|undefined} namespace Transaction namespace.
 * @throws {Error} if the namespace is invalid.
 */
function verifyNamespace(namespace?: string): void {
	if (namespace && typeof namespace !== 'string') {
		const msg = `Namespace must be a non-empty string: ${namespace}`
		throw new Error(msg);
	}
}

// Transaction name / function name
// Namespace is nothing
function _getQualifiedName(name: string): string {
    // return (this.namespace ? `${this.namespace}:${name}` : name);
    return (null ? `namespacegoeshere:${name}` : name);
}

main();

// function hash(msgBytes: Buffer): string {
//     // return CryptoJS.SHA256(msgBytes.toString()).toString(CryptoJS.enc.Hex)
//     // const hashBuffer = CryptoJS.SHA256(msgBytes.toString())
//     // const hashString = JSON.stringify(hashBuffer)
//     // return hashString


//     // TODO if else case - copy from gateway.ts
    
//     const cryptoSuite = user.getCryptoSuite()
//     const hashFunction = cryptoSuite.hash.bind(cryptoSuite);

//     const digest = hashFunction(msgBytes.toString(), null);

//     console.log("app.ts - transaction.ts generated hash: ", digest)
//     return digest
// }

// function cryptojshash(msgBytes: Buffer): string {
//     return CryptoJS.SHA256(msgBytes.toString()).toString(CryptoJS.enc.Hex)
//     // const hashBuffer = CryptoJS.SHA256(msgBytes.toString())
//     // const hashString = JSON.stringify(hashBuffer)
//     // return hashString
// }

class test {
    public count: any;
    constructor(c: number) {
        this.count = c;
    }
    fun() {
        console.log("FUN RAN!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", this.count)
        this.count++;
        return this.clone()
    }

    clone() {
		const result = new test(this.count);
		return result;
	}
}