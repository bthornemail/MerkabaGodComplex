import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import App from './App.tsx'
import Universal42DModel from './Universal42DModel.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>                    
        <App />
    </StrictMode>,
)
