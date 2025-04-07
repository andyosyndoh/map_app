import React from 'react';
import { Head } from '@inertiajs/react';
import Layout from '../../components/Layout';
import Map from '../../components/Map';

const Index = ({ locations, authenticated, current_user }) => {
  return (
    <Layout user={current_user}>
      <Head title="Home" />
      <h1>Welcome to the Location Map App</h1>
      
      {authenticated ? (
        <p>You are logged in. You can add your own locations to the map.</p>
      ) : (
        <p>Please log in to add your own locations to the map.</p>
      )}
      
      <div>
        <h2>All Locations</h2>
        <Map locations={locations} />
      </div>
    </Layout>
  );
};

export default Index;