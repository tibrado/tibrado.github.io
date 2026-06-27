import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {App} from './App.tsx'
import { WorldProvider } from './context.tsx'

// Hardcoded build metadata
const BUILD_VERSION = "v1.0.0-beta";
const BUILD_DATE = "2026-06-27 19:12:00 UTC"; 

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WorldProvider>
        <App />

        {/* Floating build overlay: completely isolated from the App layout flow */}
        <div 
            style={{
                position: 'fixed',
                bottom: '1px',
                right: '15px',
                color: '#000000',
                borderRadius: '4px',
                fontSize: '8px',
                fontFamily: 'system-ui',
                pointerEvents: 'none', // Allows users to click through it if it covers a button
                zIndex: 99999,
                letterSpacing: '0.5px'
            }}
        >
            Build: {BUILD_VERSION} | {BUILD_DATE}
        </div>
    </WorldProvider>
  </StrictMode>,
)
