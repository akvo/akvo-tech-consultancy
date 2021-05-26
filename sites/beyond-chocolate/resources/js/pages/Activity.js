import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table } from "react-bootstrap";
import Select from "react-select";
import activityApi from "../services/activity";

const Activity = () => {
    const [activities, setActivities] = useState([]);
    const [loadError, setLoadError] = useState();
    const loading = activities.length == 0 && loadError == null;

    const getActivities = async () => {
        activityApi
            .getActivities()
            .then((response) => {
                setActivities(response.data);
            })
            .catch((error) => {
                console.log(error);
                setLoadError(error.message);
            });
    };

    useEffect(() => {
        if (loading) {
            getActivities();
        }
    });

    const listItems = activities.map((activity) => (
        <tr
            key={activity.secretariat + activity.id}
            style={activity.submitted == 1 ? { color: "#50a14f" } : {}}
        >
            <td>{activity.created_at}</td>
            <td>{activity.org_name}</td>
            <td>{activity.form_name}</td>
            <td>{activity.secretariat}</td>
            <td>{activity.submitted == 1 ? "Submitted" : "Saved"}</td>
            <td>{activity.user_name}</td>
            <td>{activity.email}</td>
        </tr>
    ));
    return (
        <Container fluid className="usersTab">
            <Row>
                <h1>Recent activity (last 100 submissions)</h1>
            </Row>
            {loading ? (
                <p>Loading</p>
            ) : (
                <Row>
                    <Table className="activity-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Org</th>
                                <th>Form</th>
                                <th>Secreteriat</th>
                                <th>Status</th>
                                <th>User</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>{listItems}</tbody>
                    </Table>
                </Row>
            )}
        </Container>
    );
};

export default Activity;
