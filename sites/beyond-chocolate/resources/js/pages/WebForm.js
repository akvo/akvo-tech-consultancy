import React, { useState, useEffect } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    Form,
    Button,
    Modal, 
    ButtonGroup, 
    Spinner, 
    Alert
} from "react-bootstrap";
import Select, { components } from "react-select";
import request from "../lib/request";
import { DateTime } from "luxon";
import { useAuth } from "../components/auth-context";
import { dsc } from "../static/data-security-content";
import { useLocale, questionnaire } from "../lib/locale-context";
import { ModalDataSecurity, SaveFormModal } from "../components/Modal";
import { wfc } from "../static/webform-content";
import { uiText } from "../static/ui-text";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSyncAlt, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { filter } from "lodash";
import authApi from "../services/auth";
import { Fragment } from "react";

const ReloadableSelectMenu = props => {
    const { locale } = useLocale();
    let text = uiText[locale.active];

    return (
        <components.Menu {...props}>
            <div>
                {props.selectProps.fetchingData ? (
                    <div className="fetching p-2">{text.valFetchingData}...</div>
                ) : (
                    <>
                        <div>{props.children}</div>
                        {/* <Button
                            variant="link"
                            className="reload-data"
                            onClick={props.selectProps.reload}
                        >
                            { text.btnRefresh }
                        </Button> */}
                    </>
                )}
            </div>
        </components.Menu>
    );
};

const SavedFormsSelector = ({ text, user, onSelect, watchValue, setConfirmAction, setShowSavePrompt }) => {
    const [available, setAvailable] = useState([]);
    const [selected, setSelected] = useState();
    const [value, setValue] = useState();
    const [fetchingData, setFetchingData] = useState(false);
    const [loadingSelect, setLoadingSelect] = useState(false);
    const [disableBtnCollaborator, setdisableBtnCollaborator] = useState(true);

    const onSubmit = () => {
        if (!selected) return;
        setShowSavePrompt(false);
        // const url = `${selected.url}?user_id=${user.id}`;
        const url = `${selected.url}?user_id=${user.hash}`;
        onSelect({ url, type: null, webForm:selected });
    };
    const promptSave = (e) => {
        if (!selected) return;
        if (!watchValue) {
            onSubmit();
            return;
        }
        setConfirmAction(() => onSubmit);
        setShowSavePrompt(true);
    };
    const onChange = savedForm => {
        const form = available.find(f => f.url === savedForm.value);
        // check btn collaborator enabled by project questionnaire & the user assign was from same organization with the questionnaire
        (user.project_fids.some(id => savedForm.value.includes(id)) && user?.organization_id === savedForm?.org_id)
            ? setdisableBtnCollaborator(false) : setdisableBtnCollaborator(true);
        setSelected(form);
        setValue(savedForm);
    };
    const formatLabel = option => {
        return (
            <div className="savedFromGrid">
                <div className="d-flex">
                    <div className="flex-fill savedFromGrid--name">
                        {option.submission_name || option.org_name}
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
            </div>
        );
    };
    const loadData = async () => {
        const { data } = await request().get("/api/me/saved-surveys");
        // check user last activity
        if (data.last_activity === null) {
            // reload page
            window.location.reload();
            return;
        }
        // set selected form value btn reload
        if (typeof selected !== 'undefined') {
            const updatedSelected = data.data.find(f => f.url === value.value);
            let updatedValue = {...updatedSelected, value: value.value }
            setSelected(updatedSelected);
            setValue(updatedValue);
        }
        setAvailable(data.data);
    };
    const reload = e => {
        setLoadingSelect(true);
        e.preventDefault();
        setFetchingData(true);
        setTimeout(async () => {
            await loadData();
            setFetchingData(false);
            setLoadingSelect(false);
        }, 300);
    };

    useEffect(async () => {
        await loadData();
    }, []);

    useEffect(() => {
        // Clear value if other form is active
        if (!selected) return;
        // if (!watchValue.startsWith(`${selected.url}?user_id=${user.id}`)) {
        if (!watchValue.startsWith(`${selected.url}?user_id=${user.hash}`)) {
            setValue(null);
        }
    }, [watchValue]);

    useEffect(() => {
        // Fill in value from the previous session
        if (selected || !watchValue || available.length < 1) return;
        const form = available.find(
            // f => `${f.url}?user_id=${user.id}` === watchValue
            f => `${f.url}?user_id=${user.hash}` === watchValue
        );
        if (form) {
            setSelected(form);
            setValue({ ...form, value: form.url });
        }
    }, [watchValue, available]);

    return (
        <div className="savedForms">
            <Row>{ text.formPickPreviousSavedForms }</Row>
            <Row>
                <Form as={Col} inline>
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
                            isLoading={loadingSelect}
                        />
                    </div>
                    <div className="btnContainer">
                        <Button variant="info" style={{float:"left"}} className="mb-2" onClick={reload}>
                            <FontAwesomeIcon
                                icon={faSyncAlt}
                            />
                        </Button>
                        <div style={{float:"rigt"}}>
                            <Button style={{float:"left"}} className="ml-3 mb-2" onClick={promptSave}>
                                { text.btnOpen }
                            </Button>
                            <Button style={{float:"right"}} className="ml-2 mb-2" onClick={promptSave} disabled={disableBtnCollaborator}>
                                { text.btnCollaborators }
                            </Button>
                        </div>
                    </div>
                </Form>
            </Row>
        </div>
    );
};


const FormCollaborators = ({webForm, editable}) => {
    const webFormId = webForm?.web_form_id;
    const { locale } = useLocale();
    const text = uiText[locale.active];
    const [collaborators, setCollaborators] = useState([]);
    const [orgs, setOrgs] = useState([]);

    const fetchCollaborators = async () => {
        if (!webFormId) { return; }
        const endpoint = `/api/collaborators/${webFormId}/`;
        const { data } = await request().get(endpoint);
        const sortOrgs = (a, b) => a.primary ? -1 : b.primary ? 1 : a.organization_id - b.organization_id;
        setCollaborators(data.sort(sortOrgs));
    };

    const fetchOrgs = async () => {
        const res = await authApi.getOrganizations();
        setOrgs(res.data);
    }

    useEffect(async () => {
        await Promise.all([fetchCollaborators(), fetchOrgs()]);
    }, [webForm]);

    const AddCollaborator = () => {
        const { locale } = useLocale();
        const text = uiText[locale.active];
        const [newOrg, setNewOrg] = useState(null);

        const addCollaborator = async (collaboratorId) => {
            const endpoint = `/api/collaborators/${webFormId}/${collaboratorId}`;
            const payload = {projectTitle: webForm?.submission_name || text.textUntitledProject}
            const { data } = await request().post(endpoint, payload);
            const org = orgs.find(it => it.id === Number(data.organization_id));
            const collaborator = {organization_id: org.id, organization_name: org.name, primary: false};
            setCollaborators(collaborators.concat([collaborator]));
        }
        const collaboratorIds = collaborators.map(it => it.organization_id);
        const options = orgs.filter(it => collaboratorIds.indexOf(it.id) === -1)
                            .map(it => {return {value: it.id, label: it.name}});
        return (
            <Form as={Col} inline className="pl-0">
                <div className="col pl-0">
                    <Select
                        placeholder={text.valSelectOrganization}
                        value={newOrg}
                        options={options}
                        onChange={(data) => setNewOrg(data)}
                    />
                </div>
                <Button disabled={newOrg === null} variant="primary" onClick={() => addCollaborator(newOrg.value)}>{text.btnAdd}</Button>
            </Form>
        )
    }

    const RemoveCollaborator = ({collaborator}) => {
        const removeCollaborator = async (collaboratorId) => {
            const endpoint = `/api/collaborators/${webFormId}/${collaboratorId}`;
            const { data } = await request().delete(endpoint);
            setCollaborators(collaborators.filter(it => it.organization_id !== collaboratorId));
        }
        return (
            <a onClick={() => removeCollaborator(collaborator.organization_id)}>
              <FontAwesomeIcon className="ml-2" icon={faTimesCircle} />
            </a>
        );
    }

    return (
        <div className="formCollaborators">
          <Col md={12}>
            <Row>{ text.formCollaborators }</Row>
            <Row>
                { editable && <AddCollaborator />}
                <ButtonGroup aria-label={ text.formCollaborators }>
                  {collaborators.map(collaborator => (
                      <Button className="contributors" size="sm" key={collaborator.organization_id} variant={collaborator.primary ? "outline-primary": "outline-secondary"}>
                        {collaborator.organization_name}
                        {collaborator.primary && ` (${text.btnPrimary})`}
                        {editable && !collaborator.primary && <RemoveCollaborator collaborator={collaborator}/>}
                      </Button>
                  ))}
                </ButtonGroup>
            </Row>
          </Col>
        </div>
    );
}

const NewFormSelectMenu = props => {
    const { locale } = useLocale();
    let text = uiText[locale.active];
    return (
        <components.Menu {...props}>
            <>
                <div>{props.children}</div>
            </>
        </components.Menu>
    );
};

const NewFormSelector = ({ locale, text, user, onSelect, watchValue, showModal, setSubmissionInfo, setShowSavePrompt, setConfirmAction }) => {
    const [available, setAvailable] = useState([]);
    const [selected, setSelected] = useState();
    const [value, setValue] = useState();
    const [submissions, setSubmissions] = useState([]);
    const [alert, setAlert] = useState(false);

    const onSubmit = async () => {
        if (!selected) return;
        setShowSavePrompt(false);
        // check submission to database
        let endpoint = '/api/submission/check/'+user.organization_id+'/'+selected.name;
        const { data } = await request().get(endpoint);
        // if not max submission
        if (!data.max_submission) {
            // const url = `${selected.url}?user_id=${user.id}`;
            const url = `${selected.url}?user_id=${user.hash}`;
            onSelect({ url, type: selected.name });
            return;
        }
        setSubmissionInfo(data);
        // showModal(true); // enable or disable popup
        showModal(false);
        setAlert(true);
        setTimeout(() => {
            setAlert(false);
        }, 2000);
    };
    const onChange = data => {
        const form = available.find(f => f.name === data.value);
        setSelected(form);
        setValue(data);
    };
    const promptSave = (e) => {
        if (!selected) return;
        if (!watchValue) {
            onSubmit();
            return;
        }
        setConfirmAction(() => onSubmit);
        setShowSavePrompt(true);
    };

    const checkSubmissionOnLoad = async () => {
        const { data } = await request().get('/api/submission/check/'+user.organization_id);
        setSubmissions(data);
    }

    const formatLabel = option => {
        let disabled = submissions.includes(parseInt(option.value));
        let info = (disabled) ?
            <small className="font-italic">
                { text.valOptionNewFormDisabledInfo }
            </small> : "";
        return (
            <div>{option.label} {info}</div>
        );
    };

    useEffect(async () => {
        checkSubmissionOnLoad();
        const { data } = await request().get("/api/me/surveys");
        // check user last activity
        if (data.last_activity === null) {
            // reload page
            window.location.reload();
            return;
        }
        setAvailable(data.data);
    }, []);

    useEffect(() => {
        // Clear value if other form is active
        if (!selected) return;
        // if (!watchValue.startsWith(`${selected.url}?user_id=${user.id}`)) {
        if (!watchValue.startsWith(`${selected.url}?user_id=${user.hash}`)) {
            setValue(null);
        }
    }, [watchValue]);

    useEffect(() => {
        // Fill in value from the previous session
        if (selected || !watchValue || available.length < 1) return;
        const form = available.find(
            // f => `${f.url}?user_id=${user.id}` === watchValue
            f => `${f.url}?user_id=${user.hash}` === watchValue
        );
        if (form) {
            setSelected(form);
            setValue({ value: form.name, label: form.title });
        }
    }, [watchValue, available]);

    return (
        <div className="newForms">
            <Row>{ text.formStartFillingNewForm }</Row>
            <Row>
                <Form inline>
                    <div className="mb-2 mr-sm-2 selectContainer">
                        <Select
                            components={{ Menu: NewFormSelectMenu }}
                            value={value}
                            onChange={onChange}
                            isOptionDisabled={option => submissions.includes(parseInt(option.value))}
                            options={available.map(f => {
                                let title = questionnaire[f.name][locale.active];
                                return {
                                    value: f.name,
                                    label: title
                                }
                            })}
                            formatOptionLabel={formatLabel}
                        />
                        {
                            alert ?
                                <Form.Text as="small" className="text-danger ml-2">
                                    { text.valOptionNewFormDisabledInfo }
                                </Form.Text> : ""
                        }
                    </div>
                    {
                        alert
                            ?
                            <Button style={{marginBottom:"2rem"}} onClick={promptSave}>
                                { text.btnOpen }
                            </Button>
                            :
                            <Button className="mb-2" onClick={promptSave}>
                              { text.btnOpen }
                            </Button>
                    }
                </Form>
            </Row>
        </div>
    );
};

const NewProjectSurveyInfoModal = ({ text, show, onHide, content }) => {
    return (
        <Modal size="lg" scrollable={true} show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>
                    { text.modalNewProject }
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="ml-4 mr-4">
                    <p>{ content.section }</p>
                    <ul className="ml-4">{ content.list.map((x, i) => <li key={i}>{x}</li>) }</ul>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    { text.btnOk }
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

const SubmissionInfoModal = ({ text, show, onHide, submissionInfo }) => {
    let content = '';
    if (typeof submissionInfo !== 'undefined') {
        const { submissions, users } = submissionInfo;
        let status = (submissions[0]['submitted']) ? "Submitted" : "Saved";
        content = status + ' by ' + users[0]['name'];
    };
    return (
        <Modal size="md" scrollable={true} show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Maximum Submission
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                { text.valOptionNewFormDisabledInfo }
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    { text.btnClose }
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

const WebForm = ({setFormLoaded, webForm, setWebForm}) => {
    const { user } = useAuth();
    const { locale } = useLocale();
    const [activeForm, setActiveForm] = useState();
    const [delayedActiveForm, setDelayedActiveForm] = useState();
    const [showProjectInfo, setShowProjectInfo] = useState(false);
    const [showSubmissionInfo, setShowSubmissionInfo] = useState(false);
    const [submissionInfo, setSubmissionInfo] = useState();
    const [formUrl, setFormUrl] = useState(null);
    const [showSavePrompt, setShowSavePrompt] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [formLoading, setFormLoading] = useState(false);
    const [isWebFormLoaded, setIsWebFormLoaded] = useState(null);
    const [isSpinner, setIsSpinner] = useState(false);

    const editableCollaborators = user?.organization_id === webForm?.org_id;

    const openForm = (url, cache=0) => {
        setFormLoading(false);
        const isDemo = location.hostname.startsWith('gisco-pilot') ? 0 : 1;
        let endpoint = (url === null) ? url : `${url}&locale=${locale.active}&demo=${isDemo}&cache=${cache}`;
        setActiveForm(endpoint);
        localStorage.setItem(`active-form:${user.id}`, url);
    };

    const onSelectForm = ({ url, type, webForm }) => {
        setIsSpinner(true);
        setIsWebFormLoaded(null);
        if (type == "111510043" || user.project_fids.includes(type)) {
            setFormLoading((localStorage.getItem(`active-form:${user.id}`) === url) ? true : false);
            // new project form
            setShowProjectInfo(true);
            setDelayedActiveForm(url);
            // always show collaborators
            // setWebForm({ web_form_id: null, submission_name: null, new_questionnaire: true, show_collaborator: true, fid: parseInt(type)});
        } else {
            // if type null ? saved form : new form;
            let cache = (type === null) ? 1 : 0;
            openForm(url, cache);
            (user.project_fids.some(id => url.includes(id)))
                ? setWebForm({...webForm, new_questionnaire: false, show_collaborator: true, fid: null})
                : setWebForm(null);
        }
    };

    const onClosedProjectInfo = () => {
        openForm(delayedActiveForm);
        setShowProjectInfo(false);
        setDelayedActiveForm(null);
    };

    const checkIframeLoaded = (event) => {
        setFormLoading(false);
        setTimeout(() => {
            let isLoaded = event.target.contentWindow.window.length;
            setIsWebFormLoaded((isLoaded !== 0) ? true : false);
            setIsSpinner(false);
        }, 5000);
    };

    const formLoaded = activeForm || delayedActiveForm;

    useEffect(() => {
        setFormLoaded(formLoaded);
    }, [activeForm, delayedActiveForm]);

    useEffect(() => {
        // open form from previous session
        const isDemo = location.hostname.startsWith('gisco-pilot') ? 0 : 1;
        const form = localStorage.getItem(`active-form:${user.id}`);
        let endpoint = (form === null) ? form : `${form}&locale=${locale.active}&demo=${isDemo}`;
        setActiveForm(endpoint);

        // just load the survey active when user not refresh the browser
        // let { formUrl } = user;
        // let endpoint = (formUrl === null) ? "" : formUrl + '&locale=' + locale.active;
        // setActiveForm(endpoint);
    }, [locale]);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    let content = wfc(handleShow, activeForm)[locale.active];
    let text = uiText[locale.active];

    return (
        <Container fluid>
            <Row>
                <p className="pl-3 text-muted">
                    { content.dataSecurityText }
                </p>
                <Col md={12}>
                    <div className="d-flex webform-block">
                        <div className="p-2 flex-grow-1 saved-form-block">
                            <SavedFormsSelector
                                text={text}
                                user={user}
                                onSelect={onSelectForm}
                                watchValue={activeForm}
                                setShowSavePrompt={setShowSavePrompt}
                                setConfirmAction={setConfirmAction}
                            />
                        </div>
                        <div className="p-2 new-form-block">
                            <NewFormSelector
                                locale={locale}
                                text={text}
                                user={user}
                                onSelect={onSelectForm}
                                watchValue={activeForm}
                                showModal={setShowSubmissionInfo}
                                setSubmissionInfo={setSubmissionInfo}
                                setShowSavePrompt={setShowSavePrompt}
                                setConfirmAction={setConfirmAction}
                            />
                        </div>
                    </div>
                    {webForm?.web_form_id && <FormCollaborators webForm={webForm} editable={editableCollaborators}/>}
                    {/* {webForm?.show_collaborator && <FormCollaborators webForm={webForm} editable={editableCollaborators}/>} */}

                    {/* Manage blank iFrame */}
                    {
                        (isSpinner) && (
                            <div style={{display:"flex", alignItems: "center", justifyContent: "center" }} className="mb-3">
                                <Spinner animation="border" role="status" size="sm" variant="info">
                                    <span className="sr-only">Loading...</span>
                                </Spinner>
                            </div>
                        )
                    }
                    {
                        (activeForm && isWebFormLoaded === false && isWebFormLoaded !== null) ? (
                            <Alert variant="warning">{ content.iframeNotLoaded }</Alert>
                        ) : ""
                    }
                    {/* End of Manage blank iFrame */}

                    <Card>
                        {activeForm && (
                            <iframe
                                // sandbox="allow-same-origin allow-scripts allow-forms allow-modals"
                                frameBorder="0"
                                style={{ height: "100vh", width: "100%" }}
                                src={formLoading ? '' : activeForm}
                                onLoad={(event) => formLoading ? '' : checkIframeLoaded(event)}
                            />
                        )}
                    </Card>
                    <ModalDataSecurity
                        text={text}
                        show={show}
                        handleClose={handleClose}
                        locale={locale}
                        data={dsc}
                    />
                    <NewProjectSurveyInfoModal
                        text={text}
                        show={showProjectInfo}
                        onHide={onClosedProjectInfo}
                        content={content.newProjectPopupText}
                    />
                    {/* <SubmissionInfoModal
                        text={text}
                        show={showSubmissionInfo}
                        onHide={e => setShowSubmissionInfo(false)}
                        submissionInfo={submissionInfo}
                    /> */}
                  <SaveFormModal
                    text={text}
                    show={formLoaded && showSavePrompt}
                    onHide={e => setShowSavePrompt(false)}
                    onConfirm={confirmAction}
                  />
                </Col>
            </Row>
        </Container>
    );
};

export default WebForm;
