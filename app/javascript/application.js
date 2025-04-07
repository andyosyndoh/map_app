import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
import React from 'react';


createInertiaApp({
  resolve: name => {
    return import(`./Pages/${name}.jsx`);
  },
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />);
  },
});