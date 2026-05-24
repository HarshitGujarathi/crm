import { useState } from 'react'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import { initialLeads } from './data'

export default function App() {
  const [user, setUser] = useState(null)
  const [leads, setLeads] = useState(initialLeads)

  if (!user) {
    return <Login onLogin={setUser} />
  }

  return (
    <Dashboard
      user={user}
      leads={leads}
      setLeads={setLeads}
      logout={() => setUser(null)}
    />
  )
}
