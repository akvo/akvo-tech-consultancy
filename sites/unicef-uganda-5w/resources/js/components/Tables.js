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
        let base = this.props.value.base;
        let config = base.config;
        let page = this.props.value.page.name;
        let data = this.props.value.filters[page].data;
        data = data.map((x, i) => {
            let results = {no: (i+1), ...x};
            for (const v in x) {
                let column = config.find(n => n.name === v);
                if (column !== undefined && column.on) {
                    let value = base[column.on].find(a => a.id === x[v]);
                    results = {
                        ...results,
                        [v]: value.text
                    }
                    if (v === "sub_domain") {
                        results = {
                            ...results,
                            unit: value.unit
                        }
                    }
                }
            }
            return results;
        });
        data = data.map(x => {
            return {
                ...x,
                location: x.region + ', ' + x.district,
            }
        });
        return data;
    }

    render() {
        const columns = [
          {
            name: 'No',
            selector: 'no',
            sortable: true,
            maxWidth: '50px',
            width: '50px'
          },
          {
            name: 'Region / District',
            selector: 'location',
            sortable: true,
            maxWidth: '250px'
          },
          {
            name: 'Type',
            selector: 'activity',
            sortable: true,
            maxWidth: '200px'
          },
          {
            name: 'NGO',
            selector: 'org_name',
            sortable: true,
            maxWidth: '100px'
          },
          {
            name: 'Domain',
            selector: 'domain',
            sortable: true,
            wrap: true,
            maxWidth: '50px'
          },
          {
            name: 'Activity',
            selector: 'sub_domain',
            sortable: true,
            wrap: true,
            minWidth: '200px'
          },
          {
            name: 'Qty',
            selector: 'quantity',
            sortable: true,
            right: true,
            maxWidth: '15px'
          },
          {
            name: 'Unit',
            selector: 'unit',
            sortable: true,
            minWidth: '200px'
          },
          {
            name: 'Total Beneficiaries',
            selector: 'total',
            sortable: true,
            right: true,
          },
        ];
        return (
        <Col className={"table-bottom"}>
            <DataTable
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
