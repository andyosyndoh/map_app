// app/javascript/pages/Locations/Index.jsx
import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import Layout from '../../components/Layout';
import Map from '../../components/Map';

const Index = ({ locations, current_user }) => {
    const handleDeleteLocation = (locationId) => {
        if (confirm('Are you sure you want to delete this location?')) {
            router.delete(`/locations/${locationId}`);
        }
    };

    return (
        <Layout user={current_user}>
            <Head title="All Locations" />
            <h1>All Locations</h1>

            <div style={{ marginBottom: '20px' }}>
                <Link
                    href="/locations/new"
                    style={{
                        display: 'inline-block',
                        padding: '8px 15px',
                        background: '#28a745',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '5px'
                    }}
                >
                    Add New Location
                </Link>
            </div>

            <Map locations={locations} />

            <h2 style={{ marginTop: '30px' }}>Location List</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ textAlign: 'left', padding: '10px', borderBottom: '2px solid #dee2e6' }}>Name</th>
                        <th style={{ textAlign: 'left', padding: '10px', borderBottom: '2px solid #dee2e6' }}>Latitude</th>
                        <th style={{ textAlign: 'left', padding: '10px', borderBottom: '2px solid #dee2e6' }}>Longitude</th>
                        <th style={{ textAlign: 'left', padding: '10px', borderBottom: '2px solid #dee2e6' }}>Added By</th>
                        <th style={{ textAlign: 'left', padding: '10px', borderBottom: '2px solid #dee2e6' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {locations.map((location) => (
                        <tr key={location.id}>
                            <td style={{ padding: '10px', borderBottom: '1px solid #dee2e6' }}>{location.name}</td>
                            <td style={{ padding: '10px', borderBottom: '1px solid #dee2e6' }}>{location.latitude}</td>
                            <td style={{ padding: '10px', borderBottom: '1px solid #dee2e6' }}>{location.longitude}</td>
                            <td style={{ padding: '10px', borderBottom: '1px solid #dee2e6' }}>{location.user.email}</td>
                            <td style={{ padding: '10px', borderBottom: '1px solid #dee2e6' }}>
                                {(current_user && (current_user.id === location.user.id || current_user.role === 'admin')) && (
                                    <>
                                        <Link
                                            href={`/locations/${location.id}/edit`}
                                            style={{
                                                display: 'inline-block',
                                                padding: '5px 10px',
                                                background: '#007bff',
                                                color: 'white',
                                                textDecoration: 'none',
                                                borderRadius: '5px'
                                            }}
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDeleteLocation(location.id)}
                                            style={{
                                                padding: '5px 10px',
                                                background: '#dc3545',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '5px',
                                                cursor: 'pointer',
                                                marginLeft: '10px'
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    );
};

export default Index;