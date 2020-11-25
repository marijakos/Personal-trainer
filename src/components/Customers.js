import React, { useState, useEffect } from 'react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import { AgGridReact } from 'ag-grid-react/lib/agGridReact';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

function Customers () {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

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
        {headerName: 'Street address', field: 'streetaddress', sortable: true, filter: true, floatingFilter: true},
        {headerName: 'Post code', field: 'postcode', sortable: true, filter: true, floatingFilter: true},
        {headerName: 'City', field: 'city', sortable: true, filter: true, floatingFilter: true},
    ]


    const getCustomers = () => {
        fetch('https://customerrest.herokuapp.com/api/customers')
        .then(response => response.json())
        .then(data => setCustomers(data.content))
        .catch(err => console.error(err))
    }

    const defaultProps = {
        options: customers,
        getOptionLabel: (option) => option.firstname,
      };

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
        <div className="ag-theme-material" style={{height: '700px', width: '80%',  margin: 'auto', paddingTop: '30px'}}>
            <Autocomplete
                {...defaultProps}
                id="search-by-name"
                autoHighlight
                style={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Search by Name" margin="normal" />}
                fullWidth
                onChange={(event, newValue) => filterCustomers(newValue)}
            />

            <AgGridReact
                columnDefs = {columns}
                rowData = {customers}
                rowSelection="single"
                pagination={true}
                paginationPageSize={7}
                animateRows="true"


            >
            </AgGridReact>
        </div>
    )
}
export default Customers;
