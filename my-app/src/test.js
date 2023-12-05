import { render, fireEvent, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from './components/Home';
import NavBar from './components/NavBar';
import Login from './components/Login';
import UserPage from './components/UserPage';
import WorkoutRecipes from './components/WorkoutRecipes';
import RecipeDetail from './components/RecipeDetail';
import Card from './components/Card';
import JournalFormModal from './components/JournalFormModal';
import Dropdown from './components/Dropdown';
import App from './App';


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

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

test('Card component click navigates to detail page', () => {
  const mockNavigate = jest.requireMock('react-router-dom').useNavigate();
  render(
    <BrowserRouter>
      <Card 
        id="1"
        title="Test Recipe"
        body="Test Description"
        imgUrl="test.jpg"
        timeStamp="2023-01-01"
        detailPageLink="/workout-recipes/1"
      />
    </BrowserRouter>
  );
  fireEvent.click(screen.getByText(/Test Recipe/i));
  expect(mockNavigate).toHaveBeenCalledWith('/workout-recipes/1');
});


test('JournalFormModal submit works correctly', () => {
    const mockOnSubmit = jest.fn();
    render(<JournalFormModal show={true} onSubmit={mockOnSubmit} />);
    fireEvent.click(screen.getByText(/Submit/i));
    expect(mockOnSubmit).toHaveBeenCalled();
});


test('NavBar logout works correctly', () => {
    render(
      <BrowserRouter>
        <NavBar />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByText(/Logout/i));
    // Check sessionStorage or navigation redirection
  });


  test('Dropdown component changes value on select', () => {
    const mockOnChange = jest.fn();
    const options = [
      { value: 'none', name: 'None' },
      { value: 'working out', name: 'Working Out' },
    ];
    render(<Dropdown options={options} onChange={mockOnChange} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'working out' } });
    expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({ target: { value: 'working out' } }));
  });