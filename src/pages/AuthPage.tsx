import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Container } from '@blinkdotnew/ui'
import { Sparkles } from 'lucide-react'
import { blink } from '../lib/blink'

export function AuthPage() {
  const handleLogin = () => {
    blink.auth.login(window.location.origin + '/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <Container className="max-w-md">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-3xl tracking-tighter">
            <Sparkles className="w-8 h-8 text-primary" />
            <span>BuildAI</span>
          </div>
          <Card className="w-full">
            <CardHeader className="text-center">
              <CardTitle>Welcome back</CardTitle>
              <CardDescription>Login or create an account to start building.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleLogin} className="w-full h-12 text-lg">
                Continue with Blink Auth
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-6">
                By continuing, you agree to our Terms of Service and Privacy Policy.
              </p>
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  )
}
