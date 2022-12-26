//Libraries & Components
import React, { useEffect, useState } from 'react';
import { getProducto, setProducto, addProducto } from '../restAPI'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

const EditarProducto = ({item_id, setLoading, setEditando, setOpenGuardado, loading}) => {
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
        !nuevos_datos.sku || 
        !nuevos_datos.precio){
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
            addProducto({
                nombre: nuevos_datos.nombre,
                sku: nuevos_datos.sku,
                precio: nuevos_datos.precio
            }, (data)=>{
                setOpenGuardado(true);
                setLoading(false);
            });
        }
        
        // Guardar Edición
        if(item_id > 0){
            setProducto(item_id, {
                nombre: nuevos_datos.nombre,
                sku: nuevos_datos.sku,
                precio: nuevos_datos.precio
            }, (data)=>{
                setOpenGuardado(true);
                setLoading(false);
            });
        }
    };

    useEffect(() => {
        // Agregar producto
        if(item_id === -1){
            setLoading(false);
            let default_data = {
                nombre:'',
                sku:'',
                precio:''
            }
            setDatos(default_data);
            setNuevosDatos(default_data);
        }
        
        // Editar producto existente
        if(item_id > 0){
            getProducto(item_id, (data)=>{
                setLoading(false);
                if(data===false){
                    console.error('Error al cargar los datos del producto');
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
                {item_id === -1 ? 'Agregar producto' : 'Editar producto #'+datos.id}
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
            <Grid container item sx={{paddingRight:2}}>
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
                    error={invalid.sku}
                    fullWidth
                    autoComplete="off"
                    label="SKU"
                    variant="standard"
                    name="sku"
                    defaultValue={datos.sku}
                    onChange={(e)=>handleChange(e)}
                /> : ''}
            </Grid>
            <Grid item xl={6} lg={6} md={6} xs={12} sx={{paddingRight:2}}>
                {datos !== false ? <TextField
                    error={invalid.precio}
                    fullWidth
                    autoComplete="off"
                    label="Precio"
                    variant="standard"
                    name="precio"
                    defaultValue={datos.precio}
                    onChange={(e)=>handleChange(e)}
                    type="number"
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

export default EditarProducto;
