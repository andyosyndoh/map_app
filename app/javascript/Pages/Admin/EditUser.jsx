// app/javascript/pages/Admin/EditUser.jsx
import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import Layout from '../../components/Layout';

const EditUser = ({ user, current_user, errors = {} }) => {
    const { data, setData, put, processing } = useForm({
        email: user.email || '',
        role: user.role || 'user'
    });

    function handleChange(e) {
        const key = e.target.name;
        const value = e.target.value;
        setData(data => ({
            ...data,
            [key]: value
        }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        put(`/admin/users/${user.id}`);
    }

    return (
        <Layout user={current_user}>
            <Head title="Edit User" />
            <h1>Edit User</h1>

            <div style={{ marginBottom: '20px' }}>
                <Link
                    href="/admin/users"
                    style={{
                        display: 'inline-block',
                        padding: '8px 15px',
                        background: '#6c757d',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '5px'
                    }}
                >
                    Back to Users
                </Link>
            </div>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 15 }}>
                    <label htmlFor="email" style={{ display: 'block', marginBottom: 5 }}>
                        Email:
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={data.email}
                        onChange={handleChange}
                        style={{ width: '100%', padding: 8 }}
                    />
                    {errors.email && <div style={{ color: 'red' }}>{errors.email}</div>}
                </div>

                <div style={{ marginBottom: 15 }}>
                    <label htmlFor="role" style={{ display: 'block', marginBottom: 5 }}>
                        Role:
                    </label>
                    <select
                        id="role"
                        name="role"
                        value={data.role}
                        onChange={handleChange}
                        style={{ width: '100%', padding: 8 }}
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                    {errors.role && <div style={{ color: 'red' }}>{errors.role}</div>}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    style={{ padding: '10px 15px', background: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}
                >
                    {processing ? 'Updating...' : 'Update User'}
                </button>
            </form>
        </Layout>
    );
};

export default EditUser;