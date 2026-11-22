import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ActivityTrackerProvider } from 'activity-tracker-lite/react'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ActivityTrackerProvider
      config={{
        appId: 'todo-demo',
        sessionTimeout: 30 * 60 * 1000,
        inactivityTimeout: 60 * 1000,
        trackPageViews: true,
        storage: 'memory',
      }}
    >
      <App />
    </ActivityTrackerProvider>
  </React.StrictMode>,
)
