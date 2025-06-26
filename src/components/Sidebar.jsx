import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const Sidebar = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  if (!isAuthenticated) return null;

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-gray-950 text-white flex flex-col shadow-lg z-10">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold tracking-wide text-white">Task Manager</h1>
      </div>

      <nav className="flex-1 p-4 space-y-2 text-sm">
        <Link
          to="/dashboard"
          className="block px-3 py-2 rounded-md hover:bg-gray-800 transition"
        >
          Dashboard
        </Link>
        <Link
          to="/add-task"
          className="block px-3 py-2 rounded-md hover:bg-gray-800 transition"
        >
          Add Task
        </Link>
        <Link
          to="/profile"
          className="block px-3 py-2 rounded-md hover:bg-gray-800 transition"
        >
          Profile Settings
        </Link>
        {user?.role === 'admin' && (
          <Link
            to="/team"
            className="block px-3 py-2 rounded-md hover:bg-gray-800 transition"
          >
            Manage Team
          </Link>
        )}
      </nav>

      <Separator className="bg-gray-800" />

      <div className="p-4 text-sm border-t border-gray-800">
        <p className="text-gray-400">Logged in as:</p>
        <p className="font-medium text-white">{`${user?.role.toUpperCase()}${user?.name ? `, Hi ${user?.name.toUpperCase()}` : ''}`}</p>

        <Button
          variant="ghost"
          className="mt-3 text-red-400 hover:text-red-300 hover:bg-transparent p-0 h-auto"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
