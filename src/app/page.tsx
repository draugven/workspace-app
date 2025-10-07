import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProtectedRoute } from '@/components/auth/protected-route'

export default function HomePage() {
  return (
    <ProtectedRoute>
      <main className="container mx-auto py-10">
        <div className="flex flex-col items-center justify-center space-y-4">
          <h1 className="text-h1">
            Dashboard
          </h1>
          <p className="text-body text-muted-foreground max-w-2xl text-center">
            Kollaborations-Tool für Theaterproduktionen.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 w-full max-w-4xl">
            <Card>
              <CardHeader>
                <CardTitle className="text-h3">Requisiten</CardTitle>
                <CardDescription className="text-body">
                  Verwalte Gegenstände mit anpassbaren Eigenschaften, Status und Charakterzuordnungen.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/props">
                  <Button variant="outline" className="w-full">
                    Requisiten verwalten
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-h3">Aufgabenverwaltung</CardTitle>
                <CardDescription className="text-body">
                  Organisiere Aufgaben nach Abteilungen mit mehrstufigem Workflow.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/tasks">
                  <Button variant="outline" className="w-full">
                    Aufgaben anzeigen
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-h3">Kollaborative Notizen</CardTitle>
                <CardDescription className="text-body">
                  Rich-Text-Bearbeitung mit Konfliktwarnung und Versionsverlauf.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/notes">
                  <Button variant="outline" className="w-full">
                    Notizen öffnen
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