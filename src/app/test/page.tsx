'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestPage() {
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'connected' | 'error'>('testing')
  const [error, setError] = useState<string | null>(null)
  const [tables, setTables] = useState<any[]>([])

  useEffect(() => {
    testConnection()
  }, [])

  const testConnection = async () => {
    try {
      // Test basic connection
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .limit(5)

      if (error) {
        setError(error.message)
        setConnectionStatus('error')
      } else {
        setTables(data || [])
        setConnectionStatus('connected')
      }
    } catch (err) {
      setError('Failed to connect to Supabase')
      setConnectionStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-2xl space-y-6">
        <h1 className="text-3xl font-bold">Supabase Connection Test</h1>

        <Card>
          <CardHeader>
            <CardTitle>Connection Status</CardTitle>
            <CardDescription>Testing connection to your Supabase database</CardDescription>
          </CardHeader>
          <CardContent>
            {connectionStatus === 'testing' && (
              <div className="text-blue-600">Testing connection...</div>
            )}
            {connectionStatus === 'connected' && (
              <div className="text-green-600">✅ Connected successfully!</div>
            )}
            {connectionStatus === 'error' && (
              <div className="text-red-600">❌ Connection failed: {error}</div>
            )}
          </CardContent>
        </Card>

        {connectionStatus === 'connected' && (
          <Card>
            <CardHeader>
              <CardTitle>Sample Data</CardTitle>
              <CardDescription>Departments from your database</CardDescription>
            </CardHeader>
            <CardContent>
              {tables.length > 0 ? (
                <div className="space-y-2">
                  {tables.map((dept) => (
                    <div key={dept.id} className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: dept.color }}
                      ></div>
                      <span>{dept.name}</span>
                      <span className="text-sm text-muted-foreground">({dept.description})</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-muted-foreground">No data found - run the database setup script first.</div>
              )}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {connectionStatus === 'error' && (
                <>
                  <p>1. ✅ Check your .env.local file has correct Supabase credentials</p>
                  <p>2. ❌ Run the database setup script in Supabase SQL Editor</p>
                  <p>3. ❌ Enable email authentication in Supabase Auth settings</p>
                </>
              )}
              {connectionStatus === 'connected' && (
                <>
                  <p>1. ✅ Supabase connection working</p>
                  <p>2. {tables.length > 0 ? '✅' : '❌'} Database tables {tables.length > 0 ? 'exist' : 'need setup'}</p>
                  <p>3. ❌ Create your first user account at <a href="/login" className="text-blue-600 underline">/login</a></p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}