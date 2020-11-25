import React, { useEffect, useState } from 'react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import { AgGridReact } from 'ag-grid-react/lib/agGridReact';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

function Trainings () {
    const [trainings, setTrainings] = useState([]);
    const [loading, setLoading] = useState(true);



    useEffect (() => {
        if (loading) {
            setLoading(false);
            getTrainings();
        }
    })

    const columns = [
        {headerName: 'Activity', field: 'activity', sortable: true, filter: true, floatingFilter: true},
        {headerName: 'Date', field: 'date', sortable: true, filter: true, floatingFilter: true},
        {headerName: 'Duration (min)', field: 'duration', sortable: true, filter: true, floatingFilter: true},
        {headerName: 'Customer', field: 'customer'}
    ]


    const getTrainings = () => {
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

    const defaultProps = {
        options: trainings,
        getOptionLabel: (option) => option.customer,
      };

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
        <div className="ag-theme-material" style={{height: '700px', width: '40%', margin: 'auto', paddingTop: '30px'}}>
            <Autocomplete
                {...defaultProps}
                id="serach by customer"
                autoHighlight
                style={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Search by customer" margin="normal" />}
                onChange={(event, newValue) => filterTrainings(newValue)}
            />
            <AgGridReact
                columnDefs = {columns}
                rowData = {trainings}
                rowSelection="single"
                animateRows="true"

            >
            </AgGridReact>
        </div>
    )
}
export default Trainings;