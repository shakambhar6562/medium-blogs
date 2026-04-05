import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { router } from "../router/router.js";
import { RouterProvider } from 'react-router';


createRoot(document.getElementById('root')).render(
   <RouterProvider router={router} />,
);
