import { useState } from 'react'
import { users } from '../data'

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

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
          className="w-full bg-blue-600 text-white py-3 rounded"
        >
          Login
        </button>

        {error && <p className="text-red-500 mt-3">{error}</p>}

        <div className="mt-6 text-sm text-gray-600">
          <p className="font-bold mb-2">Demo Credentials:</p>
          <p>director / director123</p>
          <p>manager / manager123</p>
          <p>executive / executive123</p>
          <p>intern / intern123</p>
        </div>
      </div>
    </div>
  )
}
