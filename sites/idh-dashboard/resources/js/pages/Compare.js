import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions';
import { Redirect } from "react-router-dom";
import {
    Row,
    Col,
    Jumbotron,
    InputGroup,
    Card,
    Form,
    FormControl,
    Button,
} from 'react-bootstrap';
import Charts from '../components/Charts.js';
import Cards from '../components/Cards.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { queueApi, getApi } from '../data/api.js';
import { flatFilters, randomVal } from '../data/utils.js';
import { generateData } from "../charts/chart-generator.js";
import intersectionBy from "lodash/intersectionBy";

class Compare extends Component {

    constructor(props) {
        super(props);
        this.renderIndicator = this.renderIndicator.bind(this);
        this.renderTableHeader = this.renderTableHeader.bind(this);
        this.renderSearchItem = this.renderSearchItem.bind(this);
        this.changeSearchItem = this.changeSearchItem.bind(this);
        this.toggleDropDown = this.toggleDropDown.bind(this);
        this.toggleAutoComplete = this.toggleAutoComplete.bind(this);
        this.appendChart = this.appendChart.bind(this);
        this.saveChart = this.saveChart.bind(this);
        this.removeChart = this.removeChart.bind(this);
        this.renderChart = this.renderChart.bind(this);
        this.renderRows = this.renderRows.bind(this);
        this.state = {
            charts: [],
            autocomplete: false,
            searched: [],
            excluded: [1],
            redirect: false,
        };
    }

    renderIndicator() {
        return true;
    }

    toggleDropDown() {
        if (this.state.searched.length > 0) {
            this.setState({searched: []});
            return;
        }
        let source = flatFilters(this.props.value.page.filters);
        source = source.map(x => ({
            ...x,
            name: x.name + " - " + x.company
        }));
        let access = this.props.value.user.forms;
            access = access.map(x => {
                return {...x, id: x.form_id};
            });
            source = intersectionBy(source, access, 'id');
        this.setState({searched: source});
        return;
    }

    toggleAutoComplete(bool) {
        this.setState({autocomplete:true});
    }


    removeDropDown() {
        this.setState({searched:[]})
    }

    changeSearchItem(e) {
        this.setState({searched:[]})
        let keywords = e.target.value.toLowerCase().split(' ');
        let source = flatFilters(this.props.value.page.filters);
        source = source.map(x => ({
            ...x,
            name: x.name + " - " + x.company
        }));
        let access = this.props.value.user.forms;
            access = access.map(x => {
                return {...x, id: x.form_id};
            });
            source = intersectionBy(source, access, 'id');
        let selected = this.props.value.page.compare.items;
        if (selected.length > 0) {
            selected = selected.map(x => x.id);
            source = source.filter(x => !selected.includes(x.id));
        }
        let results = source.map(x => {
            let score = 0;
            let names = x.name.toLowerCase();
            names = names.split(' ');
            names.forEach(x => {
                keywords.forEach(k => {
                    score += x.startsWith(k) ? 1 : 0;
                })
            });
            return {
                ...x,
                score: score
            }
        });
        results = results.filter(x => x.score > 0);
        this.setState({searched: results});
        return;
    }

    appendChart(data, id) {
        let charts = this.state.charts;
            charts = charts.filter(x => x.id !== id);
        charts = [
            ...charts,
            {id:id, data:data}
        ];
        let isAvailable = this.props.value.page.compare.items.find(x => x.id === id);
        if (!isAvailable) {
            this.props.page.compare.additem(id);
        }
        this.setState({charts:charts});
        this.props.page.loading(false);
    }

    saveChart(id) {
        this.props.page.loading(true);
        this.setState({searched:[], autocomplete: false});
        let params = [id];
        let urls = ['compare-data/' + id];
        this.setState({loading:true});
        queueApi(0, urls, 1, this.appendChart ,params);
        return;
    }

    removeChart(id) {
        this.props.page.compare.removeitem(id);
        let charts = this.state.charts.filter(x => x.id !== id);
        this.setState({charts:charts});
    }

    renderSearchItem() {
        let data = this.state.searched;
        let items = this.props.value.page.compare.items;
        data = data.filter(x => !items.find(z => z.id === x.id));
        return data.map((x, i) => {
            return (
                <div
                    onClick={e => this.saveChart(x.id)}
                    className="search-suggest"
                    key={'item-' + x.id}>
                    {x.name}
                </div>
            )
        })
    }

    renderTableHeader() {
        let items = this.props.value.page.compare.items;
        // let width = 'calc(100% / ' + this.state.charts.length  + ')';
        let source = flatFilters(this.props.value.page.filters);
        // let width = 75/source.length+'%';
        let width = 75/this.state.charts.length;
        return items.map((x, i) => {
            return(
                <td width={width} className="first-column header-country" align="center" key={'head-' + x.id}>
                    <Card className="card-compare">
                        <FontAwesomeIcon
                            onClick={e => this.removeChart(x.id)}
                            className="fas-corner fas-delete"
                            color="red"
                            icon={["fas", "times-circle"]} />
                        <Card.Body className="card-compare text-center">
                            <h5>{x.name}</h5>
                        </Card.Body>
                    </Card>
                </td>

                // <div className="chart-div" style={{width:width}} key={'head-' + x.id}>
                //     <Card className="card-compare">
                //         <FontAwesomeIcon
                //             onClick={e => this.removeChart(x.id)}
                //             className="fas-corner fas-delete"
                //             color="red"
                //             icon={["fas", "times-circle"]} />
                //         <Card.Body className="card-compare text-center">
                //             <h5>{x.name}</h5>
                //         </Card.Body>
                //     </Card>
                // </div>
            )
        });
    }

    componentDidMount() {
        const token = localStorage.getItem("access_token");
        if (token === null) {
            this.setState({redirect:true});
        }
        this.props.value.page.compare.items.map(x => {
            this.saveChart(x.id);
        });
    }

    renderChart(id) {
        // if (this.state.redirect) {
        //     return <Redirect to="/login" />;
        //     // return <Redirect to="/not-found" />;
        // }
        // let width = 'calc(100% / ' + this.state.charts.length  + ')';
        let source = flatFilters(this.props.value.page.filters);
        // let width = 75/source.length+'%';
        // let col = 12/source.length;
        let col = 12/this.state.charts.length;
        return this.state.charts.map((c, i) => {
            // let chartlist = c.data.map((x, ix) => {
            //     let cardtype = x.kind === "CARDS" || x.kind === "NUM" || x.kind === "PERCENT";
            //     if (cardtype) {
            //         return (
            //             <Cards
            //                 title={x.title}
            //                 key={'card-' + c.id + '-' + ix}
            //                 kind={x.kind}
            //                 dataset={x.data}
            //                 config={generateData(0, false,  "50vh")}
            //             />
            //         );
            //     };
            //     return (
            //         <Charts
            //             title={x.title}
            //             key={'chart-' + c.id + '-' + ix}
            //             dataset={x.data}
            //             kind={x.kind}
            //             config={generateData(0, false,  "50vh")}
            //         />
            //     );
            // });
            // return (<div key={c.id} className="chart-div" style={{width:width}}>{chartlist.map(x => x)}</div>);

            let tmp = [];
            let cards = ["CARDS", "NUM", "PERCENT"];
            let chartlist = c.data.find(x => x.id === id);
            let cardtype = cards.includes(chartlist.kind);
            
            if (cardtype) {
                let percent = (chartlist.kind === "PERCENT") ? "%" : "";
                let text = chartlist.data + percent;
                tmp.push(
                    <td key={'tdcards-' + c.id + '-' + i} className={"chart-display text-center"}>
                        {/* <Cards
                            title={chartlist.title}
                            key={'card-' + c.id + '-' + i}
                            kind={chartlist.kind}
                            dataset={chartlist.data}
                            config={generateData(col, false, "50vh")}
                        /> */}
                        <h1>{text}</h1>
                    </td>
                );
            } else {
                tmp.push(
                        <td key={'tdcharts-' + c.id + '-' + i} className={"chart-display"}>
                            <Charts
                                title={chartlist.title}
                                key={'chart-' + c.id + '-' + i}
                                dataset={chartlist.data}
                                kind={chartlist.kind}
                                config={generateData(col, false, "50vh")}
                                compare={true}
                            />
                        </td>
                ); 
            }
            return tmp;
        });
    }

    renderRows() {
        if (this.state.charts.length === 0) {
            return;
        }
        let chartlist = this.state.charts[0].data.map((x, ix) => {
            return (
                <tr key={'row-' + ix}>
                    <td className="first-column align-middle">{x.title}</td>
                    {this.renderChart(x.id)}
                </tr>
            ); 
        });
        return chartlist.map(x => x);
    }

    render() {
        let source = flatFilters(this.props.value.page.filters);
        let searchEnabled = this.props.value.page.compare.items.length !== source.length;

        if (this.state.redirect) {
            return <Redirect to="/login" />;
            // return <Redirect to="/not-found" />;
        }

        return (
            <Fragment>
                <div className="page-content">
                    <Row>
                        <Col md={12}>
                            <Form className="form-relative">
                            <InputGroup>
                                <FormControl
                                    onClick={e => this.toggleDropDown()}
                                    disabled={!searchEnabled}
                                    onChange={this.changeSearchItem}
                                    type="text"
                                    placeholder="Type Keywords (e.g. Kenya)"
                                />
                                <InputGroup.Append>
                                    <InputGroup.Text
                                        onClick={e => this.toggleDropDown()}
                                        className={this.state.searched.length > 0
                                        ? "dropdown-select close"
                                        : "dropdown-select"
                                    }>
                                    <FontAwesomeIcon
                                        color={this.state.searched.length > 0 ? "red" : "grey"}
                                        icon={["fas", this.state.searched.length > 0 && searchEnabled
                                            ? "times-circle"
                                            : "chevron-circle-down"
                                        ]} />
                                    </InputGroup.Text>
                                </InputGroup.Append>
                            </InputGroup>
                            {this.state.searched.length !== 0 && searchEnabled ? (
                                <div className="search-item-bar">{this.renderSearchItem()}</div>
                            ) : ""}
                        </Form>
                        </Col>
                        <Col md={12}>
                            <div className="table-wrapper-fixed">
                                <table width={"100%"} className="table-compare">
                                    <thead>
                                        <tr>
                                            <td align="left" width={"20%"} className="first-column"></td>
                                            {this.renderTableHeader()}
                                        </tr>
                                    </thead>
                                    <tbody>{this.renderRows()}</tbody>
                                </table>
                            </div>
                            {/* <Row>
                                {this.renderTableHeader()}
                            </Row>
                            <Row>
                                {this.renderChart()}
                            </Row> */}
                        </Col>
                    </Row>
                </div>
            </Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Compare);
