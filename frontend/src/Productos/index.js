//Libraries & Components
import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Snackbar from '@mui/material/Snackbar';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { useTour } from '@reactour/tour';

//Extended Components
import EditarProducto from './editar';

// Helpers
import { getProductos, deleteProducto } from '../restAPI'
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

const toursteps = [
  {
    selector: '.agregar-tour',
    content: 'Puedes agregar productos aquí',
  },
  {
    selector: '.search-tour',
    content: 'Puedes filtrar los productos aquí',
  },
]

export default function Productos({loading, setLoading}) {
  const { setSteps, setIsOpen, setCurrentStep } = useTour();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("");
  const [productosMemoria, setProductosMemoria] = useState(false);
  const [productos, setProductos] = useState(false);

  const [editando_producto, setEditando] = useState(0);

  // Dialogs
  const [open_eliminando, setOpenEliminando] = useState(0);
  const handleCloseEliminando = () => { setOpenEliminando(0); };
  const handleEliminarAfirmativo = () => { 
    let id = open_eliminando;
    setLoading(true);
    setOpenEliminando(0);
    deleteProducto(id,(data)=>{
      setLoading(false);
      if(data===false){
        console.error('Error al eliminar el producto');
      }else{
        setOpenEliminado(true);
        setProductosMemoria(false);
      }
    });
  };

  // Mensajes
  const [open_guardado, setOpenGuardado] = useState(false);
  const handleClose_guardado = () => { setOpenGuardado(false); };
  const [open_eliminado, setOpenEliminado] = useState(false);
  const handleClose_eliminado = () => { setOpenEliminado(false); };
  
  const handleFilter = (value) => {setFilter(value)};

  const handleAgregar = () => {
    setEditando(-1);
  };
  
  useEffect(() => {
    if(editando_producto !== 0) setLoading(true);
  }, [editando_producto, setLoading]);
  
  useEffect(() => {
    if(open_guardado) setProductosMemoria(false);
  }, [open_guardado, setOpenGuardado, setLoading]);

  useEffect(() => {
    if(productosMemoria === false){
      setLoading(true);
      getProductos((data)=>{
        setLoading(false);
        if(data===false){
          console.error('Error al cargar los productos');
        }else{
          setProductos(data);
          setProductosMemoria(data);
          if(window.localStorage.getItem('producto-tour') === null){
            setSteps(toursteps);
            setCurrentStep(0);
            setIsOpen(true);
            window.localStorage.setItem('producto-tour', 1)
          }
        }
      });
    }else{
      let filteredData = productosMemoria.filter(function (el) {
        return el.nombre.toLowerCase().includes(filter.toLowerCase()) || 
          el.sku.toLowerCase().includes(filter.toLowerCase());
      });
      setProductos(filteredData);
    }
  }, [filter, setProductos, setLoading, productosMemoria, setIsOpen, setCurrentStep, setSteps]);

  if(productos !== false){
    return (<>
    <Stack justifyContent="flex-end" alignItems="center" direction="row" spacing={2}>
      <Button sx={{ marginRight: "auto"}} onClick={()=>navigate('/')}>
        <ArrowBack sx={{marginRight:1}} /> Volver
      </Button>
      <Button className="agregar-tour" onClick={handleAgregar}>Agregar</Button>
      <Chip label={productos.length} color="primary" />
      <TextField className='search-tour' label="Filtrar productos..." size="small" onChange={(element)=>handleFilter(element.target.value)} />
    </Stack>
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
                        <TableCell align="center">${precio}</TableCell>
                        <TableCell align="center">
                          <IconButton onClick={()=>{setEditando(id)}}><EditIcon /></IconButton>
                          <IconButton onClick={()=>{setOpenEliminando(id)}}><DeleteIcon /></IconButton>
                        </TableCell>
                      </TableRow>);
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
    <Snackbar
        sx={{color: 'success.main'}}
        open={open_guardado}
        autoHideDuration={6000}
        onClose={handleClose_guardado}
        message="Producto guardado correctamente"
    />
    <Snackbar
        sx={{color: 'danger.main'}}
        open={open_eliminado}
        autoHideDuration={6000}
        onClose={handleClose_eliminado}
        message="Producto eliminado correctamente"
    />
    <Dialog
      open={open_eliminando>0}
      onClose={handleCloseEliminando}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Eliminar Producto
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Esta seguro que desea eliminar el producto #{open_eliminando}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseEliminando}>Cancelar</Button>
        <Button onClick={handleEliminarAfirmativo} color="error" autoFocus>Eliminar</Button>
      </DialogActions>
    </Dialog>
    <Modal
      open={editando_producto !== 0}
      onClose={()=>{setEditando(0)}}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={styleModal}>
      {editando_producto === 0 ? <h1>Sin seleccionar</h1> :  
        <EditarProducto item_id={editando_producto} setLoading={setLoading} loading={loading} setEditando={setEditando} setOpenGuardado={setOpenGuardado} />
      }
      </Box>
    </Modal>
    </>);
  }
}