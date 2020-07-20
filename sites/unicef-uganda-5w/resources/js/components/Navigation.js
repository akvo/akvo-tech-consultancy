import React, { Component } from 'react';
import { redux } from 'react-redux';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions';
import {
    Navbar,
    Nav,
    Container,
    Image,
    Form,
    Button,
    ListGroup
} from 'react-bootstrap';
import axios from 'axios';
import sumBy from 'lodash/sumBy';

const prefixPage = process.env.MIX_PUBLIC_URL + "/api/";

class Navigation extends Component {
    constructor(props) {
        super(props);
        this.changePage = this.changePage.bind(this);
        this.state = {
            active: 'overviews',
            covid: []
        }
        this.links = this.links.bind(this);
        this.getCovidList = this.getCovidList.bind(this);
    }

    changePage (key) {
        window.scrollTo(0, 0)
        this.props.page.change(key);
        this.setState({
            active: this.props.value.page.name,
        });
        return true;
    }

    links (data, page) {
        return data.map((x, id) => {
            let active = x === page ? true : false;
            return (
                <Nav.Link key={id} eventKey={name} active={active}>{x}</Nav.Link>
            )
        });
    }

    componentDidMount() {
        if (localStorage.getItem('covid') === null){
            axios.get(prefixPage + 'covid').then((res) => {
                for (let l in res.data){
                    this.setState({
                        covid: [...this.state.covid, {name: l, value: res.data[l]}]
                    });
                    localStorage.setItem('covid', JSON.stringify(this.state.covid));
                }
            });
        } else {
            let covid_data = JSON.parse(localStorage.getItem('covid'));
            this.setState({covid: covid_data});
        }
    }

    getCovidList() {
        if (this.state.covid.length === 0) {
            return (
                <ListGroup.Item variant="light">Loading Data...</ListGroup.Item>
            )
        }
        return this.state.covid.map((x,i) => (
            <ListGroup.Item key={i} variant="light">
            {x.name}: <span className={"text-" + x.name.toLowerCase()}>{x.value}</span>
            </ListGroup.Item>
        ))
    }

    render() {
        let page = this.props.value.page.name;
        return (
            <Navbar bg="light" fixed="top" variant="light" className="NavLight" expand="lg">
              <Container>
              <Navbar.Brand href="#home">
                  <Image
                      src={`${process.env.MIX_PUBLIC_URL}/images/logo-unicef-sdg.jpg`}
                      height="38px"
                  />
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav
                    className="mr-auto"
                    activeKey={this.props.value.page.name}
                    onSelect={this.changePage}
                >
                    <Nav.Link eventKey="overviews" active={"overviews" === page}>Overviews</Nav.Link>
                    <Nav.Link eventKey="activities" active={"activities" === page}>Partnerships</Nav.Link>
                    <Nav.Link eventKey="webform" active={"webform" === page}>Webform</Nav.Link>
                </Nav>
                <Form inline className='nav-right'>
                    <a
                    href="https://gisservices.maps.arcgis.com/apps/MapSeries/index.html?appid=62dfd0bf95bd4020a620a9ff24e44df9"
                        className="nav-top-links"
                        target="_blank"
                    >
                        <i className="fa fa-rss"></i> Covid-19 Cases
                    </a>
                <ListGroup horizontal='sm'>{this.getCovidList()}</ListGroup>
                </Form>
              </Navbar.Collapse>
              </Container>
            </Navbar>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
