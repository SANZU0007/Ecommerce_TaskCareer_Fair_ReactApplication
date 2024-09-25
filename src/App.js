import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import HomePage from './components/HomePage';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<HomePage/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Signup/>}/>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
