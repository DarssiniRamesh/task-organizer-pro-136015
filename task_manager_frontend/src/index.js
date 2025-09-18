import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import AppLayout from './App';
import AuthPage from './pages/AuthPage';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import AuthGuard from './components/auth/AuthGuard';
import TasksPage from './pages/TasksPage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<div className="app-main"><div className="placeholder-card"><h2>Welcome</h2><p className="text-muted">Use the menu to navigate. Go to /auth/signin to start.</p></div></div>} />
            <Route path="/auth" element={<AuthPage />}>
              <Route path="signin" element={<SignIn />} />
              <Route path="signup" element={<SignUp />} />
            </Route>
            <Route element={<AuthGuard />}>
              <Route path="/app">
                <Route path="tasks" element={<TasksPage />} />
              </Route>
            </Route>
            <Route path="*" element={<div className="app-main"><div className="placeholder-card"><h2>Not found</h2><p className="text-muted">The page you requested does not exist.</p></div></div>} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
