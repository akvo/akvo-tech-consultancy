import React from "react";
import DataTable from "react-data-table-component";

const data = [{ id: 1, name: "Zuhdil Herry Kurnia", email: "zuhdil@akvo.org" }];
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
