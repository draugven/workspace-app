import { AuthSetup } from '@/components/auth/auth-setup'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Theater Production App</h1>
          <p className="text-muted-foreground">
            Access your theater production tools
          </p>
        </div>
        <AuthSetup />
      </div>
    </div>
  )
}