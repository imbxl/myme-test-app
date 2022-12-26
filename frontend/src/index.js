//Libraries & Components
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import { TourProvider } from '@reactour/tour'

//Extended Components
import App from './App';

const steps = [
  {
    selector: '.agregar-tour',
    content: 'Puedes agregar registros aquí',
  },
  {
    selector: '.search-tour',
    content: 'Puedes filtrar los registros aquí',
  },
]

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <TourProvider steps={steps}>
      <App />
    </TourProvider>
  </BrowserRouter>
);