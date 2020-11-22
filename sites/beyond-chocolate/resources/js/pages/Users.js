import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import request from "../lib/request";

const columns = [
    {
        name: "Name",
        selector: "name",
        sortable: true
    },
    {
        name: "Email",
        selector: "email",
        sortable: true
    }
];

const Users = () => {
    const [users, setUsers] = useState([]);
    useEffect(async () => {
        const { data } = await request().get("/api/users");
        setUsers(data);
    }, []);

    return <DataTable title="Users" columns={columns} data={users} />;
};

export default Users;
