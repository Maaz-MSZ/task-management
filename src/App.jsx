import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TaskDetails from './pages/TaskDetails';
import TeamPage from './pages/TeamPage';
import Unauthorized from './pages/Unauthorized';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import AddTask from './pages/AddTask';
import ProfileSettings from './pages/ProfileSettings';
import { Toaster } from "@/components/ui/toaster";
import PublicRoute from './components/PublicRoute';

function AppLayout() {
  const location = useLocation();
  const noSidebarRoutes = ['/', '/register', '/unauthorized'];
  const showSidebar = !noSidebarRoutes.includes(location.pathname);

  return (
    <>
      {showSidebar && <Sidebar />}
      <div className={showSidebar ? 'ml-64 p-4' : ''}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected Routes (Admin + Member) */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'member']} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-task" element={<AddTask />} />
            <Route path="/task/:id" element={<TaskDetails />} />
            <Route path="/profile" element={<ProfileSettings />} />
          </Route>

          {/* Admin Only */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/team" element={<TeamPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" />} ></Route>
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter basename="/lips-web/">
     <Toaster />
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
