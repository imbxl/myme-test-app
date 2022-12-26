//Libraries & Components
import React, { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import ArrowBack from '@mui/icons-material/ArrowBack';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { useTour } from '@reactour/tour';

// Helpers
import { getProductos, updateProductoStock, addProductoStock, getStockAlmacen, getAlmacenes } from '../restAPI'
import { useNavigate } from 'react-router-dom';

const defaultAlmacen = window.localStorage.getItem('default-almacen') || '';

const toursteps = [
  {
    selector: '.search-tour',
    content: 'Puedes filtrar los productos aquí',
  },
  {
    selector: '.seleccionar-tour',
    content: 'Debes seleccionar un almacén aquí',
  },
]

export default function Stock({loading, setLoading}) {
  const { setSteps, setIsOpen, setCurrentStep } = useTour();
  const navigate = useNavigate();
  const [almacenes, setAlmacenes] = useState(false);
  const [almacen, setAlmacen] = useState(window.localStorage.getItem('default-almacen') || false);
  const [almacen_stock, setAlmacenStock] = useState(false);
  const [almacen_stock_data, setAlmacenStockData] = useState(false);
  const [filter, setFilter] = useState("");
  const [productosMemoria, setProductosMemoria] = useState(false);
  const [productos, setProductos] = useState(false);

  const [resetStock, setResetStock] = useState(false);

  const handleChange = (e) => { 
    window.localStorage.setItem('default-almacen',e.target.value);
    setAlmacen(e.target.value);
  };
  useEffect(() => {
    if(almacen === false && !resetStock) return;
    setResetStock(false);
    setLoading(true);
    getStockAlmacen(almacen,(data)=>{
      setAlmacenStockData(data);
      let stocks = {};
      for(let item of data){
        stocks[item.producto] = item.cantidad;
      }
      setLoading(false);
      setAlmacenStock(stocks);
    });
  }, [almacen, setLoading, setAlmacenStockData, setAlmacenStock, resetStock, setResetStock]);

  const changeStock = (producto, nuevoStock) => {
    let idStock = 0;
    for(let item of almacen_stock_data){
      if(producto === parseInt(item.producto)){
        idStock = item.id;
      }
    }
    var current_almacen = almacen;
    if(idStock > 0){
      updateProductoStock(idStock, current_almacen, producto, nuevoStock, (data)=>{
        setLoading(false);
        if(data===false){
          console.error('Error al actualizar el stock del producto');
        }else{
          setOpenGuardado(true);
        }
      });
    }else{
      addProductoStock(current_almacen, producto, nuevoStock, (data)=>{
        setLoading(false);
        if(data===false){
          console.error('Error al agregar el stock del producto');
        }else{
          setOpenGuardado(true);
        }
      });
    }
  }

  // Dialogs
  const [open_eliminando, setOpenEliminando] = useState(0);
  const handleCloseEliminando = () => { setOpenEliminando(0); };
  const handleEliminarAfirmativo = () => { 
    let id = open_eliminando;
    let cantidad = parseInt(document.querySelector('[name="cantidad_consumir"]').value);
    let currentStock = parseInt(typeof almacen_stock[id] !== 'undefined' ? almacen_stock[id] : 0);
    let nuevoStock = currentStock - cantidad;
    if(nuevoStock < 0) nuevoStock = 0;
    setLoading(true);
    setOpenEliminando(0);
    changeStock(id, nuevoStock);
  };
  const [open_agregando, setOpenAgregando] = useState(0);
  const handleCloseAgregando = () => { setOpenAgregando(0); };
  const handleAgregarAfirmativo = () => { 
    let id = open_agregando;
    let cantidad = parseInt(document.querySelector('[name="cantidad_agregar"]').value);
    let currentStock = parseInt(typeof almacen_stock[id] !== 'undefined' ? almacen_stock[id] : 0);
    let nuevoStock = currentStock + cantidad;
    setLoading(true);
    setOpenAgregando(0);
    changeStock(id, nuevoStock);
  };

  // Mensajes
  const [open_guardado, setOpenGuardado] = useState(false);
  const handleClose_guardado = () => { setOpenGuardado(false); };
  
  const handleFilter = (value) => {setFilter(value)};
  
  useEffect(() => {
    if(open_guardado === true && almacen !== false){
      setResetStock(true);
    }
  }, [almacen, open_guardado]);

  useEffect(() => {
    if(almacenes === false){
      setLoading(true);
      getAlmacenes((data)=>{
        setAlmacenes(data);
      });
      return;
    }
    if(almacen === false){
      if(window.localStorage.getItem('stock-tour') === null){
        setSteps(toursteps);
        setCurrentStep(0);
        setIsOpen(true);
        window.localStorage.setItem('stock-tour', 1)
      }
      setLoading(false);
      return;
    }
    if(productosMemoria === false){
      setLoading(true);
      getProductos((data)=>{
        setLoading(false);
        if(data===false){
          console.error('Error al cargar los productos');
        }else{
          setProductos(data);
          setProductosMemoria(data);
        }
      });
    }else{
      let filteredData = productosMemoria.filter(function (el) {
        return el.nombre.toLowerCase().includes(filter.toLowerCase()) || 
          el.sku.toLowerCase().includes(filter.toLowerCase());
      });
      setProductos(filteredData);
    }
  }, [filter, setProductos, setLoading, productosMemoria, setAlmacenStock, 
    setIsOpen, setCurrentStep, setSteps, almacen, almacenes]);

    return (<>
    <Stack justifyContent="flex-end" alignItems="center" direction="row" spacing={2}>
      <Button onClick={()=>navigate('/')}>
        <ArrowBack sx={{marginRight:1}} /> Volver
      </Button>
      <div style={{ marginRight: "auto" }}>
        <FormControl sx={{minWidth:120}} size="small" className="seleccionar-tour">
          {almacenes === false ? <CircularProgress size={28} disableShrink /> : <>
            <InputLabel id="demo-simple-select-label">Almacén</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              defaultValue={defaultAlmacen}
              label="Almacén"
              onChange={handleChange}
            >
            {almacenes !== false && almacenes.map(item => {
              return (<MenuItem key={item.id} value={item.id}>{item.nombre} ({item.ubicacion})</MenuItem>);
            })}
            </Select>
          </>
          }
        </FormControl>
      </div>
      <Chip label={productos.length} color="primary" />
      <TextField className='search-tour' label="Filtrar productos..." size="small" onChange={(element)=>handleFilter(element.target.value)} />
    </Stack>
    {productos === false || almacen_stock === false ? '' : <>
    <Grid spacing={2} container>
      <Grid item xl={12} lg={12} md={12} xs={12}>
        <Card>
          <CardContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Nombre</TableCell>
                  <TableCell align="center">SKU</TableCell>
                  <TableCell align="center">Precio</TableCell>
                  <TableCell align="center">Stock</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productos.map(item => {
                  let id = item.id,
                    nombre = item.nombre,
                    sku = item.sku,
                    precio = item.precio;
                    return(
                      <TableRow 
                        key={id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell align="center" component="th" scope="row">{nombre}</TableCell>
                        <TableCell align="center">{sku}</TableCell>
                        <TableCell align="center">{precio}</TableCell>
                        <TableCell align="center">{
                          typeof almacen_stock[item.id] !== 'undefined' ? almacen_stock[item.id] : '0'
                        }</TableCell>
                        <TableCell align="center">
                          <IconButton onClick={()=>{setOpenEliminando(id)}}><RemoveIcon /></IconButton>
                          <IconButton onClick={()=>{setOpenAgregando(id)}}><AddIcon /></IconButton>
                        </TableCell>
                      </TableRow>);
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
    </>}
    <Snackbar
        sx={{color: 'success.main'}}
        open={open_guardado}
        autoHideDuration={6000}
        onClose={handleClose_guardado}
        message="El Stock del producto se actualizó correctamente"
    />
    <Dialog
      open={open_eliminando>0}
      onClose={handleCloseEliminando}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Consumir unidades de Producto
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          ¿Esta seguro que desea consumir unidades del producto #{open_eliminando}?
        </DialogContentText>
        <br/>
        <TextField
            sx={{minWidth:120}}
            autoComplete="off"
            label="Cantidad a consumir"
            variant="standard"
            InputProps={{ inputProps: { min: 1, max: almacen_stock !== false ? almacen_stock[open_eliminando] : 1 } }}
            name="cantidad_consumir"
            defaultValue={1}
            min={1}
            type="number"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseEliminando}>Cancelar</Button>
        <Button onClick={handleEliminarAfirmativo} color="error" autoFocus>Consumir</Button>
      </DialogActions>
    </Dialog>
    <Dialog
      open={open_agregando>0}
      onClose={handleCloseAgregando}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Agregar unidades de Producto
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          ¿Esta seguro que desea agregar unidades al producto #{open_agregando}?
        </DialogContentText>
        <br/>
        <TextField
            sx={{minWidth:120}}
            autoComplete="off"
            label="Cantidad a agregar"
            variant="standard"
            InputProps={{ inputProps: { min: 1 } }}
            name="cantidad_agregar"
            defaultValue={1}
            min={1}
            type="number"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseAgregando}>Cancelar</Button>
        <Button onClick={handleAgregarAfirmativo} color="success" autoFocus>Agregar</Button>
      </DialogActions>
    </Dialog>
    </>);
}