import axios from 'axios'

const REST_ENDPOINT = 'http://127.0.0.1:8000/api/';
const RestRequest = (metodo, data, url, result) => {
  let token = getToken();
  if(token === false){
    signOut();
    result(false);
  }
  let consulta = false;
  switch(metodo.toLowerCase()){
    default:
    case "get": 
      consulta = axios.get;
    break;
    case "post": 
      consulta = axios.post; 
    break;
    case "put": 
      consulta = axios.put; 
    break;
    case "delete": 
      consulta = axios.delete; 
    break;
  }
  let current_url = REST_ENDPOINT+url;
  let headers = { headers: { Authorization: `token ${token}` } };
  let ejecucion_consulta = false;
  if(['get','delete'].includes(metodo.toLowerCase())){
    ejecucion_consulta = consulta( 
      current_url,
      headers
    );
  }else{
    ejecucion_consulta = consulta( 
      current_url,
      data,
      headers
    );
  }
  ejecucion_consulta.then((data)=>{
    if(typeof data.data !== 'undefined') result(data.data);
    else result(false);
  }).catch((error) => {
    console.log(error);
    if(error.response.request.status === 401){
      signOut();
      window.location.reload();
    }
    result(false);
  });
}

/*
 *
 * Login y Usuario
 *  
 */
export function signOut() {
  window.localStorage.removeItem('APIToken');
  delete window.APIToken;
}
export function getToken(){  
  if(typeof window.APIToken !== 'undefined') return window.APIToken;
  let token = window.localStorage.getItem('APIToken');
  if(token !== null){
    window.APIToken = token;
    return token;
  }
  return false;
}
export function userLogin(user, password, remember, result){
  axios.post(REST_ENDPOINT+'token/', {
    username: user,
    password: password
  })
  .then((response) => {
    if(typeof response.data.token !== 'undefined'){
      let token = response.data.token;
      window.APIToken = token;
      if(remember) window.localStorage.setItem('APIToken', token);
      result(true);
    }else{
      result(false);
    }
  })
  .catch((error) => {
    console.log(error);
    result(false);
  });
}
export function getUserData(result){
  RestRequest('GET', {}, 'user/', (data)=>{
    if(typeof data[0] !== 'undefined') result(data[0]);
    else result(false);
  });
}


/*
 *
 * Productos
 *  
 */
export function getProductos(result){
  RestRequest('GET', {}, 'producto/', result);
}
export function getProducto(id, result){
  RestRequest('GET', {}, 'producto/'+id+'/', result);
}
export function addProducto(data, result){
  RestRequest('POST', data, 'producto/', result);
}
export function setProducto(id, data, result){
  RestRequest('PUT', data, 'producto/'+id+'/', result);
}
export function deleteProducto(id, result){
  RestRequest('DELETE', {}, 'producto/'+id+'/', result);
}


/*
 *
 * Almacenes
 *  
 */
export function getAlmacenes(result){
  RestRequest('GET', {}, 'almacen/', result);
}
export function getAlmacen(id, result){
  RestRequest('GET', {}, 'almacen/'+id+'/', result);
}
export function addAlmacen(data, result){
  RestRequest('POST', data, 'almacen/', result);
}
export function setAlmacen(id, data, result){
  RestRequest('PUT', data, 'almacen/'+id+'/', result);
}
export function deleteAlmacen(id, result){
  RestRequest('DELETE', {}, 'almacen/'+id+'/', result);
}