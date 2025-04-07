import React from 'react';
import { Link, useForm } from '@inertiajs/react';

const Layout = ({ children, user }) => {
  // Initialize the useForm hook
  const { post } = useForm();

  // Function to handle the logout request
  const handleLogout = () => {
    // This will send a DELETE request to the sign_out route
    post('/users/sign_out', { _method: 'delete' });
  };

  return (
    <div className="layout">
      <header>
        <nav>
          <ul style={{ display: 'flex', listStyle: 'none', padding: 20, background: '#f0f0f0' }}>
            <li style={{ marginRight: 20 }}>
              <Link href="/">Home</Link>
            </li>
            {user ? (
              <>
                <li style={{ marginRight: 20 }}>
                  <Link href="/locations/new">Add Location</Link>
                </li>
                {user.role === 'admin' && (
                  <li style={{ marginRight: 20 }}>
                    <Link href="/admin/dashboard">Admin</Link>
                  </li>
                )}
                <li style={{ marginRight: 20 }}>
                  {/* Use the form method to send the DELETE request */}
                  <Link href="/users/sign_out" method="delete" as="button" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#007bff' }}>
                    Logout
                  </Link>

                </li>
                <li style={{ marginLeft: 'auto' }}>
                  Logged in as: {user.email}
                </li>
              </>
            ) : (
              <>
                <li style={{ marginRight: 20 }}>
                  <a href="/users/sign_in">Login</a>
                </li>
                <li>
                  <a href="/users/sign_up">Register</a>
                </li>
              </>
            )}
          </ul>
        </nav>
      </header>
      <main style={{ padding: 20 }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
