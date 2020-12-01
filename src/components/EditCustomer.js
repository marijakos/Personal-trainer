import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import EditIcon from '@material-ui/icons/Edit';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
    },
}))



function EditCustomer(props) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [customer, setCustomer] = useState({
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        streetaddress: '',
        postcode: '',
        city: ''

    })

    const handleClickOpen = () => {
      console.log(props.params);
      setCustomer({
          firstname: props.params.data.firstname,
          lastname: props.params.data.lastname,
          email: props.params.data.email,
          phone: props.params.data.phone,
          streetaddress: props.params.data.streetaddress,
          postcode: props.params.data.postcode,
          city: props.params.data.postcode

      })
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

    const inputChange = (event) => {
        setCustomer({...customer, [event.target.name]: event.target.value})
    }

    const handleSave = () => {
        props.updateCustomer(props.params.value, customer);
        //props.updateCustomer(customer, props.customer.links.href);
        handleClose();
    }

    return (
        <div>
            <IconButton onClick={handleClickOpen}
                        aria-label="delete"
                        variant="contained"
                        color="primary"
                        size= "small"
                        className={classes.button}
                        startIcon={<EditIcon />}
                        >
            <EditIcon />
            </IconButton>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Customer update</DialogTitle>
                <DialogContent>
                <TextField
                    autoFocus
                    name="firstname"
                    value={customer.firstname}
                    onChange={inputChange}
                    margin="dense"
                    label="Frist name"
                    fullWidth
                />
                 <TextField
                    name="lastname"
                    value={customer.lastname}
                    onChange={inputChange}
                    margin="dense"
                    label="Last name"
                    fullWidth
                    />
                <TextField
                    name="email"
                    value={customer.email}
                    onChange={inputChange}
                    margin="dense"
                    label="Email"
                    fullWidth
                />
                <TextField
                    name="phone"
                    value={customer.phone}
                    onChange={inputChange}
                    margin="dense"
                    label="Phone"
                    fullWidth
                />
                <TextField
                    name="streetaddress"
                    value={customer.streetaddress}
                    onChange={inputChange}
                    margin="dense"
                    label="Street address"
                    fullWidth
                />
                <TextField
                    name="postcode"
                    value={customer.postcode}
                    onChange={inputChange}
                    margin="dense"
                    label="Post code"
                    fullWidth
                />
                <TextField
                    name="city"
                    value={customer.city}
                    onChange={inputChange}
                    margin="dense"
                    label="City"
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

export default EditCustomer;