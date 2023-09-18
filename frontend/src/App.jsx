import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./utils/PrivateRoute";
import Home from "./pages/home/home";
import Order from "./pages/order/order";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import Product from "./pages/product/product";
import Layout from "./pages/layout";

function App() {

  return (
    <BrowserRouter>
      
      <AuthProvider>
        <Routes>

          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/order" element={<PrivateRoute component={Order} />}/>
          </Route>

          <Route>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
