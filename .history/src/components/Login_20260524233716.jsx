# Update for `src/components/Login.jsx`

Replace your current `Login.jsx` with this updated version.

```jsx
import { useState } from 'react'
import { users } from '../data'

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [copiedUser, setCopiedUser] = useState('')

  const handleLogin = () => {
    const user = users.find(
      (u) => u.username === username && u.password === password
    )

    if (user) {
      onLogin(user)
    } else {
      setError('Invalid credentials')
    }
  }

  const handleCopy = async (user) => {
    const credentials = `Username: ${user.username}\nPassword: ${user.password}`

    try {
      await navigator.clipboard.writeText(credentials)

      // Auto fill inputs
      setUsername(user.username)
      setPassword(user.password)

      setCopiedUser(user.username)

      setTimeout(() => {
        setCopiedUser('')
      }, 2000)
    } catch (err) {
      console.error('Copy failed', err)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Real Estate CRM
        </h1>

        <input
          type="text"
          placeholder="Username"
          className="w-full border p-3 rounded mb-4"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>

        {error && <p className="text-red-500 mt-3">{error}</p>}

        <div className="mt-6 text-sm text-gray-600">
          <p className="font-bold mb-3">Demo Credentials:</p>

          {users.map((user) => (
            <div
              key={user.username}
              className="flex items-center justify-between border rounded-lg px-3 py-2 mb-2"
            >
              <div>
                <p className="font-medium">{user.username}</p>
                <p className="text-xs text-gray-500">{user.password}</p>
              </div>

              <button
                onClick={() => handleCopy(user)}
                className="bg-gray-900 text-white px-3 py-1 rounded text-xs hover:bg-black transition"
              >
                {copiedUser === user.username ? 'Copied!' : 'Copy'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
 