//Libraries & Components
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';

//Extended Components

// Helpers
import { userLogin } from './restAPI'

export default function Login({setLoading}) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const handleClose = () => { setOpen(false); };
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setLoading(true);
    userLogin(data.get('username'), data.get('password'), data.get('remember')==='remember',(result)=>{
      if(result){
        navigate('/');
      }else{
        setOpen(true);
        setLoading(false);
      }
    });
  };
  useEffect(() => {
    setLoading(false);
  }, [setLoading]);
  return (
    <Box
      data-testid="Login-form"
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Iniciar Sesión
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="Usuario"
          name="username"
          autoComplete="username"
          autoFocus
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Contraseña"
          type="password"
          id="password"
          autoComplete="current-password"
        />
        <FormControlLabel
          control={<Checkbox name="remember" value="remember" color="primary" />}
          label="Recordarme"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Iniciar sesión
        </Button>
      </Box>      
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Datos de acceso incorrectos"
      />
    </Box>
  );
}