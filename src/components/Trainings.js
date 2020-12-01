import React, { useEffect, useState, useRef } from 'react';
import moment from 'moment';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import { AgGridReact } from 'ag-grid-react/lib/agGridReact';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Snackbar from '@material-ui/core/Snackbar';

import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled"  {...props} />;
}

const useStyles = makeStyles((theme) => ({
    Iconbutton: {
      margin: theme.spacing(1),
    },
  }));

function Trainings () {
    const [trainings, setTrainings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [msg, setMsg] = useState('');

    const classes = useStyles();
    const gridRef = useRef();



    useEffect (() => {
        if (loading) {
            setLoading(false);
            getTrainings();
        }
    })

    const columns = [
        {headerName: 'Activity', field: 'activity', sortable: true, filter: true, floatingFilter: true},
        {headerName: 'Date', field: 'date', cellRendererFramework: params => moment(params.value).format('MMMM Do YYYY, h:mm:ss a'),sortable: true, filter: true, floatingFilter: true},
        {headerName: 'Duration (min)', field: 'duration', sortable: true, filter: true, floatingFilter: true},
        {headerName: 'Customer', field: 'customer'},
        {
            headerName: '',
            field: 'links',
            cellRendererFramework: params => <IconButton
                                                aria-label="delete"
                                                onClick={() => deleteTraining(params.value)}
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

    const getTrainings = (props) => {
        let fullTraining = [];
        fetch('https://customerrest.herokuapp.com/api/trainings')
        .then(response => response.json())
        .then(data => {
                data.content.forEach((training, key, arr)  => {
                    training.links.forEach(linkObj => {
                        if (linkObj.rel == "customer") {
                            fetch(linkObj.href)
                            .then(response => response.json())
                            .then(data => {
                                training["customer"] = data.firstname + " " + data.lastname;
                                fullTraining.push(training);
                                if (Object.is(arr.length - 1, key)) {
                                    // execute last training
                                    setTrainings(fullTraining);
                                }
                                console.log(training);
                            })
                            .catch(err => console.error(err));
                        }
                    })
                });
        })
        .catch(err => console.error(err))
    }

    const deleteTraining = (link) => {
        if (window.confirm('Are you sure?')) {
            fetch(link[0].href, {
                method: 'DELETE'
            })
            .then(_ => getTrainings())
            .then(_ => setMsg(<Alert onClose={handleClose} severity="success">Successfully deleted</Alert>))
            .then(_ => setOpen(true))
            .catch(err => console.error(err))
        }
    }


    const handleClose = () => {
        setOpen(false);
    }

    //Grouped and sorted otions in autocomplete
    const options = trainings.map((option) => {
    const firstLetter = option.customer[0].toUpperCase();
    return {
        firstLetter,
        ...option,
    };
    });

    const filterTrainings = (value) => {
        if (value == null) {
            getTrainings();
            return;
        }
        let filteredTrainings = [];
        for (let i = 0; i < trainings.length; i++) {
            if (trainings[i].customer === value.customer) {
                filteredTrainings.push(trainings[i]);
            }
        }
        setTrainings(filteredTrainings);
    }

    return (
        <div className="ag-theme-material" style={{height: '700px', width: '50%', margin: 'auto', paddingTop: '30px'}}>

            <Autocomplete
                options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                groupBy={(option) => option.firstLetter}
                getOptionLabel={(option) => option.customer}
                id="serach by customer"
                autoHighlight
                style={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Search by customer" margin="normal" />}
                onChange={(event, newValue) => filterTrainings(newValue)}
            />
            <AgGridReact
                ref={gridRef}
                onGridReady={ params => {
                    gridRef.current = params.api
                    params.api.sizeColumnsToFit();
                } }
                columnDefs = {columns}
                rowData = {trainings}
                rowSelection="single"
                animateRows="true"
                pagination={true}
                paginationPageSize={5}

            >
            </AgGridReact>
            <Snackbar
                open={open}
                autoHideDuration={5000}
                onClose={handleClose}
                message={msg}
            />
        </div>
    )
}

export default Trainings;