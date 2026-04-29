import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BlinkProvider, BlinkAuthProvider } from '@blinkdotnew/react'
import { BlinkUIProvider, Toaster } from '@blinkdotnew/ui'
import { getProjectId } from './lib/blink'
import App from './App'
import './index.css'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BlinkProvider projectId={getProjectId()} publishableKey={import.meta.env.VITE_BLINK_PUBLISHABLE_KEY}>
        <BlinkAuthProvider>
          <BlinkUIProvider theme="midnight" darkMode="system">
            <Toaster />
            <App />
          </BlinkUIProvider>
        </BlinkAuthProvider>
      </BlinkProvider>
    </QueryClientProvider>
  </StrictMode>
)
