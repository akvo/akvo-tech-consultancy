import React, { useEffect, Fragment, useState } from "react";
import { Container, Row, Col, Table, Button } from "react-bootstrap";
import { useLocale } from "../lib/locale-context";
import request from "../lib/request";

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
        const { id, form_id } = item;
        setLoading(id, true);
        const { data } = await request().get(`/api/submissions/download/${form_id}/${id}`);
        console.log(data);
        setLoading(id, false);
    };
    
    const renderSubmissions = () => {
        return submissions.map((x, i) => {
            return (
                <tr key={'submission-'+i}>
                    <td>{x.org_name}</td>
                    <td>{x.submitter_name}</td>
                    <td>{x.form_name}</td>
                    <td>
                        <Button
                            key={'btnDownload-'+i} 
                            variant="primary" 
                            size="sm"
                            disabled={x.isLoading}
                            onClick={!x.isLoading ? () => handleDownload(x) : null}
                        >
                            { x.isLoading ? 'Loading...' : 'Download' }
                        </Button>
                    </td>
                </tr>
            );
        });
    };

    return (
        <Container fluid>
            <Row>
                <Col>
                    <h1>Submission</h1>
                    <Table bordered hover responsive size="sm">
                        <thead>
                            <tr>
                                <th>Organization Name</th>
                                <th>Submitter</th>
                                <th>Form</th>
                                <th>Action</th>
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
