import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {App} from './App.tsx'
import { WorldProvider } from './context.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WorldProvider>
        <App />
    </WorldProvider>
  </StrictMode>,
)
