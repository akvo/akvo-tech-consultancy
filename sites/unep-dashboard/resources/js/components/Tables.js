import React, { Component } from 'react';
import { redux } from "react-redux";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../reducers/actions.js";
import { Col, Table } from "react-bootstrap";
import DataTable from 'react-data-table-component';

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
    }

    render() {
        const columns = [
          {
            name: 'Category',
            selector: 'name',
            sortable: true,
            right: false,
          },
          {
            name: 'Count of Actions',
            selector: 'value',
            sortable: true,
            right: true,
            maxWidth: '15px'
          },
        ];
        return (
            <Col md={this.props.config.column}>
                <DataTable
                    title={this.props.title}
                    columns={columns}
                    data={this.props.dataset}
                    customStyles={customStyles}
                    fixedHeader
                    fixedHeaderScrollHeight={"50vh"}
                    highlightOnHover
                    pointerOnHover
                />
            <hr/>
            </Col>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tables);
