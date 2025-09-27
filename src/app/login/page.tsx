import { AuthSetup } from '@/components/auth/auth-setup'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Theater-Produktions-App</h1>
          <p className="text-muted-foreground">
            Zugang zu Ihren Theater-Produktions-Tools
          </p>
        </div>
        <AuthSetup />
      </div>
    </div>
  )
}