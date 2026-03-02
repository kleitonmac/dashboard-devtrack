import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { DevProvider } from './context/DevContext'
import { Theme } from '@radix-ui/themes'
import '@radix-ui/themes/styles.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Theme
      accentColor="teal"
      grayColor="sage"
      radius="large"
      scaling="100%"
      appearance="light"
    >
      <DevProvider>
        <App />
      </DevProvider>
    </Theme>
  </React.StrictMode>,
)
