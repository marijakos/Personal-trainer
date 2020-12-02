import './App.css';
import Customers from './components/Customers';
import Trainings from './components/Trainings';
import BasicCalendar from './components/Calendar';

import AppBar from '@material-ui/core/AppBar';
import { IconButton, InputBase, Toolbar } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import { fade, makeStyles, withStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';
import SearchIcon from '@material-ui/icons/Search';
import EventIcon from '@material-ui/icons/Event';
import { BrowserRouter as Router } from 'react-router-dom'
import { useState } from 'react';
//import { Calendar } from '@material-ui/pickers';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },


}));



const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);


function App() {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null);
  const [value, setValue] = useState(1);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleOnClose = () => {
    setAnchorEl(null);
  };

  return (
    <Router className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton onClick={handleMenu} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon/>
          </IconButton>
          <StyledMenu
            id="customized-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleOnClose}
          >

            <StyledMenuItem onClose={handleOnClose} onClick={ () => {setValue(1); handleOnClose();} } >
              <ListItemIcon>
                <PeopleOutlineIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Customers"/>
            </StyledMenuItem>


            <StyledMenuItem onClose={handleOnClose} onClick={ () => {setValue(2); handleOnClose();} }>
              <ListItemIcon>
                <DirectionsRunIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Trainings"/>
            </StyledMenuItem>

            <StyledMenuItem onClose={handleOnClose} onClick={ () => {setValue(3); handleOnClose();} }>
              <ListItemIcon>
                <EventIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText  primary="Calendar" />
            </StyledMenuItem>
          </StyledMenu>

          <Typography variant="h6" className={classes.title}>
            Personal trainer
          </Typography>
        </Toolbar>
      </AppBar>
      {value === 1 && <Customers/>}
      {value === 2 && <Trainings/>}
      {value === 3 && <BasicCalendar />}
    </Router>
  );
}

export default App;
