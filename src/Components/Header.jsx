import {useCallback} from 'react';
import { makeStyles,AppBar,Toolbar,MenuItem,Typography,FormControl,Select,InputLabel } from '@material-ui/core';
import {useNavigate} from 'react-router-dom';
import {CryptoState} from '../CryptoContext';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    paddingTop:20,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    color:'#00d09c',
    fontFamily:'Montserrat',
    cursor:'pointer',
    
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    color:'gold',
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function Header() {
  const classes = useStyles();
  const navigate = useNavigate();
  const {currency,setCurrency} = CryptoState();

  const handleChange = useCallback((event) => {
    setCurrency(event.target.value);
  },[]);

  return (
    <div className={classes.root}>
      <AppBar position="static" color='transparent'>
        <Toolbar>
          {/* <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton> */}
          <Typography variant="h4" className={classes.title} onClick={()=>navigate("/")}>
            CRYPTO HUB
          </Typography>
          <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="demo-simple-select-outlined-label" className='currency-select-color'>currency</InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={currency}
          onChange={handleChange}
          label="Currency"
          className='currency-select-color'
        >
          <MenuItem value={'INR'}>INR</MenuItem>
          <MenuItem value={'USD'}>USD</MenuItem>
          <MenuItem value={'EUR'}>EUR</MenuItem>
        </Select>
      </FormControl>
        </Toolbar>
      </AppBar>
    </div>
  );
}
