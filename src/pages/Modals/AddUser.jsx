import React, { Component } from "react";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default class AddUser extends Component {
    constructor(propss) {
        super(propss)
    }
    render() {
        const open = this.props.open;
        const handleCloseTechModal = this.props.handleCloseTechModal
        return (
            <div>
                <Dialog open={open} onClose={handleCloseTechModal} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            To subscribe to this website, please enter your email address here. We will send updates
                            occasionally.
              </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Email Address"
                            type="email"
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseTechModal} color="primary">
                            Cancel
              </Button>
                        <Button onClick={handleCloseTechModal} color="primary">
                            Subscribe
              </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}
