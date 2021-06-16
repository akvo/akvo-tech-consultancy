import React, { useEffect, Fragment, useState } from "react";
import { Container, Row, Col, Table, Button, Spinner, Alert } from "react-bootstrap";
import request from "../lib/request";
import { uiText } from "../static/ui-text";
import { useLocale, questionnaire } from "../lib/locale-context";

const defData = [
    {
        data_point_id: null,
        form_id: null,
        form_name: "Loading",
        id: null,
        org_name: "Loading",
        submitter_name: "Loading",
    }
];

const Submission = () => {
    const { locale } = useLocale();
    const [submissions, setSubmissions] = useState(defData);
    const [btnLoading, setBtnLoading] = useState([]);
    const [isError, setIsError] = useState({show: false, msg: null});
    const [isDelay, setIsDelay] = useState(true); // to delay the download button for 60 seconds

    let text = uiText[locale.active];
    let checkDelay = 0;

    const delayInterval = setInterval(() => {
        // to delay the download button for 60 seconds
        checkDelay += 1;
        if (checkDelay === 1) {
            clearInterval(delayInterval);
        }
        // do function here
        console.log('delayInterval');
        setIsDelay(false);
    }, 60 * 1000);

    useEffect( async () => {
        const { data } = await request().get("/api/submissions/submitted");
        let results = data.map(x => ({...x, 'isLoading': false}));
        setSubmissions(results);
        delayInterval;
    }, []);

    const setLoading = (id, status) =>{
        let updateSubmissions = submissions.map(x => {
            // x.isLoading = (x.id === id) ? status : x.isLoading;
            x.isLoading = (x.uuid === id) ? status : x.isLoading;
            return x;
        });
        setSubmissions(updateSubmissions);
        return;
    };

    const handleDownload = async (item) => {
        // # TODO :: change this api link to sync data
        // const { id, form_id, form_name, submitter_name } = item;
        // setLoading(id, true);
      const { uuid, form_id, form_name, submitter_name, id } = item;
        setLoading(uuid, true);
        const filename = form_name.replace(' - ', '-').replace(' ', '') + '-' + submitter_name.replace(' ', '');
        // const { data, status } = await request().get(`/api/submissions/download/${form_id}/${id}/${filename}`);
        const { data, status } = await request().get(`/api/submissions/sync-download/${id}/${form_id}/${uuid}/${filename}`);
        if (status === 200) {
            const link = document.createElement('a');
            link.href = data.link;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            // create error notif
            let msg = (status === 204) ? `Failed to download ${filename}.csv. Generate data process failed.` : "Something went wrong.";
            setIsError({show: true, msg});
        }
        // setLoading(id, false);
        setLoading(uuid, false);
        return;
    };

    const checkDataDelay = (updated_at) => {
        let updated = new Date(updated_at).getTime();
        let now = new Date().getTime();
        let interval = (now - updated) / 1000; // in seconds
        let status = interval <= 60;
        return status;
    };
    const d201921s = new Date('2021-01-01T00:00:00.000000Z');
    const d201921e = new Date('2021-02-01T00:00:00.000000Z');
    const d2019 = new Date('2020-04-28T00:00:00.000000Z');
    const renderSubmissions = () => {
        if (submissions.length === 0) {
            return (
                <tr key="submission-no-data">
                    <td colSpan="4" className="pl-3 text-muted text-center">{ text.infoNoSubmittedData }</td>
                </tr>
            );
        }
        return submissions.map((x, i) => {
          let delay = checkDataDelay(x.updated_at);
          const calculateYear = (x) => {
            const dx = new Date(x);
            if (dx > d201921s && dx < d201921e) {
              return 2019;
            } else if (d2019 > dx) {
              return 2019;
            } else{
              return dx.getFullYear()-1;
            }
          };
          const year =  x.updated_at ? x.form_instance_id==='idh' ? 2019 : calculateYear(x.updated_at) : "Loading";
            return (
                <tr key={'submission-'+i}>
                    <td className="pl-3">{x.org_name}</td>
                    <td className="pl-3">{x.submitter_name}</td>
                    <td className="pl-3">{x.form_name}</td>
                    <td className="pl-3">{year}</td>
                    <td className="pl-3">
                        <Button
                            key={'btnDownload-'+i}
                            variant="primary"
                            size="sm"
                            disabled={(delay && isDelay) ? true : x.isLoading}
                            onClick={!x.isLoading ? () => handleDownload(x) : null}
                        >
                            { x.isLoading || (delay && isDelay) ? (
                                    <>
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                        />{'  ' + ((delay && isDelay) ? text.btnUploading : text.btnGenerating)}
                                    </>
                                ) : text.btnDownload }
                        </Button>
                    </td>
                </tr>
            );
        });
    };

    const renderAlert = () => {
        const { show, msg } = isError;
        return show && (
            <Alert
                key={msg}
                variant='warning'
                onClose={() => setIsError({show: false, msg: null})}
                dismissible
            >
                <Alert.Heading>Failed!</Alert.Heading>
                <hr/>
                {msg}
            </Alert>
        );
    };

    useEffect(() => {
        isError.show ?
            setTimeout(() => {
                setIsError({show: false, msg: null});
            }, 5000) : "";
    }, [isError]);

    return (
        <Container fluid>
            <Row className="justify-content-center">
                <Col className="mx-auto" md="10">
                    <h3>{ text.dwnLOfSubmissions }</h3>
                    <p>{ text.textInfoSubmission }</p>
                    <hr/>
                    { renderAlert() }
                    <Table bordered hover responsive size="sm">
                        <thead>
                            <tr>
                                <th className="pl-3">{ text.tbColOrganization }</th>
                                <th className="pl-3">{ text.tbColSubmitter }</th>
                                <th className="pl-3">{ text.tbColForm }</th>
                                <th className="pl-3">{ text.tbColYear }</th>
                                <th className="pl-3">{ text.tbColAction }</th>
                            </tr>
                        </thead>
                        <tbody>
                            { renderSubmissions() }
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    );
};

export default Submission;
