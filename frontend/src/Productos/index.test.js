import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from "react-router-dom";
import App from '../App';

describe('Productos', () => {
  test('Debe tener un botón de agregar', async () => {
    render(<MemoryRouter initialEntries={['/productos/']}><App /></MemoryRouter>);
    await waitFor(() => expect(screen.getByText(/agregar/i)).toBeInTheDocument());
  });
  test('Formulario al clickear en agregar', async () => {
    render(<MemoryRouter initialEntries={['/productos/']}><App /></MemoryRouter>);
    await waitFor(() => expect(screen.getByText(/agregar/i)).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText(/Nombre/i)).toBeInTheDocument());
  });
}); 