import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createHashRouter, RouterProvider } from 'react-router-dom';
import './index.css'
import { CreateElementsScreen } from "./events/create/CreateElementsScreen.tsx";
import WebApp from "@twa-dev/sdk";
import ErrorScreen from "./ErrorScreen.tsx";

WebApp.ready();

const router = createHashRouter([
    {
        path: '/',
        element: <div>Training Coordinator App</div>,
        errorElement: <ErrorScreen/>,
    },
    {
        path: '/events/create',
        element: <CreateElementsScreen/>
    }
]);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <RouterProvider router={router}/>
    </StrictMode>,
)
