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
import CustomError from "../common/CustomError";
import AddTicket from './Modals/AddTickets';

const customError = new CustomError();
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
        data: [],

    });
    const [tech, setTech] = useState([])
    const [modal, setModal] = useState(false);
    const handleClickOpenTechModal = () => {
        setModal(true);
    };
    const handleCloseTechModal = () => {
        setModal(false);
    };

    async function getTechnicians() {
        try {
            var technicians = await connection.get('technician');
            setTech(technicians.data)
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
            const user = await localStorage.getItem('user')
            const parsedUser = JSON.parse(user)
            console.log(parsedUser)
            var tickets;
            if (parsedUser['userType'] === "Guest") {
                tickets = await connection.get(`tickets?verified=verified&createdBy=${parsedUser['_id']}`);
            } else {
                tickets = await connection.get('tickets?verified=verified');
            }

            return tickets.data
        } catch (error) {
            var errorMessage = customError.getError(error);
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
                setState({ data: await getTickets() });
                handleCloseTechModal()
                sweetAlertContent("Success", "success", `Success Processing Ticket, Please wait while the admin verifies your request`);
            }
            if (status === "update") {
                var keyData = await connection.put(`tickets/${oldData['_id']}`, data)
                sweetAlertContent("Success", "success", `Success Processing Data`);
            }
            if (status === "delete") {
                var keyData = await connection.delete(`tickets/${oldData['_id']}`, data)
                sweetAlertContent("Success", "success", `Success Processing Data`);
            }

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
                {modal ? <AddTicket
                    open={modal}
                    technician={tech}
                    handleCloseTechModal={handleCloseTechModal}
                    addTicket={processTrades}
                /> : null}

                <div className={classes.appBarSpacer} />
                <Container maxWidth="xl" className={classes.container}>
                    <Button style={{ marginBottom: 10 }} variant="outlined" color="primary" onClick={handleClickOpenTechModal}>
                        Add Ticket
                    </Button>
                    <Paper >
                        <MaterialTable
                            title="Tickets"
                            columns={[
                                { title: "Name", field: "requestorName", editable: 'never', },
                                { title: "Concern", field: "message", },
                                {
                                    title: "Status",
                                    field: "status",
                                    lookup: { Pending: "Pending", Ongoing: "Ongoing", Fixed: "Fixed" }
                                },
                                { title: "Solution", field: "solution", editable: 'never', },
                            ]}
                            data={state.data}
                            options={{
                                grouping: true,
                                searchFieldAlignment: "right",
                                sorting: true
                            }}
                            editable={{
                                // onRowAdd: newData =>
                                // new Promise(async resolve => {
                                //     const data = [...state.data];
                                //     var dataNew = await processTrades(newData, "add");
                                //     data.push(dataNew);
                                //     resolve(setState({ ...state, data }));
                                // }),
                                isEditable: rowData => !rowData.solution,
                                isDeletable: rowData => !rowData.solution,
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
                            detailPanel={(rowData) => {
                                console.log(rowData)
                                return (
                                    <>
                                        <Container maxWidth="md" className={classes.container}>
                                            <p>Technician: {rowData.technician.name}</p>
                                            <p>Created By: {rowData.createdBy.name}</p>
                                        </Container>
                                    </>
                                )
                            }}
                        />

                    </Paper>
                </Container>
            </main>
        </div>
    );
}