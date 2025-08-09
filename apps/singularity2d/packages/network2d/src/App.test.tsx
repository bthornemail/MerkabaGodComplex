import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyComponent from './App';

test('it displays the correct message after button click', () => {
  render(<MyComponent />); // Arrange

  const button = screen.getByRole('button', { name: /click me/i });
  userEvent.click(button); // Act

  expect(screen.getByText(/message displayed/i)).toBeInTheDocument(); // Assert
});
describe('MyComponent', () => {
  it('should render without crashing', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});

test('renders the component with initial content', () => {
  render(<MyComponent />);
  expect(screen.getByText(/welcome to my component/i)).toBeInTheDocument();
});
   test('it greets the user by name', () => {
     const name = 'Alice';
     render(<Greeting name={name} />);
     expect(screen.getByText(`Hello, ${name}`)).toBeInTheDocument();
   });