import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App.tsx'
import LoadingModal from './common/LoadingModal.tsx'
import './index.css'
import { store } from './store.ts'
import { LoadingProvider } from './utils/LoadingProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <LoadingProvider>
        <App />
        <LoadingModal />
      </LoadingProvider>
    </Provider>
  </StrictMode>,
)
