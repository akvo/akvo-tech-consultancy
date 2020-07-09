import React, { Component } from "react";
import { redux } from "react-redux";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../reducers/actions.js";
import { Col, Table } from "react-bootstrap";
import { titleCase } from "../data/utils.js";
import DataTable from 'react-data-table-component';
import groupBy from 'lodash/groupBy';

const customStyles = {
    headCells: {
        style: {
            backgroundColor: '#343a40',
            borderColor: '#454d55',
            color: '#fff',
        },
        activeSortStyle: {
            '&:focus': {
                color: '#fff'
            },
            '&:hover:not(:focus)': {
                color: '#fff',
            },
        },
        inactiveSortStyle: {
            '&:focus': {
                outline: 'none',
                color: '#fff'
            },
            '&:hover': {
                color: '#fff'
            },
        },
    },
};

class Tables extends Component {
    constructor(props) {
        super(props);
        this.getRowTable = this.getRowTable.bind(this);
    }

    getRowTable() {
        let valType = this.props.value.filters.selected.type;
        let orgs = this.props.value.filters.organisations.filter(
                x => {
                    let active = this.props.value.filters.selected.filter;
                    if (active.sub_domain) {
                        return x.sub_domain === active.sub_domain;
                    }
                    if (active.domain) {
                        return x.domain === active.domain;
                    }
                    return true;
                }
            );
        let org_values = {};
        let list = this.props.value.filters.list;
        orgs = orgs.map((x,i) => {
            let domain = list.find(l => l.id === x.domain);
            let sub_domain = list.find(l => l.id === x.sub_domain);
            let location_name = x.parent !== null ? (x.parent.name + ' - ' + x.location) : x.location;
            let name = x.name + '___'
                + domain.name + '___'
                + sub_domain.name + '___'
                + location_name + '___'
                + x.activity;
            let value_new = org_values[name] === undefined
                ? x.value_new
                : org_values[name]['value_new'] + x.value_new;
            let value_total = org_values[name] === undefined
                ? x.value_total
                : org_values[name]['value_total'] + x.value_total;
            let value_quantity = org_values[name] === undefined
                ? x.value_quantity
                : org_values[name]['value_quantity'] + x.value_quantity;
            let activities = org_values[name] === undefined ? 1 : org_values[name]['activities'] + 1;
            org_values = {
                ...org_values,
                [name]: {
                    value_new: value_new,
                    value_quantity: value_quantity,
                    value_total: value_total,
                    activities: activities,
                    unit: x.unit
                }
            };
            return true;
        });
        let rows = [];
        let i = 0;
        for (let val in org_values) {
            i++;
            let vars = val.split('___');
            rows = [
                ...rows,
                {
                    no: i,
                    location: titleCase(vars[3]),
                    org: vars[0],
                    activity: titleCase(vars[4]),
                    domain: titleCase(vars[1]),
                    sub_domain: titleCase(vars[2]),
                    qty: org_values[val].value_quantity,
                    unit: org_values[val].unit,
                    total_beneficiaries: org_values[val].value_total,
                }
            ];
        }
        return rows;
    }

    render() {
        let columnname = this.props.value.filters.selected.type;
        const columns = [
          {
            name: 'No',
            selector: 'no',
            sortable: true,
            maxWidth: '5px'
          },
          {
            name: 'Location',
            selector: 'location',
            sortable: true,
            right: true,
            maxWidth: '250px'
          },
          {
            name: 'Type',
            selector: 'activity',
            sortable: true,
            right: true,
          },
          {
            name: 'NGO',
            selector: 'org',
            sortable: true,
            right: true,
            maxWidth: '100px'
          },
          {
            name: 'Category',
            selector: 'domain',
            sortable: true,
            right: true,
            maxWidth: '50px'
          },
          {
            name: 'Activity',
            selector: 'sub_domain',
            sortable: true,
            right: true,
          },
          {
            name: 'Qty',
            selector: 'qty',
            sortable: true,
            right: true,
            maxWidth: '15px'
          },
          {
            name: 'Unit',
            selector: 'unit',
            sortable: true,
            right: true,
            minWidth: '200px'
          },
          {
            name: 'Total Beneficiaries',
            selector: 'total_beneficiaries',
            sortable: true,
            right: true,
          },
        ];
        return (
        <Col className={"table-bottom"}>
            <DataTable
                title={columnname === "reset" ? "All Organisations": titleCase(columnname)}
                columns={columns}
                data={this.getRowTable()}
                customStyles={customStyles}
                fixedHeader
                fixedHeaderScrollHeight="540px"
                highlightOnHover
                pagination={true}
                paginationPerPage={10}
                pointerOnHover
            />
        </Col>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tables);
