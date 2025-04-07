# Building a Map Application with Rails, Inertia.js, and React (2025 Compatible Version)

## Overview of Technologies

Here's what we'll be using with compatible versions:

1. **Ruby on Rails 8.0.x** - The latest stable version of Rails
2. **Inertia.js 1.0** - For connecting Rails with React without an API
3. **React 18.x** - The current stable version of React
4. **React Leaflet** - For interactive maps
5. **Devise** - For authentication
6. **CanCanCan** - For role-based authorization

## Project Setup

### Step 1: Create a new Rails application

```bash
# Make sure you have Rails installed
gem install rails

# Create a new Rails application with esbuild for JavaScript
rails new map_app --javascript=esbuild
cd map_app
```

### Step 2: Install required gems

Edit your Gemfile to include these gems:

```ruby
# Authentication
gem 'devise'

# Authorization
gem 'cancancan'

# Inertia adapter for Rails
gem 'inertia_rails'

# For environment variables
gem 'dotenv-rails'
```

Install the gems:

```bash
bundle install
```

### Step 3: Install JavaScript dependencies

Rails 8.x uses importmaps by default, but for a complex React app, we'll use esbuild. 
Add these packages:

```bash
yarn add react react-dom @inertiajs/react @inertiajs/inertia-react prop-types
yarn add leaflet react-leaflet
```

### Step 4: Configure Inertia.js

First, create your JavaScript entry file:

```bash
mkdir -p app/javascript/controllers
mkdir -p app/javascript/pages
```

Create `app/javascript/application.js`:

```javascript
// app/javascript/application.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';

document.addEventListener('DOMContentLoaded', () => {
  createInertiaApp({
    resolve: name => {
      const pages = import.meta.glob('./pages/**/*.jsx', { eager: true });
      return pages[`./pages/${name}.jsx`];
    },
    setup({ el, App, props }) {
      const root = createRoot(el);
      root.render(<App {...props} />);
    },
  });
});
```

Update your `config/importmap.rb` to include React and Inertia:

```ruby
# Pin npm packages by running ./bin/importmap

pin "application", preload: true
pin "@hotwired/turbo-rails", to: "turbo.min.js", preload: true
pin "@hotwired/stimulus", to: "stimulus.min.js", preload: true
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js", preload: true
pin_all_from "app/javascript/controllers", under: "controllers"
pin "react", to: "https://ga.jspm.io/npm:react@18.2.0/index.js"
pin "react-dom", to: "https://ga.jspm.io/npm:react-dom@18.2.0/index.js"
pin "@inertiajs/react", to: "https://ga.jspm.io/npm:@inertiajs/react@1.0.0/dist/index.js"
```

Update your default layout file in `app/views/layouts/application.html.erb`:

```erb
<!DOCTYPE html>
<html>
  <head>
    <title>Map App</title>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <%= csrf_meta_tags %>
    <%= csp_meta_tag %>

    <%= stylesheet_link_tag "application", "data-turbo-track": "reload" %>
    <%= javascript_include_tag "application", "data-turbo-track": "reload", defer: true %>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="" />
  </head>

  <body>
    <%= yield %>
  </body>
</html>
```

Create an Inertia layout file at `app/views/layouts/inertia.html.erb`:

```erb
<!DOCTYPE html>
<html>
  <head>
    <title>Map App</title>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <%= csrf_meta_tags %>
    <%= csp_meta_tag %>

    <%= stylesheet_link_tag "application", "data-turbo-track": "reload" %>
    <%= javascript_include_tag "application", "data-turbo-track": "reload", defer: true %>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="" />
  </head>

  <body>
    <%= yield %>
  </body>
</html>
```

Set up InertiaRails middleware in `app/controllers/application_controller.rb`:

```ruby
class ApplicationController < ActionController::Base
  include InertiaRails::Controller
end
```

### Step 5: Configure esbuild for JavaScript bundling

Create a `build.js` file in your project root:

```javascript
// build.js
const esbuild = require('esbuild');

// Determine the mode from command line arguments
const production = process.argv.includes('--production');

// Define entry points
const entryPoints = [
  'app/javascript/application.js',
];

// Configure the build
const config = {
  entryPoints,
  bundle: true,
  sourcemap: !production,
  minify: production,
  outdir: 'app/assets/builds',
  publicPath: '/assets',
  loader: {
    '.js': 'jsx',
    '.jsx': 'jsx',
    '.png': 'file',
    '.jpg': 'file',
    '.svg': 'file',
  },
  define: {
    'process.env.NODE_ENV': production ? "'production'" : "'development'"
  },
};

// Build with or without watch based on arguments
if (process.argv.includes('--watch')) {
  // Watch mode
  esbuild.context(config).then(context => {
    context.watch();
    console.log('Watching for changes...');
  });
} else {
  // Build once
  esbuild.build(config).catch(() => process.exit(1));
}
```

Update your `package.json` scripts:

```json
"scripts": {
  "build": "node build.js",
  "build:css": "tailwindcss -i ./app/assets/stylesheets/application.css -o ./app/assets/builds/application.css --minify",
  "watch": "node build.js --watch",
  "dev": "yarn build --watch"
}
```

## User Authentication with Devise

### Step 1: Set up Devise

```bash
rails generate devise:install
```

Add Devise configuration to `config/environments/development.rb`:

```ruby
config.action_mailer.default_url_options = { host: 'localhost', port: 3000 }
```

### Step 2: Create User model with Devise

```bash
rails generate devise User
```

### Step 3: Add roles to User model

```bash
rails generate migration AddRoleToUsers role:string
```

Edit the migration to set a default role:

```ruby
class AddRoleToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :role, :string, default: 'user'
  end
end
```

Update the User model in `app/models/user.rb`:

```ruby
class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
         
  validates :role, inclusion: { in: %w(user admin) }
  
  def admin?
    role == 'admin'
  end
  
  def user?
    role == 'user'
  end
end
```

Run migrations:

```bash
rails db:migrate
```

## Location Model

### Step 1: Create Location model

```bash
rails generate model Location name:string latitude:float longitude:float user:references
rails db:migrate
```

### Step 2: Set up associations

Update `app/models/user.rb`:

```ruby
class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
         
  validates :role, inclusion: { in: %w(user admin) }
  
  has_many :locations, dependent: :destroy
  
  def admin?
    role == 'admin'
  end
  
  def user?
    role == 'user'
  end
end
```

Update `app/models/location.rb`:

```ruby
class Location < ApplicationRecord
  belongs_to :user
  
  validates :name, presence: true
  validates :latitude, presence: true, numericality: { greater_than_or_equal_to: -90, less_than_or_equal_to: 90 }
  validates :longitude, presence: true, numericality: { greater_than_or_equal_to: -180, less_than_or_equal_to: 180 }
end
```

## Authorization with CanCanCan

### Step 1: Generate CanCanCan ability

```bash
rails generate cancan:ability
```

### Step 2: Define abilities in `app/models/ability.rb`:

```ruby
class Ability
  include CanCan::Ability

  def initialize(user)
    user ||= User.new # guest user (not logged in)
    
    if user.admin?
      can :manage, :all
    elsif user.user?
      can :read, Location
      can :manage, Location, user_id: user.id
      can :manage, User, id: user.id
    else
      can :read, Location
    end
  end
end
```

## Controllers and Routes

### Step 1: Set up HomeController

```bash
rails generate controller Home index
```

Edit `app/controllers/home_controller.rb`:

```ruby
class HomeController < ApplicationController
  def index
    # Get all locations for the map
    @locations = Location.all.includes(:user)
    
    render inertia: 'Home/Index', props: {
      locations: @locations.as_json(include: { user: { only: [:id, :email] } }),
      authenticated: user_signed_in?,
      current_user: user_signed_in? ? current_user.as_json(only: [:id, :email, :role]) : nil
    }
  end
end
```

### Step 2: Create LocationsController

```bash
rails generate controller Locations index create new edit update destroy
```

Edit `app/controllers/locations_controller.rb`:

```ruby
class LocationsController < ApplicationController
  before_action :authenticate_user!, except: [:index]
  before_action :set_location, only: [:edit, :update, :destroy]
  load_and_authorize_resource except: [:create]

  def index
    @locations = Location.all.includes(:user)
    render inertia: 'Locations/Index', props: {
      locations: @locations.as_json(include: { user: { only: [:id, :email] } }),
      current_user: user_signed_in? ? current_user.as_json(only: [:id, :email, :role]) : nil
    }
  end

  def new
    render inertia: 'Locations/New', props: {
      current_user: current_user.as_json(only: [:id, :email, :role])
    }
  end

  def create
    @location = current_user.locations.build(location_params)
    
    if @location.save
      redirect_to locations_path, notice: 'Location was successfully created.'
    else
      render inertia: 'Locations/New', props: {
        errors: @location.errors,
        current_user: current_user.as_json(only: [:id, :email, :role])
      }
    end
  end

  def edit
    render inertia: 'Locations/Edit', props: {
      location: @location,
      current_user: current_user.as_json(only: [:id, :email, :role])
    }
  end

  def update
    if @location.update(location_params)
      redirect_to locations_path, notice: 'Location was successfully updated.'
    else
      render inertia: 'Locations/Edit', props: {
        location: @location,
        errors: @location.errors,
        current_user: current_user.as_json(only: [:id, :email, :role])
      }
    end
  end

  def destroy
    @location.destroy
    redirect_to locations_path, notice: 'Location was successfully deleted.'
  end

  private

  def set_location
    @location = Location.find(params[:id])
  end

  def location_params
    params.require(:location).permit(:name, :latitude, :longitude)
  end
end
```

### Step 3: Create AdminController for admin dashboard

```bash
rails generate controller Admin dashboard users
```

Edit `app/controllers/admin_controller.rb`:

```ruby
class AdminController < ApplicationController
  before_action :authenticate_user!
  before_action :require_admin
  
  def dashboard
    render inertia: 'Admin/Dashboard', props: {
      user_count: User.count,
      location_count: Location.count,
      current_user: current_user.as_json(only: [:id, :email, :role])
    }
  end
  
  def users
    @users = User.all.includes(:locations)
    
    render inertia: 'Admin/Users', props: {
      users: @users.as_json(include: { locations: { only: [:id, :name] } }),
      current_user: current_user.as_json(only: [:id, :email, :role])
    }
  end
  
  def destroy_user
    @user = User.find(params[:id])
    @user.destroy
    redirect_to admin_users_path, notice: 'User was successfully deleted.'
  end
  
  private
  
  def require_admin
    unless current_user.admin?
      redirect_to root_path, alert: 'You must be an admin to access this page.'
    end
  end
end
```

### Step 4: Update routes

Edit `config/routes.rb`:

```ruby
Rails.application.routes.draw do
  devise_for :users
  
  resources :locations
  
  namespace :admin do
    get 'dashboard', to: 'admin#dashboard'
    get 'users', to: 'admin#users'
    delete 'users/:id', to: 'admin#destroy_user', as: 'destroy_user'
  end
  
  root to: 'home#index'
end
```

## React Components

### Step 1: Create directory structure for React components

```bash
mkdir -p app/javascript/pages/Home
mkdir -p app/javascript/pages/Locations
mkdir -p app/javascript/pages/Admin
mkdir -p app/javascript/components
```

### Step 2: Create layout components

Create `app/javascript/components/Layout.jsx`:

```jsx
import React from 'react';
import { Link } from '@inertiajs/react';

const Layout = ({ children, user }) => {
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
                  <a href="/users/sign_out" data-method="delete">Logout</a>
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
```

### Step 3: Create map component

Create `app/javascript/components/Map.jsx`:

```jsx
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icon issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const Map = ({ locations = [] }) => {
  const defaultPosition = [40.7128, -74.0060]; // Default to New York City
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    // This ensures the component only renders on the client, not during SSR
    setIsClient(true);
  }, []);
  
  if (!isClient) {
    return <div style={{ height: "500px", width: "100%", background: "#f0f0f0" }}>Loading map...</div>;
  }
  
  return (
    <MapContainer 
      center={defaultPosition} 
      zoom={13} 
      style={{ height: "500px", width: "100%" }}
      key={Math.random()} // Force re-render on data change
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {locations.map((location) => (
        <Marker 
          key={location.id} 
          position={[location.latitude, location.longitude]}
        >
          <Popup>
            <div>
              <h3>{location.name}</h3>
              <p>Added by: {location.user.email}</p>
              <p>Coordinates: {location.latitude}, {location.longitude}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
```

### Step 4: Create Home page component

Create `app/javascript/pages/Home/Index.jsx`:

```jsx
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
```

### Step 5: Create Location form components

Create `app/javascript/pages/Locations/New.jsx`:

```jsx
import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import Layout from '../../components/Layout';

const New = ({ current_user, errors = {} }) => {
  const { data, setData, post, processing } = useForm({
    name: '',
    latitude: '',
    longitude: ''
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
    post('/locations');
  }

  return (
    <Layout user={current_user}>
      <Head title="Add Location" />
      <h1>Add New Location</h1>
      
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
          {processing ? 'Adding...' : 'Add Location'}
        </button>
      </form>
    </Layout>
  );
};

export default New;
```

Create `app/javascript/pages/Locations/Edit.jsx`:

```jsx
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
```

### Step 6: Create Admin Dashboard components

Create `app/javascript/pages/Admin/Dashboard.jsx`:

```jsx
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
```

Create `app/javascript/pages/Admin/Users.jsx`:

```jsx
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