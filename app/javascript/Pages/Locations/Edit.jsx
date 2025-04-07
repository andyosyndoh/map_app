import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import Layout from '../../components/Layout';

const Edit = ({ location, current_user, errors = {} }) => {
    const { data, setData, put, processing } = useForm({
        name: location.name || '',
        latitude: location.latitude || '',
        longitude: location.longitude || ''
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
        put(`/locations/${location.id}`);
    }

    return (
        <Layout user={current_user}>
            <Head title="Edit Location" />
            <h1>Edit Location</h1>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 15 }}>
                    <label htmlFor="name" style={{ display: 'block', marginBottom: 5 }}>
                        Location Name:
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={data.name}
                        onChange={handleChange}
                        style={{ width: '100%', padding: 8 }}
                    />
                    {errors.name && <div style={{ color: 'red' }}>{errors.name}</div>}
                </div>

                <div style={{ marginBottom: 15 }}>
                    <label htmlFor="latitude" style={{ display: 'block', marginBottom: 5 }}>
                        Latitude:
                    </label>
                    <input
                        id="latitude"
                        name="latitude"
                        type="number"
                        step="any"
                        value={data.latitude}
                        onChange={handleChange}
                        style={{ width: '100%', padding: 8 }}
                    />
                    {errors.latitude && <div style={{ color: 'red' }}>{errors.latitude}</div>}
                </div>

                <div style={{ marginBottom: 15 }}>
                    <label htmlFor="longitude" style={{ display: 'block', marginBottom: 5 }}>
                        Longitude:
                    </label>
                    <input
                        id="longitude"
                        name="longitude"
                        type="number"
                        step="any"
                        value={data.longitude}
                        onChange={handleChange}
                        style={{ width: '100%', padding: 8 }}
                    />
                    {errors.longitude && <div style={{ color: 'red' }}>{errors.longitude}</div>}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    style={{ padding: '10px 15px', background: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}
                >
                    {processing ? 'Updating...' : 'Update Location'}
                </button>
            </form>
        </Layout>
    );
};

export default Edit;