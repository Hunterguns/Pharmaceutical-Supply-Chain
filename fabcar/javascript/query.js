/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');
const { type } = require('os');


async function queryOneTxn(txnNo) {
    try {

        txnNo = txnNo.toString();

        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('appUser');
        if (!identity) {
            console.log('An identity for the user "appUser" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('fabcar');

        // Evaluate the specified transaction.
        // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
        // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
        // const resulttemp = await contract.evaluateTransaction('queryAllCars');
        // console.log(`Transaction has been evaluated, result is: ${resulttemp.toString()}`);
        // console.log("\n\n");

        const result = await contract.evaluateTransaction('queryTransaction', txnNo);
        
        console.log(`Transactionnnnnnnnnnnnnnnnn has been evaluated, result is: ${result.toString()}`);
        var data = JSON.parse(result);
        // console.log(data["Price"]);
        // const orderNo = result[8];
        // console.log(orderNo.toString());


        // const result1 = await contract.evaluateTransaction('queryCar','CAR12');
        // console.log(result1.toString());
        // console.log("\n");
        // const result2 = await contract.evaluateTransaction('queryCar','MAN987');
        // console.log(result2.toString());
        // console.log("\n");
        // const result3 = await contract.evaluateTransaction('queryCar','DIST234');
        // console.log(result3.toString());
        // console.log("\n");
        // const result4 = await contract.evaluateTransaction('queryCar','WHOLE234');
        // console.log(result4.toString());

        // Disconnect from the gateway.
        await gateway.disconnect();
        return data;

        return {
            // type: type,
            customerName:result["Customer Name"],
        }
        
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
}

async function queryAllTxn() {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('appUser');
        if (!identity) {
            console.log('An identity for the user "appUser" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('fabcar');

        // Evaluate the specified transaction.
        // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
        // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
        const resulttemp = await contract.evaluateTransaction('queryAllCars');
        console.log(`Transaction has been evaluated, result is: ${resulttemp.toString()}`);
        console.log("\n\n");


        // Disconnect from the gateway.
        await gateway.disconnect();
        
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
}

queryAllTxn();

module.exports = { queryAllTxn, queryOneTxn };