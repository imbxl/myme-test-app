//Libraries & Components
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import { TourProvider } from '@reactour/tour'

//Extended Components
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <TourProvider>
      <App />
    </TourProvider>
  </BrowserRouter>
);