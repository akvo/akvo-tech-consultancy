// Dependencies
const _ = require('lodash');
const util = require('util')
const fs = require('fs');
const csv = require('fast-csv');

// Datasets
var accounts = require('./data/account_all.json');

// Files
let file = './csv/gc_cascade_' + new Date().toISOString() + '.csv';
var csvStream = csv.createWriteStream({headers: true}),
writableStream = fs.createWriteStream(file);

writableStream.on("finish", function(){
  console.log("converted to " + file + " !");
});

csvStream.pipe(writableStream);

let cascade = [];
accounts.forEach(function(data){
    data['Agent_Details'].forEach(function(agent){
        agent['Sub_Agents'].forEach(function(sub){
            agent['Commodity_list'].forEach(function(comm){
                let row = {
                    'ACC_ID':data['ACC_ID'],
                    'ACC_NAME':data['ACC_NAME'],
                    'acc_fname':data['acc_fname'],
                    'ID_Account_of_Agency':agent['ID_Account_of_Agency'],
                    'Account_of_Agency':agent['Account_of_Agency'],
                    'ID_Agency':sub['ID_Agency'],
                    'Name_of_Agency':sub['Name_of_Agency'],
                    'Commune':sub['Commune'],
                    'District':sub['District'],
                    'Province':sub['Province'],
                    'ID_Commodity':comm['ID_Commodity'],
                    'Group_code':comm['Group_code'],
                    'Commodity_code':comm['Commodity_code'],
                    'Group_name':comm['Group_name'],
                    'Commodity':comm['Commodity'],
                    'UNIT':comm['UNIT'],
                };
                console.log(row);
                csvStream.write(row);
            });
        });
    });
});

csvStream.end();

//console.log(util.inspect(cascade[0], false, null));
//console.log(util.inspect(accounts[0], false, null));
//console.log(cascade.length);
