import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import App from './App';

describe('Home', () => {
  test('Debe renderizarse un logo', async () => {
    render(<MemoryRouter initialEntries={['/']}><App /></MemoryRouter>);
    expect(screen.getByTestId('App-logo')).toBeInTheDocument();
  });
  test('Login si no inició sesión', async () => {
    delete window.APIToken;
    render(<BrowserRouter><App /></BrowserRouter>);
    await waitFor(() => expect(screen.getByTestId('Login-form')).toBeInTheDocument());
  });
});