import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProtectedRoute } from '@/components/auth/protected-route'
import { Navigation } from '@/components/layout/navigation'

export default function HomePage() {
  return (
    <ProtectedRoute>
      <Navigation />
      <main className="container mx-auto py-10">
        <div className="flex flex-col items-center justify-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Theater Production Dashboard
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl text-center">
            Collaboration tool for theater productions - manage props, costumes, tasks, and notes.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 w-full max-w-4xl">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Requisiten & Kostüme</CardTitle>
                <CardDescription>
                  Track items with customizable properties, status, and character assignments.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/items">
                  <Button variant="outline" className="w-full">
                    Manage Items
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Task Management</CardTitle>
                <CardDescription>
                  Organize tasks by department with multi-status workflow.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/tasks">
                  <Button variant="outline" className="w-full">
                    View Tasks
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Collaborative Notes</CardTitle>
                <CardDescription>
                  Rich text editing with conflict warnings and version history.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/notes">
                  <Button variant="outline" className="w-full">
                    Open Notes
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  )
}