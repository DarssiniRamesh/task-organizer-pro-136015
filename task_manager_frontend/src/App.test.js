import { render, screen } from '@testing-library/react';
import { AuthProvider } from './hooks/useAuth';
import AppLayout from './App';

test('renders header title', () => {
  render(
    <AuthProvider>
      <AppLayout>
        <div />
      </AppLayout>
    </AuthProvider>
  );
  const title = screen.getByText(/Task Manager/i);
  expect(title).toBeInTheDocument();
});
