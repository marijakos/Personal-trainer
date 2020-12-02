import React, { useState, useEffect, useRef } from 'react';
import AddCustomer from './AddCustomer';
import EditCustomer from './EditCustomer';
import AddTraining from './AddTraining';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import { AgGridReact } from 'ag-grid-react/lib/agGridReact';

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Snackbar from '@material-ui/core/Snackbar';

import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled"  {...props} />;
}

const useStyles = makeStyles((theme) => ({
    Iconbutton: {
      margin: theme.spacing(1),
    },
  }));

function Customers () {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [msg, setMsg] = useState('');

    const gridRef = useRef();

    const classes = useStyles();

    useEffect(() =>{
        if (loading) {
            setLoading(false);
            getCustomers();
        }
    })

    const columns = [

        {headerName: 'First name', field: 'firstname', sortable: true, filter: true, floatingFilter: true},
        {headerName: 'Last name', field: 'lastname', sortable: true, filter: true, floatingFilter: true},
        {headerName: 'Email', field: 'email', sortable: true, filter: true, floatingFilter: true},
        {headerName: 'Phone', field: 'phone', sortable: true, filter: true, floatingFilter: true},
        {headerName: 'Address', field: 'streetaddress', sortable: true, filter: true, floatingFilter: true},
        {headerName: 'Post code', field: 'postcode', sortable: true, filter: true, floatingFilter: true},
        {headerName: 'City', field: 'city', sortable: true, filter: true, floatingFilter: true},
        {
            headerName:'',
            filed: 'links',
            cellRendererFramework: params => <AddTraining addTraining={addTraining} params={params} />},

        {
            headerName: '',
            width: 100,
            field: 'links',
            cellRendererFramework: params => <EditCustomer updateCustomer={updateCustomer} params={params}/>
        },
        {
            headerName: '',
            field: 'links',
            cellRendererFramework: params => <IconButton
                                                aria-label="delete"
                                                onClick={() => deleteCustomer(params.value)}
                                                color="secondary"
                                                size="small"
                                                className ={classes.button}
                                                variant="contained"
                                                startIcon={<DeleteIcon />}
                                                >
                                                <DeleteIcon />
                                                </IconButton>
        }
    ]

    const getCustomers = () => {
        fetch('https://customerrest.herokuapp.com/api/customers')
        .then(response => response.json())
        .then(data => setCustomers(data.content))
        .catch(err => console.error(err))
    }

    const deleteCustomer = (link) => {
        if (window.confirm('Are you sure?')) {
            fetch(link[0].href, {
                method: 'DELETE'
            })
            .then(_ => getCustomers())
            .then(_ => setMsg(<Alert onClose={handleClose} severity="success">Successfully deleted</Alert>))
            .then(_ => setOpen(true))
            .catch(err => console.error(err))
        }
    }

    const addCustomer = (newCustomer) => {
        fetch('https://customerrest.herokuapp.com/api/customers', {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify(newCustomer)
        })
        .then(_=> getCustomers())
        .catch(err => console.error(err))
        .then(_ => setMsg(<Alert onClose={handleClose} severity="success">Successfully added customer</Alert>))
        .then(_ => setOpen(true))
    }

    const updateCustomer = (link, customer) => {
        fetch(link[0].href, {
            method: 'PUT',
            headers: {'Content-type' : 'application/json'},
            body: JSON.stringify(customer)
        })
        .then(_ => getCustomers())
        .catch(err => console.error(err))
    }

    const addTraining = (newTraining) => {
        fetch('https://customerrest.herokuapp.com/api/trainings', {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify(newTraining)
        })
        .catch(err => console.error(err))
        .then(_ => setMsg(<Alert onClose={handleClose} severity="success">Successfully added training</Alert>))
        .then(_ => setOpen(true))
    }

    const handleClose = () => {
        setOpen(false);
    }
    //Grouped and sorted otions in autocomplete
      const options = customers.map((option) => {
        const firstLetter = option.firstname[0].toUpperCase();
        return {
          firstLetter,
          ...option,
        };
      });
//Autocomplete-onChange(newValue) - show in the table selected option
    const filterCustomers = (value) => {
        if (value == null) {
            getCustomers();
            return;
        }
        let filteredCustomers = [];
        for (let i = 0; i < customers.length; i++) {
            if (customers[i].firstname === value.firstname) {
                filteredCustomers.push(customers[i]);
            }
        }
        setCustomers(filteredCustomers);
    }

    return(
        <div>
            <div className="ag-theme-material" style={{height: '700px', width: '80%',  margin: 'auto', paddingTop: '30px'}}>
                <AddCustomer addCustomer={addCustomer} />
                <Autocomplete
                    options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                    groupBy={(option) => option.firstLetter}
                    getOptionLabel={(option) => option.firstname}
                    id="search-by-name"
                    autoHighlight
                    style={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="Search by Name" margin="normal" />}
                    fullWidth
                    onChange={(event, newValue) => filterCustomers(newValue)}
                />

                <AgGridReact
                    ref={gridRef}
                    onGridReady={ params => {
                        gridRef.current = params.api
                        params.api.sizeColumnsToFit();
                    } }
                    columnDefs = {columns}
                    rowData = {customers}
                    rowSelection="single"
                    pagination={true}
                    paginationPageSize={10}
                    animateRows="true"
                >
                </AgGridReact>
                <Snackbar
                        open={open}
                        autoHideDuration={5000}
                        onClose={handleClose}
                        message={msg}
                    />
            </div>
        </div>
    )
}
export default Customers;
