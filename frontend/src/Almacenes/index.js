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
import EditarAlmacen from './editar';

// Helpers
import { getAlmacenes, deleteAlmacen } from '../restAPI'
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

export default function Almacenes({loading, setLoading}) {
  const { setIsOpen } = useTour();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("");
  const [itemsMemoria, setAlmacensMemoria] = useState(false);
  const [items, setAlmacens] = useState(false);

  const [editando_item, setEditando] = useState(0);

  // Dialogs
  const [open_eliminando, setOpenEliminando] = useState(0);
  const handleCloseEliminando = () => { setOpenEliminando(0); };
  const handleEliminarAfirmativo = () => { 
    let id = open_eliminando;
    setLoading(true);
    setOpenEliminando(0);
    deleteAlmacen(id,(data)=>{
      setLoading(false);
      if(data===false){
        console.error('Error al eliminar el almacén');
      }else{
        setOpenEliminado(true);
        setAlmacensMemoria(false);
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
    if(editando_item !== 0) setLoading(true);
  }, [editando_item, setLoading]);
  
  useEffect(() => {
    if(open_guardado) setAlmacensMemoria(false);
  }, [open_guardado, setOpenGuardado, setLoading]);

  useEffect(() => {
    if(itemsMemoria === false){
      setLoading(true);
      getAlmacenes((data)=>{
        setLoading(false);
        if(data===false){
          console.error('Error al cargar los almacenes');
        }else{
          if(window.localStorage.getItem('almacen-tour') === null){
            setIsOpen(true);
            window.localStorage.setItem('almacen-tour', 1)
          }
          setAlmacens(data);
          setAlmacensMemoria(data);
        }
      });
    }else{
      let filteredData = itemsMemoria.filter(function (el) {
        return el.nombre.toLowerCase().includes(filter.toLowerCase()) || 
          el.sku.toLowerCase().includes(filter.toLowerCase());
      });
      setAlmacens(filteredData);
    }
  }, [filter, setAlmacens, setLoading, itemsMemoria, setIsOpen]);

  if(items !== false){
    return (<>
    <Stack justifyContent="flex-end" alignItems="center" direction="row" spacing={2}>
      <Button sx={{ marginRight: "auto"}} onClick={()=>navigate('/')}>
        <ArrowBack sx={{marginRight:1}} /> Volver
      </Button>
      <Button className="agregar-tour" onClick={handleAgregar}>Agregar</Button>
      <Chip label={items.length} color="primary" />
      <TextField className='search-tour' label="Filtrar items..." size="small" onChange={(element)=>handleFilter(element.target.value)} />
    </Stack>
    <Grid spacing={2} container>
      <Grid item xl={12} lg={12} md={12} xs={12}>
        <Card>
          <CardContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Nombre</TableCell>
                  <TableCell align="center">Ubicación</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map(item => {
                  let id = item.id,
                    nombre = item.nombre,
                    ubicacion = item.ubicacion;
                    return(
                      <TableRow 
                        key={id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell align="center" component="th" scope="row">{nombre}</TableCell>
                        <TableCell align="center">{ubicacion}</TableCell>
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
        message="Almacen guardado correctamente"
    />
    <Snackbar
        sx={{color: 'danger.main'}}
        open={open_eliminado}
        autoHideDuration={6000}
        onClose={handleClose_eliminado}
        message="Almacen eliminado correctamente"
    />
    <Dialog
      open={open_eliminando>0}
      onClose={handleCloseEliminando}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Eliminar Almacen
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Esta seguro que desea eliminar el almacén #{open_eliminando}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseEliminando}>Cancelar</Button>
        <Button onClick={handleEliminarAfirmativo} color="error" autoFocus>Eliminar</Button>
      </DialogActions>
    </Dialog>
    <Modal
      open={editando_item !== 0}
      onClose={()=>{setEditando(0)}}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={styleModal}>
      {editando_item === 0 ? <h1>Sin seleccionar</h1> :  
        <EditarAlmacen item_id={editando_item} setLoading={setLoading} loading={loading} setEditando={setEditando} setOpenGuardado={setOpenGuardado} />
      }
      </Box>
    </Modal>
    </>);
  }
}