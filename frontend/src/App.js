//Libraries & Components
import React, {useState, useEffect} from 'react';
import {
  useNavigate, 
  Routes,
  useLocation,
  Link,
  Route
} from "react-router-dom";
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import CssBaseline from '@mui/material/CssBaseline';
import LogoutIcon from '@mui/icons-material/Logout';

//Styles
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './index.css';

// Resources
import logo from './logo.svg';

//Extended Components
import Home from './home';
import Almacenes from './Almacenes';
import Productos from './Productos';
import Stock from './Stock';
import Pedidos from './Pedidos';
import Login from './login';
import Error404 from './404';

// Helpers
import { getToken, getUserData, signOut } from './restAPI'

const initialStateUser = {username:'', id:0};

export default function App() {
  const navigate = useNavigate();
  const locacion = useLocation();
  const [iniciado, setIniciado] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(initialStateUser);

  const handleSignOut = () => {
    signOut();
    setUser(initialStateUser);
    setIniciado(false);
    navigate('/login/');
  }

  useEffect(() => {
    let token = getToken();
    if(token === false){
      setIniciado(false);
      navigate('/login/');
    }else{
      getUserData((data)=>{
        if(data !== false){
          setIniciado(true);
          setUser(data);
        } 
        else console.log('Error al obtener los datos del usuario');
      });
    }
  }, [navigate]);

  return (
    <Container maxWidth="lg">
      <CssBaseline />
      <Grid spacing={2} container justifyContent={"space-between"} alignItems="flex-end">
        <Grid item>
          <Link to='/'><img src={logo} data-testid="App-logo" alt="logo" /></Link>
        </Grid>
        <Grid item>
          <h3 style={{margin: 2}}>
            {
              locacion.pathname === '/productos/' ? 'Administrar productos' : 
              locacion.pathname === '/almacenes/' ? 'Administrar almacenes' : 
              locacion.pathname === '/stock/' ? 'Administrar stock' : 
              locacion.pathname === '/pedidos/' ? 'Administrar pedidos' : 
              'Stock App'
            }
          </h3>
        </Grid>
        <Grid item>
          <Grid spacing={1} container justifyContent={"space-between"} alignItems="center">
            <Grid item style={{minWidth: 36}}><CircularProgress size={28} disableShrink style={{display: loading ? 'block' : 'none'}} /></Grid>
            <Grid item style={{display: iniciado ? 'block' : 'none'}}><span>Bienvenido {user.username}</span></Grid>
            <Grid item style={{display: iniciado ? 'block' : 'none'}}><IconButton onClick={handleSignOut} size="small"><LogoutIcon /></IconButton></Grid>
          </Grid>
        </Grid>
      </Grid>
      <hr/>
      <Routes>
        <Route index element={<Home setLoading={setLoading} iniciado={iniciado} loading={loading} />} />
        <Route path="/login/" element={<Login setLoading={setLoading} iniciado={iniciado} loading={loading}  />} />
        <Route path="/productos/" element={<Productos setLoading={setLoading} iniciado={iniciado} loading={loading}  />} />
        <Route path="/almacenes/" element={<Almacenes setLoading={setLoading} iniciado={iniciado} loading={loading}  />} />
        <Route path="/stock/" element={<Stock setLoading={setLoading} iniciado={iniciado} loading={loading}  />} />
        <Route path="/pedidos/" element={<Pedidos setLoading={setLoading} iniciado={iniciado} loading={loading}  />} />
        <Route path="*" element={<Error404 setLoading={setLoading} />} />
      </Routes>
    </Container>
  );
}