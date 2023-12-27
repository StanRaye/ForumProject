import { render, screen } from '@testing-library/react';
import Sig from './SIGThreads';

test('renders learn react link', () => {
  render(<Sig />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
