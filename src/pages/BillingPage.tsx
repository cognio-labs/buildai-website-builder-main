import { useState } from 'react'
import { 
  AppShell, AppShellSidebar, AppShellMain, 
  SidebarItem, Button, Page, PageHeader, 
  PageTitle, PageBody, MobileSidebarTrigger,
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
  Badge, toast
} from '@blinkdotnew/ui'
import { LayoutDashboard, Settings, LogOut, Sparkles, Check, Rocket, Zap } from 'lucide-react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useAuth } from '../hooks/useAuth'
import { blink } from '../lib/blink'

export function BillingPage() {
  const { user, isLoading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [isUpgrading, setIsUpgrading] = useState(false)

  const plans = [
    {
      name: 'Free',
      price: '$0',
      description: 'Perfect for exploring and personal projects.',
      features: ['3 Projects', 'Standard AI Generation', 'Public Share Links', 'Community Support'],
      button: 'Current Plan',
      current: true
    },
    {
      name: 'Pro',
      price: '$12',
      period: '/mo',
      description: 'Advanced tools for professional developers.',
      features: [
        'Unlimited Projects', 
        'Priority AI Generation', 
        'Private Share Links', 
        'Custom Domains', 
        'Premium Support',
        'Advanced Code Diffing'
      ],
      button: 'Upgrade to Pro',
      featured: true
    }
  ]

  const handleUpgrade = async () => {
    setIsUpgrading(true)
    // Mocking Stripe checkout
    await new Promise(r => setTimeout(r, 2000))
    setIsUpgrading(false)
    toast.success('Successfully upgraded to Pro!')
  }

  if (authLoading) return <div className="h-screen flex items-center justify-center">Loading...</div>
  if (!user) {
    navigate({ to: '/auth' })
    return null
  }

  return (
    <AppShell>
      <AppShellSidebar className="shrink-0">
        <div className="flex flex-col h-full w-[16rem] bg-card border-r border-border overflow-hidden">
          <div className="shrink-0 px-6 py-8">
            <Link to="/" className="flex items-center gap-2 font-bold text-2xl tracking-tighter">
              <Sparkles className="w-6 h-6 text-primary" />
              <span>BuildAI</span>
            </Link>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto px-4 space-y-2">
            <Link to="/dashboard">
              <SidebarItem icon={<LayoutDashboard className="w-5 h-5" />} label="Projects" />
            </Link>
            <SidebarItem icon={<Settings className="w-5 h-5" />} label="Settings" />
            <SidebarItem icon={<Sparkles className="w-5 h-5" />} label="Billing" active />
          </div>
          <div className="shrink-0 border-t p-4">
            <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground" onClick={() => blink.auth.signOut()}>
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </AppShellSidebar>
      <AppShellMain>
        <div className="md:hidden flex items-center gap-2 px-4 h-14 border-b">
          <MobileSidebarTrigger />
          <span className="font-bold">BuildAI</span>
        </div>
        
        <Page>
          <PageHeader>
            <PageTitle>Plans & Billing</PageTitle>
          </PageHeader>
          <PageBody>
            <div className="max-w-4xl mx-auto py-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tighter mb-4">Choose the right plan for you</h2>
                <p className="text-muted-foreground">Unlock the full power of AI-assisted web development.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {plans.map((plan) => (
                  <Card key={plan.name} className={`relative flex flex-col ${plan.featured ? 'border-primary shadow-xl shadow-primary/10' : ''}`}>
                    {plan.featured && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                        MOST POPULAR
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="text-2xl">{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                      <div className="mt-4 flex items-baseline gap-1">
                        <span className="text-4xl font-bold">{plan.price}</span>
                        {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <ul className="space-y-3">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2 text-sm">
                            <Check className="w-4 h-4 text-primary shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full" 
                        variant={plan.current ? 'outline' : 'default'}
                        disabled={plan.current || isUpgrading}
                        onClick={handleUpgrade}
                      >
                        {isUpgrading && plan.featured ? 'Processing...' : plan.button}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              <Card className="mt-12 bg-muted/30 border-dashed">
                <CardContent className="p-8 flex flex-col md:flex-row items-center gap-6 justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Rocket className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold">Need a custom plan for your team?</h3>
                      <p className="text-sm text-muted-foreground">Contact us for custom enterprise pricing and dedicated support.</p>
                    </div>
                  </div>
                  <Button variant="outline">Contact Sales</Button>
                </CardContent>
              </Card>
            </div>
          </PageBody>
        </Page>
      </AppShellMain>
    </AppShell>
  )
}
