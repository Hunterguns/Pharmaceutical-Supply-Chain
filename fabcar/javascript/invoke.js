/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';


const { invokeDistributor } = require('./distributor.js');
const { invokeManufacturer } = require('./manufacturer.js');
const { invokeWholesaler } = require('./wholesaler.js');


invokeManufacturer("MAN987", "cust1", "order1", "manuf1", "2022-07-07", "order 1 details", "manuf1 invoice", "2024-12-11", "2022-08-01", "2022-09-05", "500");
invokeDistributor("DIST234", "DISTRIBUTOR_234_SIGN", "distributor invoice", "2022-09-18", "2022-09-30", "200");
invokeWholesaler("WHOLE234", "WHOLESALER_234_SIGN", "wholesaler invoice", "2022-10-05", "2022-10-25", "400");
