/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function invokeManufacturer(transacNumber, customerName, orderNo, manufacturerName, manufacturingDate, orderDetails, manufacturerInvoice,
    expiryDate, manufacturerExpectedDispatch, manufacturerActualDispatch, price) {
    try {
        transacNumber = transacNumber.toString();
        customerName = customerName.toString();
        orderNo = orderNo.toString();
        manufacturerName = manufacturerName.toString();
        manufacturingDate = manufacturingDate.toString();
        orderDetails = orderDetails.toString();
        manufacturerInvoice = manufacturerInvoice.toString();
        expiryDate = expiryDate.toString();
        manufacturerExpectedDispatch = manufacturerExpectedDispatch.toString();
        manufacturerActualDispatch = manufacturerActualDispatch.toString();
        price = price.toString();
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

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

        // Submit the specified transaction.
        // await contract.submitTransaction('invokeManufacturer', transacNumber, customerName, orderNo, manufacturerName, manufacturingDate, orderDetails, manufacturerInvoice, expiryDate, manufacturerExpectedDispatch, manufacturerActualDispatch, price);

        await contract.submitTransaction('invokeManufacturer', transacNumber, customerName, orderNo, manufacturerName, manufacturingDate, orderDetails, manufacturerInvoice, expiryDate, manufacturerExpectedDispatch, manufacturerActualDispatch, price);
        console.log('Transaction successful');

        console.log('Transaction successful');
  

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

module.exports = { invokeManufacturer };