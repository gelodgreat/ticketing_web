import React, { Component } from "react";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

export default class AddTicket extends Component {
    constructor(propss) {
        super(propss)
        this.state = {}
    }

    handleSubmit = async (e) => {
        e.preventDefault()
        const { message, requestorName } = this.state
        const data = {
            requestorName: requestorName,
            message: message,
        }
        console.log(data)
        await this.props.addTicket(data, "add")
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        const open = this.props.open;
        const handleCloseTechModal = this.props.handleCloseTechModal
        return (
            <div>
                <Dialog open={open} onClose={handleCloseTechModal} aria-labelledby="form-dialog-title" maxWidth="sm" fullWidth>
                    <DialogTitle id="form-dialog-title">New Ticket</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            <span> Add new ticket</span>
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="requestorName"
                            label="requestorName"
                            name="requestorName"
                            fullWidth
                            onChange={this.handleChange}
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="message"
                            label="message"
                            name="message"
                            fullWidth
                            onChange={this.handleChange}
                        />
                        <br />


                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseTechModal} color="primary">
                            Cancel
              </Button>
                        <Button onClick={(e) => {
                            this.handleSubmit(e)
                        }} color="primary">
                            Add
              </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}
