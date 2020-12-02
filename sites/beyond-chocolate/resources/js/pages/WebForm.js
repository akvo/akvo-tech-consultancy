import React, { useState, useEffect } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    Form,
    Button,
    Modal
} from "react-bootstrap";
import Select, { components } from "react-select";
import request from "../lib/request";
import { DateTime } from "luxon";
import { useAuth } from "../components/auth-context";
import { dsc } from "../static/data-security-content";
import { useLocale } from "../lib/locale-context";
import { ModalDataSecurity } from "../components/Modal";

const ReloadableSelectMenu = props => {
    return (
        <components.Menu {...props}>
            <div>
                {props.selectProps.fetchingData ? (
                    <div className="fetching p-2">Fetching data...</div>
                ) : (
                    <>
                        <div>{props.children}</div>
                        <Button
                            variant="link"
                            className="reload-data"
                            onClick={props.selectProps.reload}
                        >
                            Refresh
                        </Button>
                    </>
                )}
            </div>
        </components.Menu>
    );
};

const SavedFormsSelector = ({ user, onSelect, watchValue }) => {
    const [available, setAvailable] = useState([]);
    const [selected, setSelected] = useState();
    const [value, setValue] = useState();
    const [fetchingData, setFetchingData] = useState(false);
    const onSubmit = () => {
        onSelect(`${selected.url}?user_id=${user.id}`);
    };
    const onChange = savedForm => {
        const form = available.find(f => f.url === savedForm.value);
        setSelected(form);
        setValue(savedForm);
    };
    const formatLabel = option => {
        return (
            <div className="d-flex savedFromGrid">
                <div className="flex-fill savedFromGrid--name">
                    {option.submission_name}
                </div>
                <div className="flex-fill  savedFromGrid--email">
                    {option.submitter}
                </div>
                <div className="flex-fill savedFromGrid--date">
                    {DateTime.fromISO(option.date).toFormat("dd/LL/yyyy")}
                </div>
                <div className="flex-fill  savedFromGrid--type">
                    {option.survey_name}
                </div>
            </div>
        );
    };
    const loadData = async () => {
        const { data } = await request().get("/api/me/saved-surveys");
        setAvailable(data);
    };
    const reload = e => {
        e.preventDefault();
        setFetchingData(true);
        setTimeout(async () => {
            await loadData();
            setFetchingData(false);
        }, 300);
    };

    useEffect(async () => {
        await loadData();
    }, []);

    useEffect(() => {
        // Clear value if other form is active
        if (!selected) return;
        if (`${selected.url}?user_id=${user.id}` != watchValue) {
            setValue(null);
        }
    }, [watchValue]);

    useEffect(() => {
        // Fill in value from the previous session
        if (selected || !watchValue || available.length < 1) return;
        const form = available.find(
            f => `${f.url}?user_id=${user.id}` === watchValue
        );
        if (form) {
            setSelected(form);
            setValue({ ...form, value: form.url });
        }
    }, [watchValue, available]);

    return (
        <div className="savedForms">
            <Row>Pick a previously saved forms</Row>
            <Row>
                <Form inline>
                    <div className="mb-2 mr-sm-2 selectContainer">
                        <Select
                            components={{ Menu: ReloadableSelectMenu }}
                            value={value}
                            options={available.map(opt => ({
                                ...opt,
                                value: opt.url
                            }))}
                            formatOptionLabel={formatLabel}
                            onChange={onChange}
                            fetchingData={fetchingData}
                            reload={reload}
                        />
                    </div>
                    <Button className="mb-2" onClick={onSubmit}>
                        Open
                    </Button>
                </Form>
            </Row>
        </div>
    );
};

const NewFormSelector = ({ user, onSelect, watchValue }) => {
    const [available, setAvailable] = useState([]);
    const [selected, setSelected] = useState();
    const [value, setValue] = useState();
    const onSubmit = () => {
        onSelect(`${selected.url}?user_id=${user.id}`);
    };
    const onChange = data => {
        const form = available.find(f => f.name === data.value);
        setSelected(form);
        setValue(data);
    };

    useEffect(async () => {
        const { data } = await request().get("/api/me/surveys");
        setAvailable(data);
    }, []);

    useEffect(() => {
        // Clear value if other form is active
        if (!selected) return;
        if (`${selected.url}?user_id=${user.id}` != watchValue) {
            setValue(null);
        }
    }, [watchValue]);

    useEffect(() => {
        // Fill in value from the previous session
        if (selected || !watchValue || available.length < 1) return;
        const form = available.find(
            f => `${f.url}?user_id=${user.id}` === watchValue
        );
        if (form) {
            setSelected(form);
            setValue({ value: form.name, label: form.title });
        }
    }, [watchValue, available]);

    return (
        <div className="newForms">
            <Row>Start filling a new form</Row>
            <Row>
                <Form inline>
                    <div className="mb-2 mr-sm-2 selectContainer">
                        <Select
                            value={value}
                            onChange={onChange}
                            options={available.map(f => ({
                                value: f.name,
                                label: f.title
                            }))}
                        />
                    </div>
                    <Button className="mb-2" onClick={onSubmit}>
                        Open
                    </Button>
                </Form>
            </Row>
        </div>
    );
};

const WebForm = () => {
    const { user } = useAuth();
    const [activeForm, setActiveForm] = useState();
    const onSelectForm = form => {
        setActiveForm(form);
        localStorage.setItem(`active-form:${user.id}`, form);
    };

    useEffect(() => {
        // open form from previous session
        const form = localStorage.getItem(`active-form:${user.id}`);
        setActiveForm(form);
    }, []);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const { locale } = useLocale();

    return (
        <Container fluid>
            <Row>
                <Col md={12}>
                    <div className="d-flex">
                        <div className="p-2 flex-grow-1">
                            <SavedFormsSelector
                                user={user}
                                onSelect={onSelectForm}
                                watchValue={activeForm}
                            />
                        </div>
                        <div className="p-2 pr-3">
                            <NewFormSelector
                                user={user}
                                onSelect={onSelectForm}
                                watchValue={activeForm}
                            />
                        </div>
                    </div>
                    <hr />
                    <p className="pl-3 text-muted">
                        <a onClick={handleShow} href="#">Data security provisions</a> for the data that will be submitted as part of this survey
                    </p>
                    <Card>
                        {activeForm && (
                            <iframe
                                frameBorder="0"
                                style={{ height: "100vh", width: "100%" }}
                                src={activeForm}
                            />
                        )}
                    </Card>
                    <ModalDataSecurity
                        show={show}
                        handleClose={handleClose}
                        locale={locale}
                        data={dsc}
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default WebForm;
