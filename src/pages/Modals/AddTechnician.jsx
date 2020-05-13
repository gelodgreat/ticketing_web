import React, { Component } from "react";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default class AddTechnician extends Component {
    constructor(propss) {
        super(propss)
        this.state = {}
    }

    handleSubmit = async () => {
        const data = {
            name:this.state.name
        }
        this.props.addNewTechnician(data)
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        const open = this.props.open;
        const handleCloseTechModal = this.props.handleCloseTechModal
        return (
            <div>
                <Dialog open={open} onClose={handleCloseTechModal} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">The Technician</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            <span> Add new Expert Technician</span>
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Technician Name"
                            name="name"
                            fullWidth
                            onChange={this.handleChange}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseTechModal} color="primary">
                            Cancel
              </Button>
                        <Button onClick={this.handleSubmit} color="primary">
                            Add
              </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}
