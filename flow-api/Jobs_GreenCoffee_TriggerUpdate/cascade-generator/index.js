// Dependencies
const _ = require('lodash');
const util = require('util')
const fs = require('fs');

// Datasets
var acc = require('./data/account.json');
var acc_agent = require('./data/account_agency.json');
var agencies = require('./data/list_of_agency.json');
var comm = require('./data/commodity.json');

var accounts = [];

acc.forEach(function(x){
    let agc_list = x.ID_Account_of_Agency.substring(1, x.ID_Account_of_Agency.length - 1);
    agc_list = agc_list.split(',');
    let arr_list = [];
    _.map(agc_list, function(y){
        let agg_list = [];
        _.map(acc_agent, function(z){
            let idAoa = z.ID_Account_of_Agency;
            let agg_detail = [];
            if(idAoa === parseInt(y)) {
                let Alist = z.ID_Agency.replace(' ','').split(',');
                _.map(Alist, function(ids){
                    let detail_agency = [];
                    _.map(agencies, function(a){
                        if (parseInt(ids) === parseInt(a.ID_Agency)) {
                            detail_agency.push(a);
                        }
                    });
                    agg_detail.push(detail_agency[0]);
                });
                agg_list.push({'Parent':z, 'Childrens':agg_detail});
            };
        });
        let all_agencies = _.map(agg_list, function(data){
            let mutated = {
                'ID_Account_of_Agency': data['Parent']['ID_Account_of_Agency'],
                'Account_of_Agency': data['Parent']['Account_of_Agency'],
                'Province': data['Parent']['Province'],
                'Sub_Agents': data['Childrens']
            };
            let ID_Commodity = data['Parent']['ID_Commodity'].replace(' ','').split(',');
            let Commodities = [];
            _.map(ID_Commodity, function(data){
                _.map(comm, function(detail){
                    if (parseInt(data) === detail['ID_Commodity']) {
                        Commodities.push(detail);
                    }
                });
            })
            mutated['Commodity_list'] = Commodities;
            return mutated;
        });
        arr_list.push(all_agencies[0]);
    });

    x['Agent_Details'] = arr_list;
    accounts.push(x);
});

console.log(util.inspect(accounts[1], false, null))

fs.writeFileSync('./data/account_all.json', JSON.stringify(accounts));
