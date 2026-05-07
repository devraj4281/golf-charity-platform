'use client'

import { useState } from 'react'

export function ApiTester() {
  const [results, setResults] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})

  const testEndpoint = async (name: string, url: string, method = 'GET', body?: any) => {
    setLoading(prev => ({ ...prev, [name]: true }))
    try {
      const res = await fetch(url, {
        method,
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined
      })
      const data = await res.json()
      setResults(prev => ({ ...prev, [name]: { status: res.status, data } }))
    } catch (err: any) {
      setResults(prev => ({ ...prev, [name]: { error: err.message } }))
    } finally {
      setLoading(prev => ({ ...prev, [name]: false }))
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button 
          onClick={() => testEndpoint('scores', '/api/scores')}
          disabled={loading['scores']}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading['scores'] ? 'Testing...' : 'Test GET /api/scores'}
        </button>
        <button 
          onClick={() => testEndpoint('login', '/api/login', 'POST', { email: 'test@example.com', password: 'wrong' })}
          disabled={loading['login']}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
        >
          {loading['login'] ? 'Testing...' : 'Test POST /api/login (Bad Auth)'}
        </button>
      </div>

      <div className="space-y-4 mt-6">
        {Object.entries(results).map(([name, result]) => (
          <div key={name} className="p-4 border rounded bg-zinc-50 dark:bg-zinc-800">
            <h4 className="font-bold uppercase text-xs text-zinc-500 mb-2">Result: {name}</h4>
            <pre className="text-xs overflow-auto max-h-40">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  )
}
