//Libraries & Components
import React, { useEffect, Component } from 'react';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { purple, blue, teal, green } from '@mui/material/colors';

class CardItem extends Component{
  render() {
    return (
      <Grid item xl={6} lg={6} md={6} xs={12}>
        <Card style={{backgroundColor: this.props.color}}>
          <CardActionArea onClick={this.props.click}>
            <CardContent>
              <Typography variant="h5" component="div" my={5} align="center">
                {this.props.name}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    );
  }
}

export default function Home({iniciado, setLoading}) {
  const navigate = useNavigate();

  useEffect( () => {
    setLoading(false);
  }, [setLoading, iniciado]);

  return (
    <>
      <Grid spacing={2} container style={{display: iniciado ? '' : 'none'}}>
        <CardItem name="Almacenes" click={()=>navigate("/almacenes/")} color={purple[200]}/>
        <CardItem name="Productos" click={()=>navigate("/productos/")} color={teal[200]}/>
        <CardItem name="Stock" click={()=>navigate("/stock/")} color={blue[200]}/>
        <CardItem name="Pedidos" click={()=>navigate("/pedidos/")} color={green[200]}/>
      </Grid>
    </>
  );
}