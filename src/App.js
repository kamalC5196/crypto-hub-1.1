import "./styles.css";
import {BrowserRouter,Route,Routes} from 'react-router-dom';
import Header from './Components/Header'
import HomePage from './Pages/Homepage'
import Coins from './Pages/Coins'

export default function App() {

  return (
    <BrowserRouter> 
    <div className='App'>
      <Header />
      <Routes>
      <Route exact path="/" element={<HomePage />}/>
      <Route path='/coins/:id' element={<Coins />} />
      </Routes>
    </div>
    </BrowserRouter>
  );
}
