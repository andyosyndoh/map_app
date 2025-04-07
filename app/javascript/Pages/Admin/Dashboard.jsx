import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Layout from '../../components/Layout';

const Dashboard = ({ user_count, location_count, current_user }) => {
    return (
        <Layout user={current_user}>
            <Head title="Admin Dashboard" />
            <h1>Admin Dashboard</h1>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                <div style={{
                    flex: 1,
                    padding: '20px',
                    background: '#f8f9fa',
                    borderRadius: '5px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    <h3>Total Users</h3>
                    <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{user_count}</p>
                </div>

                <div style={{
                    flex: 1,
                    padding: '20px',
                    background: '#f8f9fa',
                    borderRadius: '5px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    <h3>Total Locations</h3>
                    <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{location_count}</p>
                </div>
            </div>

            <div>
                <Link
                    href="/admin/users"
                    style={{
                        display: 'inline-block',
                        padding: '10px 15px',
                        background: '#007bff',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '5px'
                    }}
                >
                    Manage Users
                </Link>
            </div>
        </Layout>
    );
};

export default Dashboard;