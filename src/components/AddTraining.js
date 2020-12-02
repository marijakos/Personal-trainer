import React, { useState } from 'react';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import DateFnsUtils from '@date-io/date-fns';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';

function AddTraining (props) {
    const [open, setOpen] = useState(false);
    const [selectedDate, handleDataChange] = useState(new Date());
    const [training, setTraining] = useState({
        activity: '',
        duration: '',
        date: selectedDate.toISOString(),
    });

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const inputChange = (event) => {
        setTraining({...training, [event.target.name]: event.target.value})
    }

    const handleSave = () => {
        props.addTraining({...training, customer: props.params.data.links[0].href});
        handleClose();
    }

    return(
        <div>
            <Button  color="primary" onClick={handleClickOpen}>
                Add Training
            </Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">New training</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        name="activity"
                        value={training.activity}
                        onChange={inputChange}
                        margin="dense"
                        label="Activity"
                        fullWidth

                    />
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DateTimePicker label = "Next treining" value={selectedDate} onChange={dateChanged => setTraining({...training, date: dateChanged.toISOString()})}/>
                    </MuiPickersUtilsProvider>
                    <TextField
                        name="duration"
                        value={training.duration}
                        onChange={inputChange}
                        margin="dense"
                        label="Duration"
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default AddTraining;