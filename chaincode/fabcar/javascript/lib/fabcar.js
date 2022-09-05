/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class FabCar extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const cars = [
            {
                color: 'blue',
                make: 'Toyota',
                model: 'Prius',
                owner: 'Tomoko',
            },
            {
                color: 'red',
                make: 'Ford',
                model: 'Mustang',
                owner: 'Brad',
            },
            {
                color: 'green',
                make: 'Hyundai',
                model: 'Tucson',
                owner: 'Jin Soo',
            },
            {
                color: 'yellow',
                make: 'Volkswagen',
                model: 'Passat',
                owner: 'Max',
            },
            {
                color: 'black',
                make: 'Tesla',
                model: 'S',
                owner: 'Adriana',
            },
            {
                color: 'purple',
                make: 'Peugeot',
                model: '205',
                owner: 'Michel',
            },
            {
                color: 'white',
                make: 'Chery',
                model: 'S22L',
                owner: 'Aarav',
            },
            {
                color: 'violet',
                make: 'Fiat',
                model: 'Punto',
                owner: 'Pari',
            },
            {
                color: 'indigo',
                make: 'Tata',
                model: 'Nano',
                owner: 'Valeria',
            },
            {
                color: 'brown',
                make: 'Holden',
                model: 'Barina',
                owner: 'Shotaro',
            },
        ];

        for (let i = 0; i < cars.length; i++) {
            cars[i].docType = 'car';
            await ctx.stub.putState('CAR' + i, Buffer.from(JSON.stringify(cars[i])));
            console.info('Added <--> ', cars[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    async queryTransaction(ctx, carNumber) {
        const carAsBytes = await ctx.stub.getState(carNumber); // get the car from chaincode state
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${carNumber} does not exist`);
        }
        console.log(carAsBytes.toString());
        return carAsBytes.toString();
    }

    // async createCar(ctx, carNumber, make, model, color, owner) {
    //     console.info('============= START : Create Car ===========');

    //     const car = {
    //         color,
    //         docType: 'car',
    //         make,
    //         model,
    //         owner,
    //     };

    //     await ctx.stub.putState(carNumber, Buffer.from(JSON.stringify(car)));
    //     console.info('============= END : Create Car ===========');
    // }

    
    async invokeManufacturer(ctx, transacNumber, customerName, orderNo, manufacturerName, manufacturingDate, orderDetails, manufacturerInvoice,
         expiryDate, manufacturerExpectedDispatch, manufacturerActualDispatch, price){
            console.info("Invoking Manufacturer");

            var d1 = Date.parse(manufacturerExpectedDispatch);
            var d2 = Date.parse(manufacturerActualDispatch);
            var diff = d2-d1;
            var penalty = ((parseInt(((Math.ceil(diff/(24*3600*1000)))-1)/10))*0.05* price).toFixed(2);

            const man = {
                type: "Manufacturer",
                "Order Number": orderNo,
                "Manufacturer's Name":manufacturerName,
                "Manufacturing Date":manufacturingDate,
                "Invoice":manufacturerInvoice,
                "Expiry Date":expiryDate,
                "Expected Date of Dispatch":manufacturerExpectedDispatch,
                "Actual Date of Dispatch":manufacturerActualDispatch,
                "Price":price,
                "Penalty":penalty,
            };

            await ctx.stub.putState(transacNumber, Buffer.from(JSON.stringify(man)));
            console.log("Invoke manufacturer completed Successfully");
         }

    async invokeDistributor(ctx, transacNumber, distributorValidation, distributorInvoice, distributerExpectedDispatch, distributorActualDispatch,price){
            console.info("Invoking Distributor");

            var d1 = Date.parse(distributerExpectedDispatch);
            var d2 = Date.parse(distributorActualDispatch);
            var diff = d2-d1;
            var penalty = ((parseInt(((Math.ceil(diff/(24*3600*1000)))-1)/10))*0.05* price).toFixed(2);


            const dist = {
                type: "Distributor",
                "Validation Signature":distributorValidation,
                "Invoice":distributorInvoice,
                "Expected Date of Dispatch":distributerExpectedDispatch,
                "Actual Date of Dispatch":distributorActualDispatch,
                "Price":price,
                "Penalty":penalty,
            };
               
            await ctx.stub.putState(transacNumber, Buffer.from(JSON.stringify(dist)));
            console.log("Invoke distributor completed Successfully");
                }
    
    async invokeWholesaler(ctx, transacNumber, wholesalerValidation, wholesalerInvoice, wholesalerExpectedDispatch, wholesalerActualDispatch,price){
            console.info("Invoking wholesaler");

            var d1 = Date.parse(wholesalerExpectedDispatch);
            var d2 = Date.parse(wholesalerActualDispatch);
            var diff = d2-d1;
            var penalty = ((parseInt(((Math.ceil(diff/(24*3600*1000)))-1)/10))*0.05* price).toFixed(2);
                
            const whole = {
                type: "Wholesaler",
                "Validation Signature":wholesalerValidation,
                "Invoice":wholesalerInvoice,
                "Expected Date of Dispatch":wholesalerExpectedDispatch,
                "Actual Date of Dispatch":wholesalerActualDispatch,
                "Price":price,
                "Penalty":penalty,
           };
                   
            await ctx.stub.putState(transacNumber, Buffer.from(JSON.stringify(whole)));
            console.log("Invoke wholesaler completed Successfully");
            }


    async queryAllCars(ctx) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    async changeCarOwner(ctx, carNumber, newOwner) {
        console.info('============= START : changeCarOwner ===========');

        const carAsBytes = await ctx.stub.getState(carNumber); // get the car from chaincode state
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${carNumber} does not exist`);
        }
        const car = JSON.parse(carAsBytes.toString());
        car.owner = newOwner;

        await ctx.stub.putState(carNumber, Buffer.from(JSON.stringify(car)));
        console.info('============= END : changeCarOwner ===========');
    }

}

module.exports = FabCar;
