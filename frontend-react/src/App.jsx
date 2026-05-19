import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { Navbar } from './components/Navbar'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Upload } from './pages/Upload'
import { History } from './pages/History'
import { Admin } from './pages/Admin'
import { ChatBot } from './components/ChatBot';



function AppRoutes() {
  const { isLoggedIn } = useAuth()

  return (
    <>
      <Navbar />
      <ChatBot />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={isLoggedIn ? <Navigate to="/" replace /> : <Register />}
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <div className="app-background">
            <AppRoutes />
          </div>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  )
}
