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

export default class AddUser extends Component {
    constructor(propss) {
        super(propss)
        this.state = {}
    }

    handleSubmit = async (e) => {
        e.preventDefault()
        const { username, password, userType, name } = this.state
        const data = {
            name: name,
            username: username,
            password: password,
            userType: userType,
        }
        await this.props.addNewUser(data, "add")
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
                    <DialogTitle id="form-dialog-title">New User</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            <span> Add new user</span>
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="name"
                            name="name"
                            fullWidth
                            onChange={this.handleChange}
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="username"
                            label="username"
                            name="username"
                            fullWidth
                            onChange={this.handleChange}
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="password"
                            label="password"
                            name="password"
                            fullWidth
                            type="password"
                            onChange={this.handleChange}
                        />
                        <br />
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Account Type</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={this.state.userType}
                                name="userType"
                                onChange={this.handleChange}
                            >
                                <MenuItem value="SuperAdmin">SuperAdmin</MenuItem>
                                <MenuItem value="Admin">Admin</MenuItem>
                                <MenuItem value="Guest">Guest</MenuItem>

                            </Select>
                        </FormControl>

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
