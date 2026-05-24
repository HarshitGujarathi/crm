
import { useState } from 'react'
import LeadCard from './LeadCard'

export default function Dashboard({ user, leads, setLeads, logout }) {

  const [client, setClient] = useState('')
  const [phone, setPhone] = useState('')
  const [property, setProperty] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [leadFilter, setLeadFilter] = useState('assigned')
  const [showLeadForm, setShowLeadForm] = useState(false)
  const [analyticsView, setAnalyticsView] = useState('Intern')

  const visibleLeads = leads.filter((lead) => {

    if (leadFilter === 'assigned') {
      return lead.assignedTo === user.role
    }

    if (leadFilter === 'unassigned') {
      return lead.assignedTo !== user.role
    }

    return true
  })

  const updateLead = (id, updates) => {
    const updated = leads.map((lead) =>
      lead.id === id ? { ...lead, ...updates } : lead
    )

    setLeads(updated)
  }

  const createLead = () => {

    if (!client || !property || phone.length !== 10) {
      alert('Please enter valid 10 digit mobile number')
      return
    }

    const newLead = {
      id: Date.now(),
      client,
      phone,
      property,
      status: 'New Lead',
      assignedTo: 'Intern',
      followUps: 0,
      notificationFor: '',
      notificationMessage: '',
      history: [
        {
          action: 'Lead created by Intern',
          date: new Date().toLocaleString(),
        },
      ],
    }

    setLeads([...leads, newLead])

    setClient('')
    setPhone('')
    setProperty('')
    setShowLeadForm(false)
  }

  const notifications = leads.filter(
    (lead) => lead.notificationFor === user.role
  )

  const totalLeads = leads.length

  const totalFollowUps = leads.reduce(
    (sum, lead) => sum + lead.followUps,
    0
  )

  const lostLeads = leads.filter(
    (lead) => lead.status === 'Lost'
  ).length

  const siteVisitScheduled = leads.filter(
    (lead) => lead.status === 'Site Visit Scheduled'
  ).length

  const siteVisitCompleted = leads.filter(
    (lead) => lead.status === 'Site Visit Completed'
  ).length

 return (
  <div className="min-h-screen bg-gray-100 w-full overflow-x-hidden p-4">

    {/* Header */}
    <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

      {/* Left */}
      <div className="min-w-0">
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight break-words">
          CRM Dashboard
        </h1>

        <p className="text-gray-600 mt-2 text-base sm:text-lg">
          Logged in as {user.role}
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">

        {/* Notification */}
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center shrink-0"
        >
          🔔

          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
            {notifications.length}
          </span>
        </button>

        {/* Logout */}
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-xl transition whitespace-nowrap"
        >
          Logout
        </button>

      </div>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">

      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-gray-500 text-lg">Total Leads</h2>
        <p className="text-5xl font-bold mt-2">{totalLeads}</p>
      </div>

      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-gray-500 text-lg">Follow-up</h2>
        <p className="text-5xl font-bold mt-2">{totalFollowUps}</p>
      </div>

      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-gray-500 text-lg">Lost Leads</h2>
        <p className="text-5xl font-bold mt-2">{lostLeads}</p>
      </div>

      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-gray-500 text-lg">Site Visits</h2>
        <p className="text-5xl font-bold mt-2">{siteVisitCompleted}</p>
      </div>

    </div>

  </div>
)
}
