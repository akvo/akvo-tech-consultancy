import React, { Component } from "react";
import { Col } from "react-bootstrap";
import DataTable from 'react-data-table-component';

class Tables extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let props = this.props;
        return (
            <Col md={props.config.column}>
                <p className="text-center font-weight-bold">{props.title}</p>
                <DataTable
                    title={props.title}
                    className="table table-bordered table-sm"
                    columns={props.dataset[0].columns}
                    data={props.dataset[0].rows}
                    noHeader={true}
                    fixedHeader={true}
                    fixedHeaderScrollHeight={"500px"}
                    // onRowClicked={this.showDetail}
                    // defaultSortField="name"
                    // conditionalRowStyles={conditionalRowStyles}
                    // customStyles={customTableStyle}
                    highlightOnHover={true}/>
            </Col>
        )
    }
}

export default Tables;