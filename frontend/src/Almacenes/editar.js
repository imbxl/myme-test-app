//Libraries & Components
import React, { useEffect, useState } from 'react';
import { getAlmacen, setAlmacen, addAlmacen } from '../restAPI'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

const EditarAlmacen = ({item_id, setLoading, setEditando, setOpenGuardado, loading}) => {
    const [datos, setDatos] = useState(false);

    const [nuevos_datos, setNuevosDatos] = useState({});

    const [invalid, setInvalid] = useState({});

    const handleChange = (e) => { 
        let datos = nuevos_datos;
        datos[e.target.name] = e.target.value;
        setNuevosDatos(datos);

        let validar = Object.assign({}, invalid);
        let name = e.target.name
        let value = e.target.value === ''
        validar[name] = value;
        setInvalid(validar);
    };

    const handleGuardar = () => {
        // Validaciones
        if(!nuevos_datos.nombre || 
        !nuevos_datos.ubicacion){
            let validar = Object.assign({}, invalid);
            document.querySelectorAll('#form_edit_add input').forEach((e)=>{
                let name = e.name
                let value = e.value === ''
                validar[name] = value;
            });
            setInvalid(validar);
            return;
        }

        setEditando(0);
        setLoading(true);

        // Agregar
        if(item_id === -1){
            addAlmacen(nuevos_datos, (data)=>{
                setOpenGuardado(true);
                setLoading(false);
            });
        }
        
        // Guardar Edición
        if(item_id > 0){
            setAlmacen(item_id, nuevos_datos, (data)=>{
                setOpenGuardado(true);
                setLoading(false);
            });
        }
    };

    useEffect(() => {
        // Agregar item
        if(item_id === -1){
            setLoading(false);
            let default_data = {
                nombre:'',
                ubicacion:''
            }
            setDatos(default_data);
            setNuevosDatos(default_data);
        }
        
        // Editar item existente
        if(item_id > 0){
            getAlmacen(item_id, (data)=>{
                setLoading(false);
                if(data===false){
                    console.error('Error al cargar los datos del almacen');
                }else{
                    setDatos(data);
                    setNuevosDatos(data);
                }
            });
        }
    }, [item_id, setLoading]);
    return (<>
        <CircularProgress sx={{margin: 5}} size={28} disableShrink style={{display: loading ? 'block' : 'none'}} />
        <Box
            sx={{
                display: loading ? 'none' : '',
                paddingLeft: 3,
                paddingRight: 3, 
                marginBottom:2
            }}
        >
            <Typography component="h1" variant="h5">
                {item_id === -1 ? 'Agregar almacén' : 'Editar almacén #'+datos.id}
            </Typography>
        </Box>
        <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap'
            }}
            component='form'
            id="form_edit_add"
        >
        <Grid sx={{marginLeft:1, marginRight:1, display: loading ? 'none' : ''}} spacing={2} container>
            <Grid item xl={6} lg={6} md={6} xs={12} sx={{paddingRight:2}}>
                {datos !== false ? <TextField
                    error={invalid.nombre}
                    fullWidth
                    autoComplete="off"
                    label="Nombre"
                    variant="standard"
                    name="nombre"
                    defaultValue={datos.nombre}
                    onChange={(e)=>handleChange(e)}
                /> : ''}
            </Grid>
            <Grid item xl={6} lg={6} md={6} xs={12} sx={{paddingRight:2}}>
                {datos !== false ? <TextField
                    error={invalid.ubicacion}
                    fullWidth
                    autoComplete="off"
                    label="Ubicación"
                    variant="standard"
                    name="ubicacion"
                    defaultValue={datos.ubicacion}
                    onChange={(e)=>handleChange(e)}
                /> : ''}
            </Grid>
            <Grid container item sx={{paddingRight:2, marginTop:2}}>
                <Button sx={{paddingRight:3}} onClick={()=>setEditando(0)}>
                    Cancelar
                </Button>
                <Button onClick={handleGuardar} variant="contained" color="success">
                    Guardar
                </Button>
            </Grid>
        </Grid>
        </Box>
    </>);
};

export default EditarAlmacen;
