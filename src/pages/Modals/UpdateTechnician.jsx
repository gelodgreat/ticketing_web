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

export default class UpdateTechnician extends Component {
    constructor(propss) {
        super(propss)
        this.state = {
            currentTechnician: this.props.rowData.technician._id
        }
    }
    componentDidMount() {

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
        const { handleCloseTechModal, open, technician } = this.props;
        console.log(this.props)
        const { currentTechnician } = this.state
        return (
            <div>
                <Dialog open={open} onClose={handleCloseTechModal} aria-labelledby="form-dialog-title" maxWidth="sm" fullWidth>
                    <DialogTitle id="form-dialog-title">Update Technician</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            <span>Update Technician</span>
                        </DialogContentText>

                        <br />
                        <FormControl maxWidth="md" fullWidth>
                            <InputLabel id="demo-simple-select-label">Technician</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={currentTechnician}
                                name="technician"
                                onChange={this.handleChange}
                            >
                                {/* {technician.map(technician => {
                                    return <MenuItem value={technician._id}>{technician.name}</MenuItem>
                                })} */}

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
