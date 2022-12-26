//Libraries & Components
import React, { useEffect, useState } from 'react';
import { addPedido } from '../restAPI'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const CrearPedido = ({almacen, productos, stock, almacenNombre, setLoading, setCreandoPedido, setOpenGuardado, loading}) => {
    const [datos, setDatos] = useState([]);

    const [invalid, setInvalid] = useState({});

    const [currentStock, setCurrentStock] = useState(0);
    const [total, setTotal] = useState(0);

    const handleChange = (e) => {
        for(let item of productos){
            if(parseInt(item.id) === parseInt(e.target.value)){
                setCurrentStock(parseInt(stock[e.target.value]));
                document.querySelector('[name="cantidad"]').value = 1;
            }
        }
    };

    const getProdDatos = (producto_id) => { 
        for(let item of productos){
            if(parseInt(item.id) === parseInt(producto_id)){
                return item;
            }
        }
    }

    const getProdIndice = (producto_id) => { 
        for(let i in datos){
            if(parseInt(datos[i].id) === parseInt(producto_id)){
                return i;
            }
        }
        return false;
    }

    const handleAdd = (e) => { 
        let validar = Object.assign({}, invalid);
        let error = false;
        document.querySelectorAll('#form_edit_add input').forEach((e)=>{
            let name = e.name
            let value = e.value === '' || e.value === '0'
            validar[name] = value;
            if(value) error = true;
        });        
        setInvalid(validar);
        if(!error){
            let producto_id = parseInt(document.querySelector('[name="producto"]').value);
            let cantidad = parseInt(document.querySelector('[name="cantidad"]').value);
            let prodData = getProdDatos(producto_id);
            let prodIndice = getProdIndice(producto_id);
            if(prodIndice === false){
                prodData['cantidad'] = cantidad;
                setDatos([...datos,prodData]);
            }else{
                const newDatos = datos.map(item => {
                  if (parseInt(item.id) === producto_id) {
                    let newCant = item.cantidad + cantidad;
                    if(newCant > currentStock) newCant = currentStock;
                    return {...item, cantidad: newCant};
                  }
                  return item;
                });
                setDatos(newDatos);
            }
        }
    };

    const handleDelete = (id) => { 
        setDatos(datos.filter(function(item) { 
            return parseInt(id) !== parseInt(item.id)
        }));
    };

    const handleGuardar = () => {
        // Validaciones
        if(datos.length === 0){
            let validar = Object.assign({}, invalid);
            document.querySelectorAll('#form_edit_add input').forEach((e)=>{
                let name = e.name
                let value = e.value === ''
                validar[name] = value;
            });
            setInvalid(validar);
            return;
        }

        setCreandoPedido(false);
        setLoading(true);

        // Agregar
        let pedido_productos = [];
        for(let item of datos){
            pedido_productos.push({
                producto: item.id,
                cantidad: item.cantidad
            });
        }
        addPedido({
            almacen: almacen,
            total: total,
            pedido_productos: pedido_productos
        }, (data)=>{
            setOpenGuardado(true);
            setLoading(false);
        });
    };
    useEffect(() => {
        let newtotal = 0;
        for(let item of datos){
            newtotal += parseFloat(item.precio) * parseInt(item.cantidad);
        }
        setTotal(newtotal.toFixed(2));
    }, [datos]);

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
                Crear pedido
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
                {almacenNombre !== '' ? <p>Almacén: <b>{almacenNombre}</b></p> : ''}
            </Grid>
            <Grid container item sx={{paddingRight:2}}>
                <TableContainer sx={{ width: '100%' }}>
                    <Table sx={{ width: '100%' }} size="small" aria-label="a dense table">
                        <TableHead>
                        <TableRow>
                            <TableCell align="left">Producto</TableCell>
                            <TableCell align="center">SKU</TableCell>
                            <TableCell align="center">Precio</TableCell>
                            <TableCell align="center">Cantidad</TableCell>
                            <TableCell align="center">Acciones</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody className="listaProductos">
                        {datos.map((row) => (
                            <TableRow
                            key={row.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell align="left">{row.nombre}</TableCell>
                                <TableCell align="center">{row.sku}</TableCell>
                                <TableCell align="center">{row.precio}</TableCell>
                                <TableCell align="center" className='cantidad'>{row.cantidad}</TableCell>
                                <TableCell align="center">
                                    <IconButton onClick={()=>handleDelete(row.id)} size="small"><DeleteIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                            <TableRow
                            key={'total'}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell colSpan={4} align="left"><b>Total</b></TableCell>
                                <TableCell align="center"><b>${total}</b></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
            <Grid container item sx={{paddingRight:1, alignItems: 'flex-end'}}>
                <Grid item sx={{flexGrow: 1, paddingRight:2}}>
                    <FormControl fullWidth size="small">
                        <InputLabel id="demo-simple-select-label2">Producto</InputLabel>
                        <Select
                            fullWidth
                            labelId="demo-simple-select-label2"
                            error={invalid.producto}
                            defaultValue=""
                            label="Producto"
                            name="producto"
                            onChange={handleChange}
                            >
                            {productos !== false && productos.map(item => {
                                return (<MenuItem key={item.id} value={item.id}>{item.nombre} ({item.sku})</MenuItem>);
                            })}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item sx={{paddingRight:2, width:80}}>
                    <TextField
                        error={invalid.cantidad}
                        fullWidth 
                        size="small"
                        autoComplete="off"
                        label="Cantidad"
                        variant="standard"
                        InputProps={{ inputProps: { min: 1, max: currentStock } }}
                        name="cantidad"
                        defaultValue={1}
                        type="number"
                    />
                </Grid>
                <Grid item>
                    <IconButton onClick={handleAdd} color="primary" size="small"><AddIcon /></IconButton>
                </Grid>
            </Grid>
            <Grid container item sx={{paddingRight:2, marginTop:2}}>
                <Button sx={{paddingRight:3}} onClick={()=>setCreandoPedido(false)}>
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

export default CrearPedido;
