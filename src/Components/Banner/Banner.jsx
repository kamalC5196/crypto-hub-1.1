import {useEffect,useState,useMemo} from 'react';
import {TrendingCoins} from '../../api/api';
import {CryptoState} from '../../CryptoContext';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import {Link} from 'react-router-dom';
import { makeStyles,CircularProgress,createTheme,ThemeProvider } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
      alignItems:'center',
      justifyContent:'center',
  },
}));

export function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

const Banner = () => {
  const {currency,symbol} = CryptoState();  
  const TrendingCoinsUrl = TrendingCoins(currency);
  const [trending,setTrending] = useState([]);
  const classes = useStyles();

  useEffect(()=>{
    fetch(TrendingCoinsUrl)
    .then(data=>data.json())
    .then(json=>setTrending(json))      
  },[TrendingCoinsUrl])

  

  const responsive = {
      0: {
          items: 2,
      },
      800: {
          items: 4,
      }
    }

    const theme = useMemo(
    () =>
      createTheme({
        palette: {
          type: 'dark',
          primary:{
            main:'#00d09c',
          },
        },
      }),
    [],
  );

  const items = trending.map(coin=>{
    const profit = coin.price_change_percentage_24h >=0;
    return (
      <Link to={`/coins/${coin.id}`} className='carousel-item'>
      <img
        src={coin?.image}
        alt={coin.name}
        height='80'
        style={{marginBottom:10}}
      />
      <span>{coin?.symbol}&nbsp;
      <span style={{color:profit?'lime':'red'}}>{profit && '+'}{coin.price_change_percentage_24h.toFixed(2)+'%'}</span> 
      </span>
      <span style={{fontSize:22,fontWeight:500}}>{symbol} {numberWithCommas(coin.current_price.toFixed(2))}</span>
      </Link>
    )
  })

  return trending.length>0?(<div className='banner'>
  <AliceCarousel mouseTracking 
  infinite 
  autoPlayInterval={1000}
  animationDuration={1500}
  disableDotsControls
  responsive={responsive}
  autoPlay
  disableButtonsControls
  items={items}
  />
  </div>):
  (<ThemeProvider theme={theme}><div className={classes.root}>
      <CircularProgress /></div></ThemeProvider>
)
}

export default Banner;