import packageJson from '../../../package.json'

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-12 items-center justify-center">
          <span className="text-xs text-muted-foreground">
            v{packageJson.version}
          </span>
        </div>
      </div>
    </footer>
  )
}