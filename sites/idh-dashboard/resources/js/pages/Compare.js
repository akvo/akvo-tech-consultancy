import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../reducers/actions";
import { Row, Col, Jumbotron, InputGroup, Card, Form, FormControl, Button } from "react-bootstrap";
import Charts from "../components/Charts.js";
import Cards from "../components/Cards.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { queueApi, getApi } from "../data/api.js";
import { flatFilters, randomVal } from "../data/utils.js";
import { generateData } from "../charts/chart-generator.js";

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
        this.state = {
            charts: [],
            autocomplete: false,
            searched: [],
            excluded: [1],
        };
    }

    renderIndicator() {
        return true;
    }

    toggleDropDown() {
        if (this.state.searched.length > 0) {
            this.setState({ searched: [] });
            return;
        }
        let source = flatFilters(this.props.value.page.filters);
        this.setState({ searched: source });
        return;
    }

    toggleAutoComplete(bool) {
        this.setState({ autocomplete: true });
    }

    removeDropDown() {
        this.setState({ searched: [] });
    }

    changeSearchItem(e) {
        this.setState({ searched: [] });
        let keywords = e.target.value.toLowerCase().split(" ");
        let source = flatFilters(this.props.value.page.filters);
        let selected = this.props.value.page.compare.items;
        if (selected.length > 0) {
            selected = selected.map((x) => x.id);
            source = source.filter((x) => !selected.includes(x.id));
        }
        let results = source.map((x) => {
            let score = 0;
            let names = x.name.toLowerCase();
            names = names.split(" ");
            names.forEach((x) => {
                keywords.forEach((k) => {
                    score += x.startsWith(k) ? 1 : 0;
                });
            });
            return {
                ...x,
                score: score,
            };
        });
        results = results.filter((x) => x.score > 0);
        this.setState({ searched: results });
        return;
    }

    appendChart(data, id) {
        let charts = this.state.charts;
        charts = charts.filter((x) => x.id !== id);
        charts = [...charts, { id: id, data: data }];
        let isAvailable = this.props.value.page.compare.items.find((x) => x.id === id);
        if (!isAvailable) {
            this.props.page.compare.additem(id);
        }
        this.setState({ charts: charts });
        this.props.page.loading(false);
    }

    saveChart(id) {
        this.props.page.loading(true);
        this.setState({ searched: [], autocomplete: false });
        let params = [id];
        let urls = ["compare-data/" + id];
        this.setState({ loading: true });
        queueApi(0, urls, 1, this.appendChart, params);
        return;
    }

    removeChart(id) {
        this.props.page.compare.removeitem(id);
        let charts = this.state.charts.filter((x) => x.id !== id);
        this.setState({ charts: charts });
    }

    renderSearchItem() {
        let data = this.state.searched;
        let items = this.props.value.page.compare.items;
        data = data.filter((x) => !items.find((z) => z.id === x.id));
        return data.map((x, i) => {
            return (
                <div onClick={(e) => this.saveChart(x.id)} className="search-suggest" key={"item-" + x.id}>
                    {x.name}
                </div>
            );
        });
    }

    renderTableHeader() {
        let items = this.props.value.page.compare.items;
        let width = "calc(100% / " + this.state.charts.length + ")";
        return items.map((x, i) => {
            return (
                <div className="chart-div" style={{ width: width }} key={"head-" + x.id}>
                    <Card className="card-compare">
                        <FontAwesomeIcon
                            onClick={(e) => this.removeChart(x.id)}
                            className="fas-corner fas-delete"
                            color="red"
                            icon={["fas", "times-circle"]} />
                        <Card.Body className="card-compare text-center">
                            <h5>{x.name}</h5>
                        </Card.Body>
                    </Card>
                </div>
            );
        });
    }

    componentDidMount() {
        this.props.value.page.compare.items.map((x) => {
            this.saveChart(x.id);
        });
    }

    renderChart() {
        let width = "calc(100% / " + this.state.charts.length + ")";
        return this.state.charts.map((c, i) => {
            let chartlist = c.data.map((x, ix) => {
                let cardtype = x.kind === "CARDS" || x.kind === "NUM" || x.kind === "PERCENT";
                if (cardtype) {
                    return <Cards
                        identifier={c.id + "-" + x.kind + "-" + ix}
                        title={x.title}
                        key={"card-" + c.id + "-" + ix}
                        kind={x.kind}
                        dataset={x.data}
                        description={x.description}
                        config={generateData(0, false, "50vh")}
                    />;
                }
                return <Charts
                    identifier={c.id + "-" + x.kind + "-" + ix}
                    title={x.title}
                    key={"chart-" + c.id + "-" + ix}
                    dataset={x.data}
                    kind={x.kind}
                    config={generateData(0, false, "50vh")} />;
            });
            return (
                <div key={c.id} className="chart-div" style={{ width: width }}> {chartlist.map((x) => x)} </div>;
        });
    }

    render() {
        let source = flatFilters(this.props.value.page.filters);
        let searchEnabled = this.props.value.page.compare.items.length !== source.length;
        let searched = this.state.searched;
        return (
            <>
                <div className="page-content">
                    <Row>
                        <Col md={12}>
                            <Form className="form-relative">
                                <InputGroup>
                                    <FormControl
                                        onClick={(e) => this.toggleDropDown()}
                                        disabled={!searchEnabled}
                                        onChange={this.changeSearchItem}
                                        type="text"
                                        placeholder="Type Keywords (e.g. Kenya)" />
                                    <InputGroup.Append>
                                        <InputGroup.Text
                                                onClick={(e) => this.toggleDropDown()}
                                                className={searched.length > 0 ? "dropdown-select close" : "dropdown-select"}>
                                            <FontAwesomeIcon
                                                color={searched.length > 0 ? "red" : "grey"}
                                                icon={["fas", searched.length > 0 && searchEnabled ? "times-circle" : "chevron-circle-down"]} />
                                        </InputGroup.Text>
                                    </InputGroup.Append>
                                </InputGroup>
                                {searched.length !== 0 && searchEnabled ? <div className="search-item-bar">{this.renderSearchItem()}</div> : ""}
                            </Form>
                        </Col>
                        <Col md={12}>
                            <Row>{this.renderTableHeader()}</Row>
                            <Row>{this.renderChart()}</Row>
                        </Col>
                    </Row>
                </div>
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Compare);
