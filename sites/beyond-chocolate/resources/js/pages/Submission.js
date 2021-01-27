import React, { useEffect, Fragment, useState } from "react";
import { Container, Row, Col, Table, Button, Spinner } from "react-bootstrap";
import { useLocale } from "../lib/locale-context";
import request from "../lib/request";
import { uiText } from "../static/ui-text";

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

    let text = uiText[locale.active];

    useEffect( async () => {
        const { data } = await request().get("/api/submissions/submitted");
        let results = data.map(x => ({...x, 'isLoading': false}));
        setSubmissions(results);
    }, []);

    const setLoading = (id, status) =>{
        let updateSubmissions = submissions.map(x => {
            x.isLoading = (x.id === id) ? status : x.isLoading;
            return x;
        });
        setSubmissions(updateSubmissions);
    };

    const handleDownload = async (item) => {
        const { id, form_id, form_name, submitter_name } = item;
        setLoading(id, true);
        const filename = form_name.replace(' - ', '-').replace(' ', '') + '-' + submitter_name.replace(' ', '');
        const { data, status } = await request().get(`/api/submissions/download/${form_id}/${id}/${filename}`);
        if (status === 200) {
            const link = document.createElement('a');
            link.href = data.link;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            // create error notif
        }
        setLoading(id, false);
    };
    
    const renderSubmissions = () => {
        if (submissions.length === 0) {
            return (
                <tr key="submission-no-data">
                    <td colspan="4" className="pl-3 text-muted text-center">{ text.infoNoSubmittedData }</td>
                </tr>
            );
        }
        return submissions.map((x, i) => {
            return (
                <tr key={'submission-'+i}>
                    <td className="pl-3">{x.org_name}</td>
                    <td className="pl-3">{x.submitter_name}</td>
                    <td className="pl-3">{x.form_name}</td>
                    <td className="pl-3">
                        <Button
                            key={'btnDownload-'+i} 
                            variant="primary" 
                            size="sm"
                            disabled={x.isLoading}
                            onClick={!x.isLoading ? () => handleDownload(x) : null}
                        >
                            { x.isLoading ? (
                                    <>
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                        />{'  ' + text.btnDownloading}
                                    </>
                                ) : text.btnDownload }
                        </Button>
                    </td>
                </tr>
            );
        });
    };

    return (
        <Container fluid>
            <Row className="justify-content-center">
                <Col className="mx-auto" md="10">
                    <h3>{ text.navSubmission }</h3>
                    <hr/>
                    <Table bordered hover responsive size="sm">
                        <thead>
                            <tr>
                                <th className="pl-3">{ text.tbColOrganization }</th>
                                <th className="pl-3">{ text.tbColSubmitter }</th>
                                <th className="pl-3">{ text.tbColForm }</th>
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
