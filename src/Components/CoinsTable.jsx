import axios from 'axios';
import {useState,useEffect,useMemo,useCallback} from 'react';
import {CoinList} from '../api/api';
import {CryptoState} from '../CryptoContext';
import {Container,Typography,TextField,ThemeProvider ,createTheme,TableContainer,Table,TableHead,TableRow,TableCell,TableBody} from '@material-ui/core';
import { makeStyles,LinearProgress } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import {useNavigate} from 'react-router-dom';
import {numberWithCommas} from './Banner/Banner';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  pagination:{
    "& .MuiPaginationItem-root":{
      color:'gold,'
    },
  }
}));

function CoinsTable(){
  const {currency,symbol} = CryptoState();
  const [coins,setCoins] = useState([]);
  const [loading,setLoading] = useState(true);
  const [search,setSearch] = useState('');
  const [page,setPage] = useState(1);
  const classes = useStyles();
  const navigate = useNavigate();
  
  const fetchCoins = async () => {
    
    const {data} = await axios.get(CoinList(currency));
    setCoins(data);
    setLoading(false);
  }

  useEffect(()=>{
    setLoading(true);
    fetchCoins()  
  },[currency])

  useEffect(()=>{
    window.scroll(0,450);
  },[page])

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          type: 'dark',
          primary:{
            // main:'#FFD700',
            main: '#00d09c',
          },
        },
      }),
    [],
  );

 const handleSearch = useCallback((e)=>{
   setSearch(e.target.value);
 },[])

 const handlePagination = useCallback((_,value)=>{
   setPage(value);
 },[])
  function coinsDisplay(){
    return coins.filter((coin)=>coin.name.toLowerCase().includes(search.toLowerCase()) || coin.symbol.toLowerCase().includes(search.toLowerCase()))
  }

  const display = coinsDisplay();

  return(
  <ThemeProvider theme={theme}>
  <Container style={{textAlign:'center'}}>
    <Typography variant='h4' style={{fontFamily:'Montserrat',margin:30}}>Cryptocurrency Prices by Market Cap
    </Typography>
    <TextField label='Search for a Cryptocurrency' variant='outlined' style={{marginBottom:20,width:'100%', color:'gold'}} onChange={(e)=>handleSearch(e)} value={search}/>
    {loading?(<div className={classes.root}>
      <LinearProgress />
    </div>):(
    <TableContainer>
      <Table>
        <TableHead style={{backgroundColor:'#00d09c'}}>
          <TableRow>
            {
              ['Coin','Price','24h change','Market Cap'].map(head=>(
                <TableCell style={{color:'black',fontWeight:'700',fontFamily:'Montserrat'}} key={head} align={head==='Coin'?'':'right'}>{head}
                </TableCell>
              ))
            }
          </TableRow>        
        </TableHead>
        <TableBody>
        {
          display.slice((page-1)*10, (page-1)*10 + 10).map(row=>{
            const profit = row.price_change_percentage_24h > 0;
            return(
              <TableRow onClick={()=>navigate(`/coins/${row.id}`)} key={row.name} className='coin-row'>
                <TableCell component='th' scope='row' style={{display:'flex',gap:15}}>
                <img src={row.image} alt={row.name} height='50' style={{marginBottom:10}}/>
                <div style={{display:'flex',flexDirection:'column'}}>
                  <span style={{textTransform:'uppercase',fontSize:22, color:'#00d09c'}}>
                  {row.symbol}
                  </span>
                  <span style={{color:'darkgrey'}}>{row.name}</span>
                </div>
                </TableCell>
                <TableCell align='right'>
                  <span>{symbol} {numberWithCommas(row.current_price.toFixed(2))}</span>
                </TableCell>
                <TableCell align='right' style={{color:profit?'lime':'red',fontWeight:500}}>
                  {profit && '+'}{row.price_change_percentage_24h.toFixed(2)+'%'}
                </TableCell>
                <TableCell align='right'>
                  <span>{symbol} {numberWithCommas(row.market_cap.toString().slice(0,-6))}M</span>
                </TableCell>
              </TableRow>
            )
          })
        }
        </TableBody>
      
      </Table>
    </TableContainer>
       )
    } 
     <Pagination color='primary' classes={{ul: classes.pagination}} style={{padding:20,width:'100%',display:'flex',justifyContent:'center'}} count={(display?.length/10).toFixed(0)} onChange={handlePagination}/>
      </Container> 
  </ThemeProvider>

  )
}

export default CoinsTable;