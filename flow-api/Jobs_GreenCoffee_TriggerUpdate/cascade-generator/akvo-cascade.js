// Dependencies
const _ = require('lodash');
const util = require('util')
const fs = require('fs');
const csv = require('fast-csv');

// Datasets
var accounts = require('./data/account_all.json');

// Files
let file = './csv/gc_cascade_' + new Date().toISOString() + '.csv';
var csvStream = csv.createWriteStream({headers: false}),
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
                    'ID_Account_of_Agency':agent['ID_Account_of_Agency'],
                    'Agency_name':agent['Account_of_Agency'],
                    'ID_Agency':sub['ID_Agency'],
                    'Name_of_Agency':sub['Name_of_Agency'],
                    'ID_Commodity':comm['ID_Commodity'],
                    'Commodity_Name':comm['Commodity'] + ' (' + comm['Commodity_code'] + ')',
                    'ID_UNIT':comm['ID_Commodity'],
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
