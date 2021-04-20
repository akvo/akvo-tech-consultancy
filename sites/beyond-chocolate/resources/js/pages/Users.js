import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faCheck } from "@fortawesome/free-solid-svg-icons";
import {
    Container,
    Row,
    Col,
    Table,
    Pagination,
    Card,
    Form,
    Button
} from "react-bootstrap";
import Select from "react-select";
import * as qs from "query-string";
import useForm, { Controller } from "../lib/use-form";
import request from "../lib/request";
import authApi from "../services/auth";
import emailApi from "../services/email";
import { useAuth } from "../components/auth-context";
import { useLocale, questionnaire } from "../lib/locale-context";
import { uiText } from "../static/ui-text";
import { ModalWarning } from "../components/Modal";
import { DateTime } from "luxon";

const PAGINATION_OFFSET = 4;

const pagesNumbers = config => {
    if (!config.to) {
        return [];
    }
    let from = config.currentPage - PAGINATION_OFFSET;
    if (from < 1) {
        from = 1;
    }
    let to = from + PAGINATION_OFFSET * 2;
    if (to >= config.lastPage) {
        to = config.lastPage;
    }
    let pages = [];
    for (let page = from; page <= to; page++) {
        pages.push(page);
    }
    return pages;
};

const mapQuestionnaireToOption = (qs) => {
    // return qs.length ? qs.map(q => ({ value: q.name, label: q.title })) : [];
    if (qs.length === 0) {
        return [];
    }
    let res = qs.map(q => {
        let title = questionnaire[q.name];
        return { value: q.name, label: title }
    });
    return res;
};

const Paging = ({ onChangePage, ...config }) => {
    const pages = pagesNumbers(config);

    const goToPage = page => {
        return () => {
            onChangePage(page);
        };
    };

    return pages.length > 1 ? (
        <Pagination size="sm">
            <Pagination.First
                disabled={1 === config.currentPage}
                onClick={goToPage(1)}
            />
            <Pagination.Prev
                disabled={1 === config.currentPage}
                onClick={goToPage(config.currentPage - 1)}
            />
            {pages.map(num => (
                <Pagination.Item
                    key={num}
                    active={config.currentPage === num}
                    onClick={goToPage(num)}
                >
                    {num}
                </Pagination.Item>
            ))}
            <Pagination.Next
                disabled={config.lastPage === config.currentPage}
                onClick={goToPage(config.currentPage + 1)}
            />
            <Pagination.Last
                disabled={config.lastPage === config.currentPage}
                onClick={goToPage(config.lastPage)}
            />
        </Pagination>
    ) : (
        <></>
    );
};

const Users = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [questionnaires, setQuestionnaires] = useState([]);
    const [selected, setSelected] = useState();
    const [modalState, showModal] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const [pagination, setPagination] = useState({
        currentPage: 1,
        from: 1,
        lastPage: 1,
        perPage: 5,
        to: 1,
        total: 1
    });
    const [orgs, setOrgs] = useState([]);
    const [emailSent, setEmailSent] = useState(false);
    const [selectedOrgs, setSelectedOrgs] = useState({value:false, label:"", error: false});
    const {
        register,
        control,
        handleSubmit,
        errors,
        setServerErrors,
        formState: { isDirty }
    } = useForm();
    const { user: admin } = useAuth();

    const { locale } = useLocale();
    let text = uiText[locale.active];

    useEffect(() => {
        setSelectedOrgs({value:selected?.organization_id || false, error: false})
        setEmailSent(false);
    }, [selected]);


    const fetchUsers = async page => {
        const url = qs.stringifyUrl({
            url: "/api/users",
            query: { page: page }
        });
        const response = await request().get(url);
        // check user last activity
        if (response.data.last_activity === null) {
            // reload page
            window.location.reload();
            return;
        }
        let data = response.data.data;
        const pagination = {
            currentPage: parseInt(data.current_page),
            from: parseInt(data.from),
            lastPage: parseInt(data.last_page),
            perPage: parseInt(data.per_page),
            to: parseInt(data.to),
            total: parseInt(data.total)
        };
        if (pagination.currentPage > pagination.lastPage) {
            return await fetchUsers(pagination.lastPage);
        }
        setSelected(null);
        setUsers(data.data);
        setPagination(pagination);
        return response;
    };
    const fetchRoles = async () => {
        const { data } = await request().get("/api/roles");
        setRoles(data);
    };
    const fetchQuestionnaires = async () => {
        const { data } = await request().get("/api/questionnaires");
        setQuestionnaires(mapQuestionnaireToOption(data));
    };
    const setPage = page => {
        fetchUsers(page);
    };

    const onSelectUser = user => {
        if (isDirty) {
            setModalContent(`${text.textUnsavedChanges}: ${selected.name} (${selected.email})`);
            showModal(true);
            return;
        };
        setSelected(null);
        setTimeout(() => {
            setSelected(user);
        }, 0);
    };

    const hideModal = () => {
        showModal(false);
    }

    const saveUser = async ({ id, ...data }) => {
        if (!selectedOrgs.value) {
            setSelectedOrgs({ ...selectedOrgs, error: true});
            return;
        }
        data = { ...data, organization_id: selectedOrgs.value };
        const questionnaires = data.questionnaires?.length
            ? data.questionnaires.map(q => q.value)
            : null;
        try {
            await request().patch(`/api/users/${id}`, {
                ...data,
                questionnaires
            });
            fetchUsers(pagination.currentPage).then(res => {
                const current = res.data.data.data.find(x => x.id === selected.id);
                setSelected(current);
            });
        } catch (e) {
            if (e.status === 422) {
                setServerErrors(e.errors);
            } else {
                throw e;
            }
        }
    };
    const deleteUser = async user => {
        await request().delete(`/api/users/${user.id}`);
        fetchUsers(pagination.currentPage);
        setSelected(null);
    };
    const informUser = async user => {
        const subject = 'Surveys assigned';
        const questionnaires = user.questionnaires.map(q => q.title)
        const adminName = admin?.name;
        const adminOrg = orgs.find(it => it.id === admin.organization_id)?.name
        try {
            let sendData = {
                email: user.email,
                name: user.name,
                questionnaires,
                subject,
                adminName,
                adminOrg,
            }
            let res = await emailApi.informUser(sendData);
            if (res.status == 200) {
                setEmailSent(true);
            }
        } catch (e) {
            if (e.status === 422 || e.status === 429) {
                setServerErrors(e.errors);
            } else {
                throw e;
            }
        }
    }
    const displayUserSurveys = user => {
        const count = user.questionnaires.length;
        return count >= questionnaires.length ||
            user.role.permissions.includes("manage-surveys")
            ? "All"
            : count.toString();
    };

    const fetchOrgs = async () => {
        let res = await authApi.getOrganizations();
        setOrgs(res.data);
    }

    const renderOrganizations = organizations => {
        return organizations.map(x => {
            return { value: x.id, label: x.name };
        });
    };

    const renderDefaultQuestionnaire = data => {
        if (data.length === 0) {
            return [];
        }
        let res = mapQuestionnaireToOption(data);
        res = res.map(x => ({ value: x.value, label: x.label[locale.active] }));
        return res;
    }

    useEffect(async () => {
        await Promise.all([fetchUsers(1), fetchRoles(), fetchQuestionnaires(), fetchOrgs()]);
    }, []);

    return (
        <Container fluid className="usersTab">
            <Row>
                <Col md={8} className="well">
                    <Table className="users-table">
                        <thead>
                            <tr>
                                <th>{ text.tbColName }</th>
                                <th>{ text.tbColEmail }</th>
                                <th>{ text.tbColVerifiedOn }</th>
                                <th>{ text.tbColSecretariats }</th>
                                <th>{ text.tbColOrganization }</th>
                                <th>{ text.tbColRole }</th>
                                <th>{ text.tbColSurveys }</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users &&
                                users.map(user => {

                                    let secretariats = user.organization.secretariats.map(x => { return (<div class='secretariat'>{x.name}</div>);});
                                    let orgSuffix = (user.organization.parents !== null)
                                        ? " (" + user.organization.parents.name + ")"
                                        : "";
                                    let verifiedOn = (user.email_verified_at !== null)
                                        ? DateTime.fromISO(user.email_verified_at).toFormat("dd/LL/yyyy 'at' HH:mm")
                                        : " - ";
                                    return (
                                        <tr
                                            key={user.id}
                                            onClick={() => onSelectUser(user)}
                                            className={
                                                selected?.id === user.id
                                                    ? "active"
                                                    : ""
                                            }
                                        >
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>{verifiedOn}</td>
                                            <td>{secretariats}</td>
                                            <td>{user.organization.name + orgSuffix}</td>
                                            <td>{user.role?.name}</td>
                                            <td className="text-right">
                                                {displayUserSurveys(user)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            {users.length < 1 && (
                                <tr>
                                    <td colSpan={2}>
                                        { text.tbRowNoRecords }
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                    <Paging onChangePage={setPage} {...pagination} />
                </Col>
                <Col md={4}>
                    {selected && (
                        <Form onSubmit={handleSubmit(saveUser)}>
                        <Card style={{backgroundColor: "white"}}>
                                <Card.Body>
                                    <div className="d-flex">
                                        <Button
                                            className="ml-auto p-2 close"
                                            onClick={() => setSelected(null)}
                                        > <span>{ text.btnClose }</span>
                                            <FontAwesomeIcon
                                                icon={faTimes}
                                            />
                                        </Button>
                                    </div>
                                    <input
                                        type="hidden"
                                        name="id"
                                        ref={register}
                                        value={selected.id}
                                    />
                                    <Form.Group
                                        as={Row}
                                        controlId="formPlaintextName"
                                    >
                                        <Form.Label column sm={4}>
                                            { text.tbColName }
                                        </Form.Label>
                                        <Col sm={8}>
                                            <Form.Control
                                                type="text"
                                                name="name"isInvalid={!!errors.name}
                                                ref={register({
                                                    required: text.valName
                                                })}
                                                defaultValue={selected.name}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {!!errors.name && errors.name.message}
                                            </Form.Control.Feedback>
                                        </Col>
                                    </Form.Group>
                                    <Form.Group
                                        as={Row}
                                        controlId="formPlaintextEmail"
                                    >
                                        <Form.Label column sm={4}>
                                            { text.tbColEmail }
                                        </Form.Label>
                                        <Col sm={8}>
                                            <Form.Control
                                                // plaintext
                                                readOnly
                                                defaultValue={selected.email}
                                            />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group
                                        as={Row}
                                        controlId="formPlaintextOrganization"
                                    >
                                        <Form.Label column sm={4}>
                                            { text.tbColOrganization }
                                        </Form.Label>
                                        <Col sm={8}>
                                            <Select
                                                defaultValue={{
                                                    value: selected.organization_id,
                                                    label: orgs.find(x => x.id === selected.organization_id)['name']
                                                }}
                                                onChange={opt => setSelectedOrgs(opt)}
                                                options={renderOrganizations(orgs)}
                                            />
                                            { selectedOrgs.error ? (
                                                <Form.Text className="text-danger">
                                                    { text.valOrganization }
                                                </Form.Text>
                                                ) : ""}
                                        </Col>
                                    </Form.Group>

                                    <Form.Group
                                        as={Row}
                                        controlId="formPlaintextPassword"
                                    >
                                        <Form.Label column sm={4}>
                                            { text.tbColRole }
                                        </Form.Label>
                                        <Col sm={8}>
                                            <Form.Control
                                                as="select"
                                                name="role"
                                                defaultValue={
                                                    selected.role?.key
                                                }
                                                isInvalid={!!errors.role}
                                                ref={register}
                                            >
                                                {roles.map(role => (
                                                    <option
                                                        key={role.key}
                                                        value={role.key}
                                                    >
                                                        {role.name}
                                                    </option>
                                                ))}
                                            </Form.Control>
                                            <Form.Control.Feedback type="invalid">
                                                {!!errors.role &&
                                                    errors.role.message}
                                            </Form.Control.Feedback>
                                        </Col>
                                    </Form.Group>
                                    <hr />
                                    <Form.Group>
                                        <Form.Label>{ text.formQuestionnaire }</Form.Label>
                                        <Controller
                                            as={Select}
                                            name="questionnaires"
                                            isMulti
                                            control={control}
                                            defaultValue={renderDefaultQuestionnaire(selected.questionnaires)}
                                            options={questionnaires.map(x => ({value: x.value, label: x.label[locale.active]}))}
                                        />
                                    </Form.Group>
                                </Card.Body>
                                <Card.Footer>
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        className="mr-2"
                                    >
                                        { text.btnSaveChanges }
                                    </Button>
                                    <Button
                                        variant="danger"
                                        className="mr-2"
                                        onClick={() => deleteUser(selected)}
                                    >
                                        { text.btnDeleteUser }
                                    </Button>
                                    <Button
                                        variant={isDirty || selected?.questionnaires?.length === 0
                                            ? "secondary"
                                            : "success"
                                        }
                                        className="mr-2"
                                        disabled={isDirty || !selected?.email_verified_at || selected?.questionnaires?.length === 0}
                                        onClick={() => informUser(selected)}
                                    >
                                        { text.btnInformUser }
                                      {emailSent && <FontAwesomeIcon className="ml-2" icon={faCheck} />}
                                    </Button>
                                </Card.Footer>
                                {!selected?.email_verified_at ? (
                                <Card.Footer>
                                    <b>{selected?.email}</b> { text.textEmailNotVerifiedYet}
                                </Card.Footer>
                                ) : ""}
                            </Card>
                        </Form>
                    )}
                </Col>
            </Row>
            <ModalWarning show={modalState} text={text} content={modalContent} handleClose={hideModal}/>
        </Container>
    );
};

export default Users;
