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
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios';


const API = process.env.MIX_PUBLIC_URL + "/api/";

class Navigation extends Component {
    constructor(props) {
        super(props);
        this.changePage = this.changePage.bind(this);
        this.state = {
            active: 'home'
        }
        this.links = this.links.bind(this);
        this.downloadReport = this.downloadReport.bind(this);
    }

    changePage (key) {
        window.scrollTo(0, 0)
        this.props.page.change(key);
        this.setState({
            active: this.props.value.page.name
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

    downloadReport () {
        axios({
            method: 'post',
            url: API + 'download',
            data: {
                filters: this.props.value.data.filters,
                countries: this.props.value.data.countries,
                countrygroups: this.props.value.data.countrygroups,
            }
        }).then(res => {
            console.log(res.data);
        }).catch(err => {
            console.log("internal server error");
        });
    }

    render() {
        let page = this.props.value.page.name;
        return (
            <Navbar bg="light" fixed="top" variant="light" className="NavLight" expand="lg">
              <Container>
              <Navbar.Brand href="#home">
                  <Image
                      src={`${process.env.MIX_PUBLIC_URL}/images/logo-unep.png`}
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
                    <Nav.Link eventKey="actions" active={"actions" === page}>Type of Actions</Nav.Link>
                    <Nav.Link eventKey="funding" active={"funding" === page}>Funding</Nav.Link>
                    <Nav.Link eventKey="stakeholder" active={"Stakeholder" === page}>Stakeholder</Nav.Link>
                    <Nav.Link eventKey="evaluation" active={"evaluation" === page}>Evaluation</Nav.Link>
                    <Nav.Link eventKey="drivers" active={"drivers" === page}>Drivers and Barriers</Nav.Link>
                    <Nav.Link eventKey="partnership" active={"partnership" === page}>Partnerships</Nav.Link>
                </Nav>
                    <Form.Group
                        className="nav-right"
                        onChange={this.props.data.toggle.global}
                        controlId="formGroupGlobal">
                    <Form.Check
                        type="switch"
                        defaultChecked={this.props.value.data.global}
                        label="Global"
                      />
                    </Form.Group>
                    <Form.Group
                        className="nav-right"
                        onChange={this.props.page.toggle.keepfilter}
                        controlId="formGroupSwitch">
                    <Form.Check
                        type="switch"
                        defaultChecked={this.props.value.page.keepfilter}
                        label="Keep Filter"
                      />
                    </Form.Group>
                    <button
                        className="btn btn-small btn-primary btn-download"
                        onClick={e => this.downloadReport()}
                    >
                    <FontAwesomeIcon
                        className="fas-icon"
                        icon={["fas", "arrow-circle-down"]} />
                        Download
                    </button>
              </Navbar.Collapse>
              </Container>
            </Navbar>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
