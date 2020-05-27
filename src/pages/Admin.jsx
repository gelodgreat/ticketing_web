import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import MaterialTable from "material-table";
import Paper from '@material-ui/core/Paper';
import CustomError from "../common/CustomError";
import Connection from "../common/Connection";

import Swal from "sweetalert2";
import AddUser from './Modals/AddUser';
const connection = new Connection();
const customError = new CustomError();
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    menuButton: {
        marginRight: 36,
    },
    menuButtonHidden: {
        display: 'none',
    },
    title: {
        flexGrow: 1,
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    fixedHeight: {
        height: 240,
    },
}));

export default function Technicians() {
    const sweetAlertContent = (title, type, message) => {
        Swal.fire({
            title: title,
            type: type,
            text: message,
            showConfirmButton: false,
            timer: 1000
        });
    };

    const classes = useStyles();
    const [state, setState] = useState({
        data: [],
        ticketsData: []
    });
    const [technician, setTechnicians] = useState({})
    const [openUserModal, setUserModal] = useState(false);
    const handleClickOpenTechModal = () => {
        setUserModal(true);
    };
    const handleCloseTechModal = () => {
        setUserModal(false);
    };
    async function getUsers() {
        try {
            var users = await connection.get('users');
            return users.data
        } catch (error) {
            var errorMessage = customError.getError(error);
        }
    }
    async function getTechnicians() {
        try {
            var technicians = await connection.get('technician');

            var obj = technicians.data.reduce(function (acc, cur, i) {
                acc[cur._id] = cur.name;
                return acc;
            }, {});

            return obj

        } catch (error) {
            var errorMessage = customError.getError(error);
        }
    }
    async function getTickets() {
        try {
            var tickets = await connection.get('tickets');
            return tickets.data
        } catch (error) {
            var errorMessage = customError.getError(error);
        }
    }
    useEffect(() => {
        async function load() {
            setState({ data: await getUsers(), ticketsData: await getTickets() });
            setTechnicians(await getTechnicians());
        }
        load()
    }, []);


    async function processTrades(data, status, oldData) {

        try {
            if (status === "add") {
                var keyData = await connection.post('users', data);
                setState({ data: await getUsers() });
                handleCloseTechModal()
            }
            if (status === "update") {
                var keyData = await connection.put(`user/${oldData['_id']}`, data)
            }
            if (status === "delete") {
                var keyData = await connection.delete(`user/${oldData['_id']}`, data)
            }
            sweetAlertContent("Success", "success", `Success Processing Data`);
            return data;
        } catch (error) {
            console.log(error);
            sweetAlertContent("Error", "error", error);
        }
    }

    return (
        <div className={classes.root}>
            <CssBaseline />
            <main className={classes.content}>

                {openUserModal ? <AddUser
                    open={openUserModal}
                    handleCloseTechModal={handleCloseTechModal}
                    addNewUser={processTrades}
                /> : null}


                <div className={classes.appBarSpacer} />
                <Container maxWidth="xl" className={classes.container}>
                    <Paper >
                        <Button variant="outlined" color="primary" onClick={handleClickOpenTechModal}>
                            Add User
                    </Button>

                        <MaterialTable
                            title="Users"
                            columns={[
                                { title: "Name", field: "name" },
                                { title: "Username", field: "username" },
                                { title: "Account Type", field: "userType", lookup: { Admin: "Admin", SuperAdmin: "SuperAdmin", Guest: "Guest" } },
                            ]}
                            data={state.data}
                            options={{
                                grouping: true,
                                searchFieldAlignment: "right",
                                sorting: true
                            }}
                            editable={{
                                // onRowAdd: newData =>
                                //     new Promise(async resolve => {
                                //         const data = [...state.data];
                                //         // var dataNew = await processTrades(newData, "add");
                                //         // data.push(dataNew);
                                //         resolve(setState({ ...state, data }));
                                //     }),
                                onRowUpdate: (newData, oldData) =>
                                    new Promise(async resolve => {
                                        const data = [...state.data];
                                        var dataNew = await processTrades(newData, "update", oldData);
                                        data[data.indexOf(oldData)] = dataNew;
                                        resolve(setState({ ...state, data }));
                                    }),
                                onRowDelete: oldData =>
                                    new Promise(async resolve => {
                                        const data = [...state.data];
                                        data.splice(data.indexOf(oldData), 1);
                                        await processTrades(oldData, "delete", oldData);
                                        resolve(setState({ ...state, data }));
                                    })
                            }}
                        />

                    </Paper>
                    <br />
                    <Paper >
                        <MaterialTable
                            title="Tickets"
                            columns={[
                                { title: "Message", field: "message", },
                                {
                                    title: "Status",
                                    field: "status",
                                    editable: 'never',
                                    lookup: { Pending: "Pending", Ongoing: "Ongoing", Fixed: "Fixed" }
                                },
                                // { title: "Technician", field: "name", },
                                { title: "Technician", field: "name", lookup: technician },
                            ]}
                            data={state.ticketsData}
                            options={{
                                grouping: true,
                                searchFieldAlignment: "right",
                                sorting: true,
                                exportButton: true
                            }}
                            editable={{
                                // onRowAdd: newData =>
                                // new Promise(async resolve => {
                                //     const data = [...state.data];
                                //     var dataNew = await processTrades(newData, "add");
                                //     data.push(dataNew);
                                //     resolve(setState({ ...state, data }));
                                // }),
                                onRowUpdate: (newData, oldData) =>
                                    new Promise(async resolve => {
                                        const data = [...state.ticketsData];
                                        var dataNew = await processTrades(newData, "update", oldData);
                                        data[data.indexOf(oldData)] = dataNew;
                                        resolve(setState({ ...state, data }));
                                    }),
                                onRowDelete: oldData =>
                                    new Promise(async resolve => {
                                        const data = [...state.ticketsData];
                                        data.splice(data.indexOf(oldData), 1);
                                        await processTrades(oldData, "delete", oldData);
                                        resolve(setState({ ...state, data }));
                                    })
                            }}
                        />

                    </Paper>


                </Container>
            </main>
        </div>
    );
}