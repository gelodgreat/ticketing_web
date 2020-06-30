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
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import UpdateTechnician from "./Modals/UpdateTechnician"
import { connect } from 'react-redux';
import * as actions from "../redux/actions/technicians"

const mapStateToProps = state => {
    return {
        technicians: state.technicians,
    }
}


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

function PendingTickets(props) {
    const classes = useStyles();

    const [tickets, setTickets] = useState([])
    const [technician, setTechnicians] = useState({})
    const [parsedTechnicians, setParsedTechnicians] = useState([])
    const [updateTechnician, setUpdateTechnician] = useState("")
    const [openTechnicianModal, setTechnicianModal] = useState(false);
    const handleClickOpenTechModal = () => {
        setTechnicianModal(true);
    };
    const [parsedUser, setParsedUser] = useState({})

    const handleCloseTechModal = () => {
        setTechnicianModal(false);
    };

    async function getTickets() {
        try {
            var tickets = await connection.get('tickets');
            setTickets(tickets.data)
            return tickets.data
        } catch (error) {
            var errorMessage = customError.getError(error);
        }
    }

    async function getTechnicians() {
        try {
            var technicians = await connection.get('technician');
            setTechnicians(technicians.data)
            var obj = technicians.data.reduce(function (acc, cur, i) {
                acc[cur._id] = cur.name;
                return acc;
            }, {});
            setParsedTechnicians(obj)
            return obj

        } catch (error) {
            var errorMessage = customError.getError(error);
        }
    }

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
            if (status === "update") {
                var keyData = await connection.put(`tickets/${oldData['_id']}`, data)
                await getTickets()
            }
            if (status === "delete") {
                var keyData = await connection.delete(`tickets/${oldData['_id']}`, data)
                await getTickets()
            }
            sweetAlertContent("Success", "success", `Success Processing Data`);
            return data;
        } catch (error) {
            console.log(error);
            sweetAlertContent("Error", "error", error);
        }
    }

    useEffect(() => {
        async function load() {
            console.log("====>", props)
            await getTechnicians()
            await getTickets()
            const user = await localStorage.getItem('user')
            const parsedUser = JSON.parse(user);
            setParsedUser(parsedUser)
        }
        load()
    }, []);

    function handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    return (
        <div className={classes.root}>
            <CssBaseline />
            <main className={classes.content}>
                <div className={classes.appBarSpacer} />
                <Container maxWidth="xl" className={classes.container}>
                    <Paper>
                        <MaterialTable
                            title="Tickets"

                            columns={[
                                { title: "Ticket No.", field: "_id", editable: false },
                                { title: "Requestor", field: "requestorName", editable: false },
                                { title: "Message", field: "message", editable: false },
                                {
                                    title: "Status",
                                    field: "status",
                                    editable: parsedUser['userType'] === "Admin" ? true : false,
                                    lookup: { Pending: "Pending", Ongoing: "Ongoing", Fixed: "Fixed" }
                                },
                                { title: "Technician", field: "technician._id", lookup: parsedTechnicians },
                                { title: "Solution", field: "solution", },
                                { title: "Verified", field: "verified", lookup: { verified: "verified", unverified: "unverified" } },
                                { title: "Created At", field: "createdAt", editable: false },
                                { title: "Username", field: "createdBy.username", editable: false }
                            ]}
                            data={tickets}
                            options={{
                                grouping: true,
                                searchFieldAlignment: "right",
                                sorting: true
                            }}
                            actions={[
                                {
                                    icon: 'delete',
                                    tooltip: 'Delete',
                                    onClick: (event, oldData) => {
                                        new Promise(async resolve => {
                                            const data = tickets;
                                            data.splice(data.indexOf(oldData), 1);
                                            await processTrades(oldData, "delete", oldData);
                                            resolve(setTickets(data));
                                        })
                                    },
                                    disabled: parsedUser.userType === "Admin" ? true : false

                                }
                            ]}
                            editable={{
                                onRowUpdate: (newData, oldData) =>
                                    new Promise(async resolve => {
                                        const data = tickets;
                                        var dataNew = await processTrades(newData, "update", oldData);
                                        data[data.indexOf(oldData)] = dataNew;
                                        resolve(setTickets(data));
                                    }),
                            }}
                            detailPanel={(rowData) => {
                                return (
                                    <>
                                        <Container maxWidth="md" className={classes.container}>
                                            <p>Created By: {rowData.createdBy.name}</p>
                                        </Container>
                                    </>
                                )
                            }}
                        />
                        {/* {props.technicians.map(item => {
                            return item.title
                        })} */}

                    </Paper>
                </Container>

            </main>
        </div>
    );
}

export default connect(mapStateToProps)(PendingTickets)