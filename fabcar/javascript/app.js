const express = require('express');
const path = require('path');
const hbs = require('hbs');
const { urlencoded } = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const { invokeManufacturer } = require('./manufacturer.js');
const { invokeDistributor } = require('./distributor.js');
const { invokeWholesaler } = require('./wholesaler.js');
const { queryOneTxn, queryAllTxn } = require('./query.js');
// const engines = require('consolidate');

const app = express();
const port = process.env.PORT || 5000;

const static_path = path.join(__dirname,"/public");
const views_path = path.join(__dirname, "/templates/views");
const partials_path = path.join(__dirname, "/templates/partials");

// console.log(__dirname + '/public');

app.use(express.json());
app.use(urlencoded({extended:false}));
app.use(express.static(__dirname + '/public'));
app.set("view engine", "hbs");
app.set("view engine", "ejs");
app.set("views", views_path);
hbs.registerPartials(partials_path);
   
app.get("/", (req,res)=>{
    res.render("manufacturer.hbs");
});

app.get("/distributorRedirect", ( req, res ) => {
    res.render("distributor.hbs");
});

app.get("/wholesalerRedirect", ( req, res ) => {
    res.render("wholesaler.hbs");
});

app.get("/queryTxnRedirect", ( req, res )=>{
    res.render("queryTxn.hbs")
});


app.listen(port, ()=>{
    console.log(`Listening to port ${port}`);
})

// console.log(uuidv4()); 
app.post("/manufSubmit", async(req,res)=>{
    try {
        const customerName = req.body.customerName;
        const orderNo = req.body.orderNo;
        const manName = req.body.manName;
        const manDate = req.body.manDate;
        const orderDetails = req.body.orderDetails;
        const manInvoice = req.body.manInvoice;
        const expiryDate = req.body.expiryDate;
        const manExpectedDispatch = req.body.manExpectedDispatch;
        const manActualDispatch = req.body.manActualDispatch;
        const manPrice = req.body.manPrice;

        await invokeManufacturer(uuidv4(),customerName, orderNo, manName, manDate, orderDetails, manInvoice, expiryDate, manExpectedDispatch, manActualDispatch, manPrice );
        res.render("successfulManuf.ejs", {
            customerName:customerName,
            orderNo : orderNo,
            manName : manName,
            manDate : manDate,
            orderDetails : orderDetails,
            manInvoice : manInvoice,
            expiryDate : expiryDate,
            manExpectedDispatch : manExpectedDispatch,
            manActualDispatch : manActualDispatch,
            manPrice : manPrice
        });
        
    } catch (error) {
        res.status(400).send(error);
    }
});

app.post("/distributorSubmit", async(req,res)=>{
    try{
        const validationDistributor = req.body.validationDistributor; 
        const distributorInvoice = req.body.distributorInvoice; 
        const distributorExpectedDispatch = req.body.distributorExpectedDispatch; 
        const distributorActualDispatch = req.body.distributorActualDispatch; 
        const distributorPrice = req.body.distributorPrice; 

        await invokeDistributor(uuidv4(), validationDistributor, distributorInvoice, distributorExpectedDispatch,distributorActualDispatch,distributorPrice);
        res.render("successfulDist.ejs",{
            validationDistributor : validationDistributor,
            distributorInvoice : distributorInvoice,
            distributorExpectedDispatch : distributorExpectedDispatch,
            distributorActualDispatch : distributorActualDispatch,
            distributorPrice : distributorPrice
        });
        } catch (error) {
        res.status(400).send(error);
    }
});

app.post("/wholesalerSubmit", async(req,res)=>{
    try{
        const validationWholesaler = req.body.validationWholesaler; 
        const wholesalerInvoice = req.body.wholesalerInvoice; 
        const wholesalerExpectedDispatch = req.body.wholesalerExpectedDispatch; 
        const wholesalerActualDispatch = req.body.wholesalerActualDispatch; 
        const wholesalerPrice = req.body.wholesalerPrice; 

        await invokeWholesaler(uuidv4(), validationWholesaler, wholesalerInvoice, wholesalerExpectedDispatch,wholesalerActualDispatch,wholesalerPrice);
        res.render("successfulWhole.ejs",{
            validationWholesaler : validationWholesaler,
            wholesalerInvoice : wholesalerInvoice,
            wholesalerExpectedDispatch : wholesalerExpectedDispatch,
            wholesalerActualDispatch : wholesalerActualDispatch,
            wholesalerPrice : wholesalerPrice
        });        
        } catch (error) {
        res.status(400).send(error);
    }
});

app.post("/queryTxnSubmit", async(req,res)=>{
    try{
        const txnNo = req.body.queryTxnNo;
        // await queryOneTxn(txnNo);
        result = await queryOneTxn(txnNo);
        // console.log(typeof(result));
        // console.log(result.toString());
        const type = result["type"]
        console.log(type);
        if(type=="Manufacturer"){
            //manufacturer
            res.render("queryManufacturer.ejs",{
                type: type,
                orderNo: result["Order Number"],
                manName: result["Manufacturer's Name"],
                manDate: result["Manufacturing Date"],
                manInvoice: result["Invoice"],
                expiryDate: result["Expiry Date"],
                manExpectedDispatch: result["Expected Date of Dispatch"],
                manActualDispatch: result["Actual Date of Dispatch"],
                manPrice: result["Price"],
                manPenalty: result["Penalty"],
            });
        }

        else if(type=="Distributor"){
            //Distributor
            res.render("queryDistributor.ejs",{
                type: type,
                validationDistributor: result["Validation Signature"],
                distributorInvoice: result["Invoice"],
                distributorExpectedDispatch :result["Expected Date of Dispatch"],
                distributorActualDispatch :result["Actual Date of Dispatch"],
                distributorPrice :result["Price"],
                distributorPenalty :result["Penalty"],
            });
        }
        else if(type == "Wholesaler"){
            //WholeSaler
            res.render("queryWholesaler.ejs",{
                type: type,
                validationWholesaler : result["Validation Signature"],
                wholesalerInvoice : result["Invoice"],
                wholesalerExpectedDispatch : result["Expected Date of Dispatch"],
                wholesalerActualDispatch : result["Actual Date of Dispatch"],
                wholesalerPrice : result["Price"],
                wholesalerPenalty : result["Penalty"]
            });

        }
        else{
            console.log("Other");
        }
        // res.send(result.toString());
    } catch(error){
        res.status(200).send(error);
    }
});