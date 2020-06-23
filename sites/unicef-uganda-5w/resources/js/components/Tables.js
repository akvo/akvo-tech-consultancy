import React, { Component } from "react";
import { redux } from "react-redux";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../reducers/actions.js";
import { Col, Table } from "react-bootstrap";
import { titleCase } from "../data/utils.js";
import ReactEcharts from "echarts-for-react";
import DataTable from 'react-data-table-component';

class Tables extends Component {
    constructor(props) {
        super(props);
        this.getRowTable = this.getRowTable.bind(this);
    }

    getRowTable() {
        let valType = this.props.value.filters.selected.type;
        let orgs = valType === "reset"
            ? this.props.value.filters.organisations
            : this.props.value.filters.organisations.filter(
                x => x.sub_domain === this.props.value.filters.selected.filter.sub_domain
            )
        let org_values = {};
        let list = this.props.value.filters.list;
        orgs = orgs.map((x,i) => {
            let sub_domain = list.find(l => l.id === x.sub_domain);
            let name = x.name + '___' + sub_domain.name + '___' + x.location;
            let value = valType === "reset" ? 1 : x['value_' + valType];
            org_values = {
                ...org_values,
                [name]: org_values[name] === undefined ? value : value + org_values[name]
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
                    org: vars[0],
                    activity: titleCase(vars[1]),
                    location: titleCase(vars[2]),
                    contrib: org_values[val],
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
          },
          {
            name: 'Organisation Name',
            selector: 'org',
            sortable: true,
            right: true,
          },
          {
            name: 'Activity',
            selector: 'activity',
            sortable: true,
            right: true,
          },
          {
            name: 'Location',
            selector: 'location',
            sortable: true,
            right: true,
          },
          {
            name: columnname === "reset" ? "Activity Count" : titleCase(columnname),
            selector: 'contrib',
            sortable: true,
            right: true,
          },
        ];
        return (
            <DataTable
                title={columnname === "reset" ? "All Organisations": titleCase(columnname)}
                columns={columns}
                data={this.getRowTable()}
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tables);
