import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import AddTechnician from './Modals/AddTechnician';
import MaterialTable from "material-table";
import Paper from '@material-ui/core/Paper';
import Swal from "sweetalert2";
import Connection from "../common/Connection";
const connection = new Connection();


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

export default function Home() {
    const classes = useStyles();
    const [technician, setTechnicians] = useState({})
    const [state, setState] = useState({
        data: []
    });
    async function getTechnicians() {
        try {
            var technicians = await connection.get('technician');
            var obj = technicians.data.reduce(function (acc, cur, i) {
                acc[cur._id] = cur.name;
                return acc;
            }, {});
            return obj

        } catch (error) {
            console.log(error);
        }
    }
    async function getTickets() {
        try {
            var tickets = await connection.get('tickets');
            return tickets.data
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        async function load() {
            setTechnicians(await getTechnicians());
            setState({ data: await getTickets() });
        }
        load()
    }, []);



    const sweetAlertContent = (title, type, message) => {
        Swal.fire({
            title: title,
            type: type,
            text: message,
            showConfirmButton: false,
            timer: 1000
        });
    };

    async function processTrades(data, status, oldData) {
        try {
            if (status === "add") {
                var keyData = await connection.post('tickets', data)
            }
            if (status === "update") {
                var keyData = await connection.put(`tickets/${oldData['_id']}`, data)
            }
            if (status === "delete") {
                var keyData = await connection.delete(`tickets/${oldData['_id']}`, data)
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

                <div className={classes.appBarSpacer} />
                <Container maxWidth="xl" className={classes.container}>
                    <Paper >
                        <MaterialTable
                            title="Tickets"
                            columns={[
                                { title: "Message", field: "message", },
                                {
                                    title: "Status",
                                    field: "status",
                                    lookup: { Pending: "Pending", Ongoing: "Ongoing", Fixed: "Fixed" }
                                },
                                // { title: "Technician", field: "name", },
                                { title: "Technician", field: "name", lookup: technician },
                            ]}
                            data={state.data}
                            options={{
                                grouping: true,
                                searchFieldAlignment: "right",
                                sorting: true
                            }}
                            editable={{
                                onRowAdd: newData =>
                                    new Promise(async resolve => {
                                        const data = [...state.data];
                                        var dataNew = await processTrades(newData, "add");
                                        data.push(dataNew);
                                        resolve(setState({ ...state, data }));
                                    }),
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
                </Container>
            </main>
        </div>
    );
}