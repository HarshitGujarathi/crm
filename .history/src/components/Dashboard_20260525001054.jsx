
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
   <div className="min-h-screen p-3 md:p-6 bg-gray-100 overflow-x-hidden overflow-y-visible">

      <div className="flex flex-col md:flex-row gap-4 justify-between md:items-center mb-6 bg-white p-4 md:p-5 rounded-xl shadow-md">

        <div>
          <h1 className="text-4xl font-bold">
            CRM Dashboard
          </h1>

          <p className="text-gray-600 mt-1">
            Logged in as {user.role}
          </p>
        </div>

        <div className="flex items-center gap-4">
<div className="relative overflow-visible">

  <button
    onClick={() => setShowNotifications(!showNotifications)}
    className="bg-gray-100 w-14 h-14 rounded-full shadow relative flex items-center justify-center text-xl"
  >
    🔔

    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
      {notifications.length}
    </span>
  </button>

  {showNotifications && (
    <div
      className="
        fixed
    top-32
    md:top-24
    left-1/2
    -translate-x-1/2
    w-[92%]
    max-w-sm
    bg-white
    shadow-2xl
    rounded-2xl
    p-4
    z-[9999]
    border
      "
    >

      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-lg">
          Notifications
        </h3>

        <button
          onClick={() => setShowNotifications(false)}
          className="text-gray-500 text-xl"
        >
          ×
        </button>
      </div>

      {notifications.length === 0 ? (
        <p className="text-sm text-gray-500">
          No notifications
        </p>
      ) : (
        <div className="space-y-3 max-h-72 overflow-y-auto">

          {notifications.map((lead) => (
            <div
              key={lead.id}
              className="border rounded-lg p-3"
            >
              <p className="font-semibold text-sm">
                {lead.client}
              </p>

              <p className="text-xs text-gray-600 mt-1">
                {lead.notificationMessage}
              </p>
            </div>
          ))}

        </div>
      )}

    </div>
  )}

</div>
        

          <button
            onClick={logout}
            className="bg-red-600 text-white px-5 py-3 rounded-lg"
          >
            Logout
          </button>

        </div>

      </div>

      {(user.role === 'Manager' || user.role === 'Director') && (

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

          <div className="bg-white p-5 rounded-xl shadow-md">
            <h3 className="text-gray-500 text-sm">
              Total Leads
            </h3>

            <p className="text-3xl font-bold mt-2">
              {totalLeads}
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-md">
            <h3 className="text-gray-500 text-sm">
              Follow-ups
            </h3>

            <p className="text-3xl font-bold mt-2">
              {totalFollowUps}
            </p>
          </div>

          {user.role === 'Manager' && (
            <>

              <div className="bg-white p-5 rounded-xl shadow-md">
                <h3 className="text-gray-500 text-sm">
                  Site Visit Scheduled
                </h3>

                <p className="text-3xl font-bold mt-2">
                  {siteVisitScheduled}
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-md">
                <h3 className="text-gray-500 text-sm">
                  Site Visit Completed
                </h3>

                <p className="text-3xl font-bold mt-2">
                  {siteVisitCompleted}
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-md">
                <h3 className="text-gray-500 text-sm">
                  Client Lost
                </h3>

                <p className="text-3xl font-bold mt-2">
                  {lostLeads}
                </p>
              </div>

            </>
          )}

        </div>

      )}

      {user.role === 'Intern' && (

        <div className="mb-8">

          <button
            onClick={() => setShowLeadForm(!showLeadForm)}
            className="bg-blue-600 text-white w-12 h-12 md:w-14 md:h-14 rounded-full text-2xl md:text-3xl shadow-lg fixed bottom-5 right-5 z-50"
          >
            +
          </button>

        </div>

      )}

      {showLeadForm && user.role === 'Intern' && (
        <div className="bg-white p-5 rounded-xl shadow-md mb-8">

          <h2 className="text-xl font-bold mb-4">
            Create New Lead
          </h2>

          <input
            type="text"
            placeholder="Client Name"
            value={client}
            onChange={(e) => setClient(e.target.value)}
            className="w-full border p-3 rounded mb-4"
          />

          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            maxLength={10}
            onChange={(e) => {

              const value = e.target.value.replace(/\D/g, '')

              if (value.length <= 10) {
                setPhone(value)
              }

            }}
            className="w-full border p-3 rounded mb-2"
          />

          {
            phone.length > 0 && phone.length < 10 && (
              <p className="text-red-500 text-sm mb-3">
                Mobile number must be 10 digits
              </p>
            )
          }

          <input
            type="text"
            placeholder="Property Requirement"
            value={property}
            onChange={(e) => setProperty(e.target.value)}
            className="w-full border p-3 rounded mb-4"
          />


          

          <button
            onClick={createLead}
            className="bg-blue-600 text-white px-5 py-3 rounded"
          >
            Create Lead
          </button>

        </div>
      )}


      {/* ROLE BASED ANALYTICS */}

      {(user.role === 'Executive' || user.role === 'Manager' || user.role === 'Director') && (

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

          {user.role === 'Executive' && (
            <>
              <div className="bg-white p-5 rounded-xl shadow-md">
                <h3 className="text-gray-500 text-sm">
                  Total Leads Created
                </h3>

                <p className="text-3xl font-bold mt-2">
                  {leads.filter((lead) => lead.assignedTo === 'Executive').length}
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-md">
                <h3 className="text-gray-500 text-sm">
                  Follow-up 1
                </h3>

                <p className="text-3xl font-bold mt-2">
                  {leads.filter((lead) => lead.followUps === 1).length}
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-md">
                <h3 className="text-gray-500 text-sm">
                  Follow-up 2
                </h3>

                <p className="text-3xl font-bold mt-2">
                  {leads.filter((lead) => lead.followUps === 2).length}
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-md">
                <h3 className="text-gray-500 text-sm">
                  Follow-up 3
                </h3>

                <p className="text-3xl font-bold mt-2">
                  {leads.filter((lead) => lead.followUps === 3).length}
                </p>
              </div>
            </>
          )}

          {user.role === 'Manager' && (
            <>
              <div className="bg-white p-5 rounded-xl shadow-md">
                <h3 className="text-gray-500 text-sm">
                  Intern Leads
                </h3>

                <p className="text-3xl font-bold mt-2">
                  {leads.filter((lead) => lead.history?.[0]?.action?.includes('Intern')).length}
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-md">
                <h3 className="text-gray-500 text-sm">
                  Assigned To Executive
                </h3>

                <p className="text-3xl font-bold mt-2">
                  {leads.filter((lead) => lead.assignedTo === 'Executive').length}
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-md">
                <h3 className="text-gray-500 text-sm">
                  Client Lost
                </h3>

                <p className="text-3xl font-bold mt-2">
                  {leads.filter((lead) => lead.status === 'Lost').length}
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-md">
                <h3 className="text-gray-500 text-sm">
                  Follow-up 1 / 2 / 3
                </h3>

                <p className="text-lg font-bold mt-2">
                  {leads.filter((lead) => lead.followUps === 1).length} /
                  {leads.filter((lead) => lead.followUps === 2).length} /
                  {leads.filter((lead) => lead.followUps === 3).length}
                </p>
              </div>
            </>
          )}

          {user.role === 'Director' && (
            <>
              <div className="bg-white p-5 rounded-xl shadow-md">
                <h3 className="text-gray-500 text-sm">
                  Leads By Intern
                </h3>

                <p className="text-3xl font-bold mt-2">
                  {leads.filter((lead) => lead.history?.[0]?.action?.includes('Intern')).length}
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-md">
                <h3 className="text-gray-500 text-sm">
                  Assigned To Executive
                </h3>

                <p className="text-3xl font-bold mt-2">
                  {leads.filter((lead) => lead.assignedTo === 'Executive').length}
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-md">
                <h3 className="text-gray-500 text-sm">
                  Assigned To Manager
                </h3>

                <p className="text-3xl font-bold mt-2">
                  {leads.filter((lead) => lead.assignedTo === 'Manager').length}
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-md">
                <h3 className="text-gray-500 text-sm">
                  Manager Actions
                </h3>

                <p className="text-3xl font-bold mt-2">
                  {leads.filter((lead) =>
                    lead.status === 'Site Visit Scheduled' ||
                    lead.status === 'Site Visit Completed' ||
                    lead.status === 'Lost'
                  ).length}
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-md col-span-2">
                <h3 className="text-gray-500 text-sm">
                  Total Follow-ups (All Roles)
                </h3>

                <p className="text-3xl font-bold mt-2">
                  {leads.reduce((sum, lead) => sum + lead.followUps, 0)}
                </p>
              </div>
            </>
          )}

        </div>

      )}



      {(user.role === 'Manager' || user.role === 'Director') && (

        <div className="flex gap-4 mb-6 flex-wrap">

          <button
            onClick={() => setAnalyticsView('Intern')}
            className={`px-5 py-2 rounded-lg ${
              analyticsView === 'Intern'
                ? 'bg-blue-600 text-white'
                : 'bg-white border'
            }`}
          >
            Intern Dashboard
          </button>

          <button
            onClick={() => setAnalyticsView('Executive')}
            className={`px-5 py-2 rounded-lg ${
              analyticsView === 'Executive'
                ? 'bg-blue-600 text-white'
                : 'bg-white border'
            }`}
          >
            Executive Dashboard
          </button>

          {user.role === 'Director' && (
            <button
              onClick={() => setAnalyticsView('Manager')}
              className={`px-5 py-2 rounded-lg ${
                analyticsView === 'Manager'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border'
              }`}
            >
              Manager Dashboard
            </button>
          )}

        </div>

      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

        {analyticsView === 'Intern' && (
          <>
            <div className="bg-white p-5 rounded-xl shadow-md">
              <h3 className="text-gray-500 text-sm">
                Intern Leads
              </h3>

              <p className="text-3xl font-bold mt-2">
                {
                  leads.filter(
                    (lead) => lead.assignedTo === 'Intern'
                  ).length
                }
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-md">
              <h3 className="text-gray-500 text-sm">
                Follow-up 1
              </h3>

              <p className="text-3xl font-bold mt-2">
                {
                  leads.filter(
                    (lead) =>
                      lead.assignedTo === 'Intern' &&
                      lead.followUps === 1
                  ).length
                }
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-md">
              <h3 className="text-gray-500 text-sm">
                Follow-up 2
              </h3>

              <p className="text-3xl font-bold mt-2">
                {
                  leads.filter(
                    (lead) =>
                      lead.assignedTo === 'Intern' &&
                      lead.followUps === 2
                  ).length
                }
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-md">
              <h3 className="text-gray-500 text-sm">
                Follow-up 3
              </h3>

              <p className="text-3xl font-bold mt-2">
                {
                  leads.filter(
                    (lead) =>
                      lead.assignedTo === 'Intern' &&
                      lead.followUps === 3
                  ).length
                }
              </p>
            </div>
          </>
        )}

        {analyticsView === 'Executive' && (
          <>
            <div className="bg-white p-5 rounded-xl shadow-md">
              <h3 className="text-gray-500 text-sm">
                Executive Leads
              </h3>

              <p className="text-3xl font-bold mt-2">
                {
                  leads.filter(
                    (lead) => lead.assignedTo === 'Executive'
                  ).length
                }
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-md">
              <h3 className="text-gray-500 text-sm">
                Follow-up 1
              </h3>

              <p className="text-3xl font-bold mt-2">
                {
                  leads.filter(
                    (lead) =>
                      lead.assignedTo === 'Executive' &&
                      lead.followUps === 1
                  ).length
                }
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-md">
              <h3 className="text-gray-500 text-sm">
                Follow-up 2
              </h3>

              <p className="text-3xl font-bold mt-2">
                {
                  leads.filter(
                    (lead) =>
                      lead.assignedTo === 'Executive' &&
                      lead.followUps === 2
                  ).length
                }
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-md">
              <h3 className="text-gray-500 text-sm">
                Follow-up 3
              </h3>

              <p className="text-3xl font-bold mt-2">
                {
                  leads.filter(
                    (lead) =>
                      lead.assignedTo === 'Executive' &&
                      lead.followUps === 3
                  ).length
                }
              </p>
            </div>
          </>
        )}

        {analyticsView === 'Manager' && user.role === 'Director' && (
          <>
            <div className="bg-white p-5 rounded-xl shadow-md">
              <h3 className="text-gray-500 text-sm">
                Manager Leads
              </h3>

              <p className="text-3xl font-bold mt-2">
                {
                  leads.filter(
                    (lead) => lead.assignedTo === 'Manager'
                  ).length
                }
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-md">
              <h3 className="text-gray-500 text-sm">
                Site Visit Scheduled
              </h3>

              <p className="text-3xl font-bold mt-2">
                {
                  leads.filter(
                    (lead) =>
                      lead.status === 'Site Visit Scheduled'
                  ).length
                }
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-md">
              <h3 className="text-gray-500 text-sm">
                Site Visit Completed
              </h3>

              <p className="text-3xl font-bold mt-2">
                {
                  leads.filter(
                    (lead) =>
                      lead.status === 'Site Visit Completed'
                  ).length
                }
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-md">
              <h3 className="text-gray-500 text-sm">
                Client Lost
              </h3>

              <p className="text-3xl font-bold mt-2">
                {
                  leads.filter(
                    (lead) =>
                      lead.status === 'Lost'
                  ).length
                }
              </p>
            </div>
          </>
        )}

      </div>

      <div className="flex flex-wrap gap-3 mb-6">

        <button
          onClick={() => setLeadFilter('assigned')}
          className={`px-5 py-2 rounded-lg font-medium ${
            leadFilter === 'assigned'
              ? 'bg-blue-600 text-white'
              : 'bg-white border'
          }`}
        >
          Assigned To Me
        </button>

        {user.role !== 'Intern' && (
          <button
            onClick={() => setLeadFilter('unassigned')}
            className={`px-5 py-2 rounded-lg font-medium ${
              leadFilter === 'unassigned'
                ? 'bg-blue-600 text-white'
                : 'bg-white border'
            }`}
          >
            Not Assigned To Me
          </button>
        )}

      </div>

      {visibleLeads.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow text-center">

          <h2 className="text-2xl font-bold mb-2">
            No Leads Available
          </h2>

          <p className="text-gray-500">
            No leads found in this filter.
          </p>

        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {visibleLeads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              userRole={user.role}
              updateLead={updateLead}
            />
          ))}

        </div>
      )}

    </div>
  )
}
