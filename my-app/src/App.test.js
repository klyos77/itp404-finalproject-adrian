import { render, fireEvent, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from './components/Home';
import NavBar from './components/NavBar';
import Login from './components/Login';
import UserPage from './components/UserPage';
import WorkoutRecipes from './components/WorkoutRecipes';
import RecipeDetail from './components/RecipeDetail';
import Dropdown from './components/Dropdown';
import userEvent from '@testing-library/user-event';


jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), 
  useNavigate: () => jest.fn().mockImplementation(() => mockNavigate), 
}));

test('renders Home component with welcome message', () => {
    render(<Home />);
    const welcomeElement = screen.getByText(/Welcome to Fitness Body, your go-to app for managing your workout routines and nutrition plans/i);
    expect(welcomeElement).toBeInTheDocument();
  });


test('renders NavBar with links', () => {
  render(<BrowserRouter><NavBar /></BrowserRouter>);
  expect(screen.getByText(/Home/i)).toBeInTheDocument();
  expect(screen.getByText(/Workout Recipes/i)).toBeInTheDocument();
});

test('renders Login form with input fields and login button', () => {
    render(<Login />);
    expect(screen.getByLabelText(/Username:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });


  jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
  }));
  
  test('renders NavBar with Home and Workout Recipes links', () => {
    render(
      <BrowserRouter>
        <NavBar />
      </BrowserRouter>
    );
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText(/Workout Recipes/i)).toBeInTheDocument();
  });


test('renders UserPage component', () => {
    render(<BrowserRouter><UserPage /></BrowserRouter>);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });



test('renders WorkoutRecipes component', () => {
    render(<WorkoutRecipes />);
    expect(screen.getByText(/Workout Recipes/i)).toBeInTheDocument();
  });


test('renders RecipeDetail component', () => {
    render(<BrowserRouter><RecipeDetail /></BrowserRouter>);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
});



test('NavBar logout works correctly', () => {
  sessionStorage.setItem('userId', '1');
  render(
    <BrowserRouter>
      <NavBar />
    </BrowserRouter>
  );
  fireEvent.click(screen.getByText(/Logout/i));
  expect(sessionStorage.getItem('userId')).toBeNull();
});

test('Dropdown component changes value on select', () => {
  const mockOnChange = jest.fn();
  const options = [
    { value: 'none', name: 'None' },
    { value: 'working out', name: 'Working Out' },
  ];
  render(<Dropdown options={options} onChange={mockOnChange} />);
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'working out' } });
  expect(mockOnChange).toHaveBeenCalled();
});


test('Login form displays error message on incorrect credentials', async () => {
  const mockFetch = jest.spyOn(global, 'fetch').mockResolvedValue({
    ok: false,
    json: () => Promise.resolve([]), 
  });

  render(<Login />);

  userEvent.type(screen.getByLabelText(/Username:/i), 'wrong_username');
  userEvent.type(screen.getByLabelText(/Password:/i), 'wrong_password');

  userEvent.click(screen.getByRole('button', { name: /Login/i }));

  const errorMessage = await screen.findByText(/Username does not match the password/i);
  expect(errorMessage).toBeInTheDocument();

  mockFetch.mockRestore();
});