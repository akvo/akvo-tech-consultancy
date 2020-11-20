import React from "react";
import DataTable from "react-data-table-component";

const data = [
    { id: 1, name: "John Doe", email: "johndoe@example.com" },
    { id: 2, name: "Joe Bloggs", email: "joebloggs@example.com" }
];
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

const Users = function() {
    return <DataTable title="Users" columns={columns} data={data} />;
};

export default Users;
