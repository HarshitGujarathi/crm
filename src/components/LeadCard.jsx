
import { useState } from 'react'

export default function LeadCard({ lead, userRole, updateLead }) {

  const [managerAction, setManagerAction] = useState('')

  const addFollowUp = () => {
    if (lead.followUps >= 3) return

    updateLead(lead.id, {
      followUps: lead.followUps + 1,
      history: [
        ...lead.history,
        {
          action: `Follow-up ${lead.followUps + 1} completed by ${userRole}`,
          date: new Date().toLocaleString(),
        },
      ],
    })
  }

  const moveLead = () => {

    let nextRole = ''

    if (lead.assignedTo === 'Intern') nextRole = 'Executive'
    else if (lead.assignedTo === 'Executive') nextRole = 'Manager'
    else if (lead.assignedTo === 'Manager') nextRole = 'Director'
    else nextRole = 'Director'

    updateLead(lead.id, {
      assignedTo: nextRole,

      followUps: nextRole === 'Director' ? lead.followUps : 0,

      notificationFor: nextRole,

      notificationMessage: `${lead.assignedTo} assigned a lead to you`,

      history: [
        ...lead.history,
        {
          action: `Lead moved from ${lead.assignedTo} to ${nextRole}`,
          date: new Date().toLocaleString(),
        },
      ],
    })
  }

  const markLost = () => {
    updateLead(lead.id, {
      status: 'Lost',
      history: [
        ...lead.history,
        {
          action: 'Lead marked as Lost after no response in 3 follow-ups',
          date: new Date().toLocaleString(),
        },
      ],
    })
  }

  const saveManagerAction = () => {
    if (!managerAction) return

    let updatedStatus = lead.status

    if (managerAction === 'Site Visit Scheduled') {
      updatedStatus = 'Site Visit Scheduled'
    }

    if (managerAction === 'Site Visit Completed') {
      updatedStatus = 'Site Visit Completed'
    }

    if (managerAction === 'Client Lost') {
      updatedStatus = 'Lost'
    }

    updateLead(lead.id, {
      status: updatedStatus,
      history: [
        ...lead.history,
        {
          action: `Manager Action: ${managerAction}`,
          date: new Date().toLocaleString(),
        },
      ],
    })

    setManagerAction('')
  }

  return (
    <div className="bg-white p-4 md:p-5 rounded-xl shadow-md">

      <div className="flex flex-col md:flex-row gap-3 justify-between md:items-center">

        <div>
          <h2 className="text-xl md:text-2xl font-bold">{lead.client}</h2>

          <p className="mt-2 text-gray-700">
            📞 {lead.phone}
          </p>

          <p className="mt-1">{lead.property}</p>

          <p className="mt-2 text-sm">
            <span className="font-semibold">
              Requirement Verification:
            </span>{' '}
            {lead.requirementVerification}
          </p>

          <p className="text-gray-500 mt-2">
            Assigned To: {lead.assignedTo}
          </p>
        </div>

        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
          {lead.status}
        </span>

      </div>

      {userRole !== 'Director' && (
        <div className="mt-5">

          <p className="font-bold text-lg">
            Follow-ups: {lead.followUps} / 3
          </p>

          {lead.followUps < 3 && lead.status !== 'Lost' && (
            <button
              onClick={addFollowUp}
              className="mt-3 bg-yellow-500 text-white px-4 py-2 rounded mr-3"
            >
              Mark Follow-up
            </button>
          )}

          {lead.followUps >= 3 && lead.status !== 'Lost' && (
            <button
              onClick={markLost}
              className="mt-3 bg-red-600 text-white px-4 py-2 rounded"
            >
              Mark as Lost
            </button>
          )}

        </div>
      )}

      {userRole !== 'Director' && lead.status !== 'Lost' && (
        <button
          onClick={moveLead}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
        >
          Move to Next Role
        </button>
      )}


      {userRole === 'Executive' && (
        <div className="mt-5 border rounded-xl p-4 bg-gray-50">

          <h3 className="font-bold text-lg mb-3">
            Requirement Verification
          </h3>

          <select
            value={lead.requirementVerification || 'Pending'}
            onChange={(e) => {
              updateLead(lead.id, {
                requirementVerification: e.target.value,
                history: [
                  ...lead.history,
                  {
                    action: `Executive updated requirement verification to ${e.target.value}`,
                    date: new Date().toLocaleString(),
                  },
                ],
              })
            }}
            className="w-full border p-3 rounded"
          >
            <option value="Pending">Pending</option>
            <option value="Verified">Verified</option>
            <option value="Budget Verified">Budget Verified</option>
            <option value="Location Verified">Location Verified</option>
            <option value="Requirement Mismatch">Requirement Mismatch</option>
          </select>

        </div>
      )}


      {userRole === 'Manager' && (
        <div className="mt-6 border rounded-xl p-4 bg-gray-50">

          <h3 className="font-bold text-lg mb-3">
            Manager Actions
          </h3>

          <select
            value={managerAction}
            onChange={(e) => setManagerAction(e.target.value)}
            className="w-full border p-3 rounded mb-3"
          >
            <option value="">Select Action</option>

            <option value="Site Visit Scheduled">
              Site Visit Scheduled
            </option>

            <option value="Site Visit Completed">
              Site Visit Completed
            </option>

            <option value="Client Lost">
              Client Lost
            </option>

          </select>

          <button
            onClick={saveManagerAction}
            className="bg-purple-600 text-white px-4 py-2 rounded"
          >
            Save Action
          </button>

        </div>
      )}

      <div className="mt-5">

        <h3 className="font-bold mb-3 text-lg">
          Timeline
        </h3>

        <ul className="space-y-3">

          {lead.history.map((item, index) => (

            <li
              key={index}
              className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 rounded"
            >

              <p className="text-sm font-medium text-gray-800">
                {item.action}
              </p>

              <p className="text-xs text-gray-500 mt-1">
                {item.date}
              </p>

            </li>

          ))}

        </ul>

      </div>

    </div>
  )
}
