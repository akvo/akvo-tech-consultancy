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

class Navigation extends Component {
    constructor(props) {
        super(props);
        this.changePage = this.changePage.bind(this);
        this.state = {
            active: 'home'
        }
        this.links = this.links.bind(this);
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
                    <Nav.Link eventKey="actions" active={"actions" === page}>Actions</Nav.Link>
                    <Nav.Link eventKey="funding" active={"funding" === page}>Overview</Nav.Link>
                    <Nav.Link eventKey="stakeholder" active={"Stakeholder" === page}>Stakeholder</Nav.Link>
                    <Nav.Link eventKey="evaluation" active={"evaluation" === page}>Evaluation</Nav.Link>
                    <Nav.Link eventKey="drivers" active={"drivers" === page}>Drivers and Barriers</Nav.Link>
                    <Nav.Link eventKey="partnership" active={"partnership" === page}>Partnerships</Nav.Link>
                </Nav>
                <Form inline className='nav-right'>
                  <a
                      className="btn btn-sm btn-primary text-white"
                      href="https://github.com/akvo/akvo-tech-consultancy"
                      target="_blank"
                  >
                      <FontAwesomeIcon icon={["fas", "arrow-circle-down"]} /> Resources
                  </a>
                </Form>
              </Navbar.Collapse>
              </Container>
            </Navbar>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
