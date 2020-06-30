import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import AddTechnician from './Modals/AddTechnician';
import MaterialTable from "material-table";
import Paper from '@material-ui/core/Paper';
import CustomError from "../common/CustomError";
import Connection from "../common/Connection";
import Swal from "sweetalert2";

import { connect } from 'react-redux';
import { fetchTechnicians } from '../redux/actions/technicians';
import * as actions from "../redux/actions/technicians"

const mapStateToProps = state => {
    return {
        technicians: state.technicians.technicians
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchTechnicians: () => {
            dispatch(actions.fetchTechnicians())
        },
    }
}


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

function Technicians(props) {
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
        data: []
    });
    const [tech, setTech] = useState([])
    const [openTechnicianModal, setTechnicianModal] = useState(false);
    const handleClickOpenTechModal = () => {
        setTechnicianModal(true);
    };
    const handleCloseTechModal = () => {
        setTechnicianModal(false);
    };
    async function getTechnicians() {
        try {
            var technicians = await connection.get('technician');
            setTech({ data: technicians.data })
            return technicians.data
        } catch (error) {
            var errorMessage = customError.getError(error);
        }
    }
    useEffect(() => {
        async function load() {
            await props.fetchTechnicians()
            setState({ data: await getTechnicians() });
        }
        load()
    }, []);


    async function processTrades(data, status, oldData) {

        try {
            if (status === "add") {
                var keyData = await connection.post('technician', data);
                setState({ data: await getTechnicians() });
                handleCloseTechModal()
            }
            if (status === "update") {
                console.log(data)
                var keyData = await connection.put(`technician/${oldData['_id']}`, data)
            }
            if (status === "delete") {
                var keyData = await connection.delete(`technician/${oldData['_id']}`, data)
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

                {openTechnicianModal ? <AddTechnician
                    open={openTechnicianModal}
                    handleCloseTechModal={handleCloseTechModal}
                    processTrades={processTrades}
                /> : null}


                <div className={classes.appBarSpacer} />
                <Container maxWidth="xl" className={classes.container}>
                    <Paper >
                        <Button style={{ marginBottom: 10 }} variant="outlined" color="primary" onClick={handleClickOpenTechModal}>
                            Add Technician
                    </Button>

                        <MaterialTable
                            title="Users"
                            columns={[
                                { title: "Name", field: "name" },
                            ]}
                            data={state.data}
                            options={{
                                grouping: true,
                                searchFieldAlignment: "right",
                                sorting: true
                            }}
                            editable={{
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

export default connect(mapStateToProps, mapDispatchToProps)(Technicians);