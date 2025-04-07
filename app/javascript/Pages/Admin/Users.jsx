import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import Layout from '../../components/Layout';

const Users = ({ users, current_user }) => {
  const handleDeleteUser = (userId) => {
    if (confirm('Are you sure you want to delete this user?')) {
      router.delete(`/admin/users/${userId}`);
    }
  };

  return (
    <Layout user={current_user}>
      <Head title="Manage Users" />
      <h1>Manage Users</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <Link 
          href="/admin/dashboard" 
          style={{ 
            display: 'inline-block',
            padding: '8px 15px',
            background: '#6c757d',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px'
          }}
        >
          Back to Dashboard
        </Link>
      </div>
      
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '10px', borderBottom: '2px solid #dee2e6' }}>ID</th>
            <th style={{ textAlign: 'left', padding: '10px', borderBottom: '2px solid #dee2e6' }}>Email</th>
            <th style={{ textAlign: 'left', padding: '10px', borderBottom: '2px solid #dee2e6' }}>Role</th>
            <th style={{ textAlign: 'left', padding: '10px', borderBottom: '2px solid #dee2e6' }}>Locations</th>
            <th style={{ textAlign: 'left', padding: '10px', borderBottom: '2px solid #dee2e6' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td style={{ padding: '10px', borderBottom: '1px solid #dee2e6' }}>{user.id}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #dee2e6' }}>{user.email}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #dee2e6' }}>{user.role}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #dee2e6' }}>{user.locations.length}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #dee2e6' }}>
                {user.id !== current_user.id && (
                  <button 
                    onClick={() => handleDeleteUser(user.id)}
                    style={{ 
                      padding: '5px 10px',
                      background: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                )}
                <Link 
                  href={`/admin/users/${user.id}/edit`}
                  style={{ 
                    display: 'inline-block',
                    padding: '5px 10px',
                    background: '#007bff',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '5px',
                    marginLeft: '10px'
                  }}
                >
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div style={{ marginTop: '20px' }}>
        <Link 
          href="/admin/users/new" 
          style={{ 
            display: 'inline-block',
            padding: '8px 15px',
            background: '#28a745',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px'
          }}
        >
          Create New User
        </Link>
      </div>
    </Layout>
  );
};

export default Users;