import {useState,useEffect,useMemo} from 'react';
import {HistoricalChart} from '../api/api';
import {CryptoState} from '../CryptoContext';
import { makeStyles,CircularProgress,createTheme,ThemeProvider } from '@material-ui/core';
import axios from 'axios';
import { Chart } from 'chart.js/auto';
import { Line } from "react-chartjs-2";
import { chartDays } from "../api/data";
import SelectButton from "./SelectButton";

const useStyles = makeStyles((theme) => ({
    container: {
      width: "75%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 25,
      padding: 40,
      [theme.breakpoints.down("md")]: {
        width: "100%",
        marginTop: 0,
        padding: 20,
        paddingTop: 0,
      },
    },
  }));

export default function CoinInfo ({coin}){
const [history,setHistory] = useState([]);
const [days,setDays] = useState(1);
const [flag,setflag] = useState(false)
const {currency} = CryptoState();
const classes = useStyles();

const fetchData = async () => {
  const {data} = await axios.get(HistoricalChart(coin.id,days,currency));
  setHistory(data.prices);
  setflag(true);
}

useEffect(()=>{
  fetchData();
},[currency,days])

const theme = useMemo(
    () =>
      createTheme({
        palette: {
          type: 'dark',
          primary:{
            main:'#FFD700',
          },
        },
      }),
    [],
  );


return (<ThemeProvider theme={theme}>
      <div className={classes.container}>
        {!history | flag===false ? (
          <CircularProgress
            style={{ color: "#00d09c" }}
            size={250}
            thickness={1}
          />
        ) : (
          <>
            <Line
              data={{
                labels: history.map((coin) => {
                  let date = new Date(coin[0]);
                  let time =
                    date.getHours() > 12
                      ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                      : `${date.getHours()}:${date.getMinutes()} AM`;
                  return days === 1 ? time : date.toLocaleDateString();
                }),

                datasets: [
                  {
                    data: history.map((coin) => coin[1]),
                    label: `Price ( Past ${days} Days ) in ${currency}`,
                    borderColor: "#00d09c",
                  },
                ],
              }}
              options={{
                elements: {
                  point: {
                    radius: 1,
                  },
                },
              }}
            />
            <div
              style={{
                display: "flex",
                marginTop: 20,
                justifyContent: "space-around",
                width: "100%",
              }}
            >
              {chartDays.map((day) => (
                <SelectButton
                  key={day.value}
                  onClick={() => {setDays(day.value);
                    setflag(false);
                  }}
                  selected={day.value === days}
                >
                  {day.label}
                </SelectButton>
              ))}
            </div>
          </>
        )}
      </div>
    </ThemeProvider>)
}

