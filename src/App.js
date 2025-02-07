import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import FacultyDashboard from "./pages/FacultyDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AssignTask from './pages/AssignTask'; 
import logo from './media/logo_campus.png';

function App() {
  return (
    <AuthProvider>
      <Header />
      
      <div className="pt-24 min-h-screen bg-cover bg-center">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/facultydashboard" element={<FacultyDashboard />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/assigntask" element={<AssignTask />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

function Header() {
  const { logout } = useAuth(); // Access the logout function from AuthContext
  const navigate = useNavigate(); // Hook for navigation
  const location = useLocation(); // Hook to get the current route

  const handleLogout = async () => {
    try {
      await logout(); // Call the logout function
      navigate('/login'); // Redirect to the login page
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Hide logout button on login and signup pages
  const showLogoutButton = !['/login', '/signup', '/'].includes(location.pathname);

  return (
    <header className="fixed top-0 left-0 w-full bg-gradient-to-r from-blue-100 to-yellow-100 p-6 z-50 border-b border-yellow-500">
      <div className="flex items-center justify-between max-w-screen-xl mx-auto">
        <div className="flex items-center space-x-4">
          <img src={logo} alt="Logo" className="w-20 h-12 sm:w-16 sm:h-12" />
          <h1 className="text-xl sm:text-lg font-semibold text-black hidden sm:block">
            Bharati Vidyapeeth (Deemed to be University)
          </h1>
        </div>
        <h1 className="text-lg sm:text-sm font-semibold text-black sm:hidden">
          Bharati Vidyapeeth (Deemed to be University)
        </h1>
        {/* Conditionally render the logout button */}
        {showLogoutButton && (
          <button
            onClick={handleLogout}
            className="text-black px-4 py-2 rounded-lg bg-yellow-400 hover:bg-dark-blue hover:text-white transition-colors"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
}

export default function Root() {
  return (
    <Router>
      <App />
    </Router>
  );
}