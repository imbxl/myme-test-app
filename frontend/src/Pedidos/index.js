//Libraries & Components
import React, { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';
import ArrowBack from '@mui/icons-material/ArrowBack';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { useTour } from '@reactour/tour';
import { format } from 'date-fns'

//Extended Components
import CrearPedido from './crear';

// Helpers
import { getProductos, getPedidos, getStockAlmacen, getAlmacenes } from '../restAPI'
import { useNavigate } from 'react-router-dom';

//Styles
const styleModal = {
  position: 'absolute',
  paddingTop: 3,
  paddingBottom: 4,
  top: '80px',
  left: '50%',
  transform: 'translate(-50%, 0)',
  width: '100%',
  maxWidth: 600,
  borderRadius: '4px',
  bgcolor: 'background.paper',
  border: '1px solid #CCC',
  boxShadow: 24,
};

const defaultAlmacen = window.localStorage.getItem('default-almacen') || '';

const toursteps = [
  {
    selector: '.agregar-tour',
    content: 'Puedes crear un pedido aquí',
  },
  {
    selector: '.seleccionar-tour',
    content: 'Debes seleccionar un almacén aquí',
  },
];

export default function Pedidos({loading, setLoading}) {
  const { setSteps, setIsOpen, setCurrentStep } = useTour();
  const navigate = useNavigate();
  const [almacenes, setAlmacenes] = useState(false);
  const [almacen, setAlmacen] = useState(window.localStorage.getItem('default-almacen') || false);
  const [almacenNombre, setAlmacenNombre] = useState('');
  const [almacen_stock, setAlmacenStock] = useState(false);
  const [pedidosMemoria, setPedidosMemoria] = useState(false);
  const [pedidos, setPedidos] = useState(false);
  const [productos, setProductos] = useState(false);

  const [creando_pedido, setCreandoPedido] = useState(false);
  const handleCrear = () => {
    setCreandoPedido(true);
  };

  const [resetStock, setResetStock] = useState(false);

  const handleChange = (e) => { 
    window.localStorage.setItem('default-almacen',e.target.value);
    setAlmacen(e.target.value);
    for(let item of almacenes){
      if(parseInt(item.id) === parseInt(e.target.value)) setAlmacenNombre(item.nombre+' ('+item.ubicacion+')');
    }
  };

  useEffect(() => {
    if(almacen === false && !resetStock) return;
    setResetStock(false);
    setLoading(true);
    getStockAlmacen(almacen,(data)=>{
      let stocks = {};
      for(let item of data){
        stocks[item.producto] = item.cantidad;
      }
      setLoading(false);
      setAlmacenStock(stocks);
    });
  }, [almacen, setLoading, setAlmacenStock, resetStock, setResetStock]);

  // Mensajes
  const [open_guardado, setOpenGuardado] = useState(false);
  const handleClose_guardado = () => { setOpenGuardado(false); };
  
  useEffect(() => {
    if(open_guardado === true && almacen !== false){
      setResetStock(true);
      setPedidosMemoria(false);
    }
  }, [almacen, open_guardado]);

  useEffect(() => {
    if(almacenes === false){
      setLoading(true);
      getAlmacenes((data)=>{
        for(let item of data){
          if(parseInt(item.id) === parseInt(almacen)) setAlmacenNombre(item.nombre+' ('+item.ubicacion+')');
        }
        setAlmacenes(data);
        getProductos((data)=>{
          setProductos(data);
        });
      });
      return;
    }
    if(almacen === false){
      if(window.localStorage.getItem('pedido-tour') === null){
        setSteps(toursteps);
        setCurrentStep(0);
        setIsOpen(true);
        window.localStorage.setItem('pedido-tour', 1)
      }
      setLoading(false);
      return;
    }
    if(pedidosMemoria === false){
      setLoading(true);
      getPedidos((data)=>{
        setLoading(false);
        if(data===false){
          console.error('Error al cargar los pedidos');
        }else{
          setPedidos(data);
          setPedidosMemoria(data);
        }
      });
    }else{
      setPedidos(pedidosMemoria);
    }
  }, [setPedidos, setLoading, pedidosMemoria, setAlmacenStock, 
    setIsOpen, setCurrentStep, setSteps, almacen, almacenes, setProductos]);

    if(productos !== false) return (<>
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
      <Button className="agregar-tour" onClick={handleCrear}>Crear pedido</Button>
    </Stack>
    {pedidos === false || almacen_stock === false ? '' : <>
    <Grid spacing={2} container>
      <Grid item xl={12} lg={12} md={12} xs={12}>
        <Card>
          <CardContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">ID</TableCell>
                  <TableCell align="center">Productos</TableCell>
                  <TableCell align="center">Creado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pedidos.filter(function (el) {
                    return parseInt(el.almacen.id) === parseInt(almacen);
                  }).map(item => {
                  let id = item.id,
                    creado = format(new Date(item.creado), 'dd/mm/yyyy HH:ii'),
                    productos = [];
                    for(let prod of item.pedido_productos){
                      productos.push(prod.cantidad+' x '+prod.producto.nombre);
                    }
                    return(
                      <TableRow 
                        key={id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell align="center" component="th" scope="row">{id}</TableCell>
                        <TableCell align="center">{productos.join(' | ')}</TableCell>
                        <TableCell align="center">{creado}</TableCell>
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
        message="El pedido se creó correctamente"
    />
    <Modal
      open={creando_pedido !== false}
      onClose={()=>{setCreandoPedido(false)}}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={styleModal}>
      {creando_pedido === false || almacenNombre === '' ? <h1>Sin seleccionar</h1> :  
        <CrearPedido almacen={almacen} almacenNombre={almacenNombre} productos={productos} stock={almacen_stock} setLoading={setLoading} loading={loading} setCreandoPedido={setCreandoPedido} setOpenGuardado={setOpenGuardado} />
      }
      </Box>
    </Modal>
    </>);
}