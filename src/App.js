import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import HomePage from './components/HomePage';
import ProductPage from './components/ProductPage';
import AllProduct from './components/Admin/ALLproduct';


function App() {
  return (
    <BrowserRouter>
    <Routes>

    
      <Route path='/product' element={<HomePage/>}/>
      <Route path='/' element={<Login/>}/>
      <Route path='/register' element={<Signup/>}/>
      <Route path='/product/:id' element={<ProductPage/>}/>
      <Route path='/admin' element={<AllProduct/>}/>
     
      
    </Routes>
    </BrowserRouter>
  );
}

export default App;
