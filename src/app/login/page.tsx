import Image from 'next/image'
import { AuthSetup } from '@/components/auth/auth-setup'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Image
              src="/back2stage_logo.svg"
              alt="Back2Stage"
              width={200}
              height={37}
              priority
              className="h-10 w-auto"
              style={{ width: 'auto' }}
            />
          </div>
        </div>
        <AuthSetup />
      </div>
    </div>
  )
}