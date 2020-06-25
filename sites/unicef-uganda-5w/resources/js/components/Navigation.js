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

class Navigation extends Component {
    constructor(props) {
        super(props);
        this.changePage = this.changePage.bind(this);
        this.state = {
            active: 'overviews'
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
                      src={`${process.env.MIX_PUBLIC_URL}/images/logo-unicef.jpg`}
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
                    <Nav.Link eventKey="activities" active={"activities" === page}>Activities</Nav.Link>
                </Nav>
                <Form inline className='nav-right'>
                  <a
                      href="https://github.com/akvo/akvo-tech-consultancy"
                      className="nav-top-links"
                      target="_blank"
                  >
                      <i className="fa fa-book"></i> Documentation
                  </a>
                </Form>
              </Navbar.Collapse>
              </Container>
            </Navbar>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
