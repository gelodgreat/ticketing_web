import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import AddTechnician from './Modals/AddTechnician';
import MaterialTable from "material-table";
import Paper from '@material-ui/core/Paper';

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

export default function Users() {
    const classes = useStyles();
    const [state, setState] = useState({
        columns: [
            { title: "Ticker Id", field: "_id" },
            { title: "Message", field: "message", },
            {
                title: "Status",
                field: "status",
                lookup: { Pending: "Pending", Ongoing: "Ongoing", Fixed: "Fixed" }
            },
        ],
        data: []
    });
    const [openTechnicianModal, setTechnicianModal] = React.useState(false);
    const handleClickOpenTechModal = () => {
        setTechnicianModal(true);
    };
    const handleCloseTechModal = () => {
        setTechnicianModal(false);
    };
    const addNewTechnician = async (data) => {
        var technicians = await connection.post('technician', data)
        console.log(technicians)
    }

    return (
        <div className={classes.root}>
            <CssBaseline />
            <main className={classes.content}>


                <AddTechnician
                    open={openTechnicianModal}
                    handleCloseTechModal={handleCloseTechModal}
                    addNewTechnician={addNewTechnician}
                />

                <div className={classes.appBarSpacer} />
                <Container maxWidth="xl" className={classes.container}>
                    <Paper >
                        <Button variant="outlined" color="primary" onClick={handleClickOpenTechModal}>
                            Add Technician
                    </Button>

                        <MaterialTable
                            title="Tickets"
                            columns={state.columns}
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
                                        // var dataNew = await processTrades(newData, "add");
                                        // data.push(dataNew);
                                        resolve(setState({ ...state, data }));
                                    }),
                                onRowUpdate: (newData, oldData) =>
                                    new Promise(async resolve => {
                                        const data = [...state.data];
                                        // var dataNew = await processTrades(newData, "update");
                                        // data[data.indexOf(oldData)] = dataNew;
                                        resolve(setState({ ...state, data }));
                                    }),
                                onRowDelete: oldData =>
                                    new Promise(async resolve => {
                                        const data = [...state.data];
                                        data.splice(data.indexOf(oldData), 1);
                                        // await processTrades(oldData, "delete");
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