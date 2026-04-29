import { Button, Container, Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@blinkdotnew/ui'
import { Link } from '@tanstack/react-router'
import { Rocket, Zap, Shield, Sparkles, Globe, Code } from 'lucide-react'

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar className="border-b">
        <NavbarBrand>
          <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tighter">
            <Sparkles className="w-6 h-6 text-primary" />
            <span>BuildAI</span>
          </Link>
        </NavbarBrand>
        <NavbarContent className="hidden md:flex gap-6">
          <NavbarItem>Features</NavbarItem>
          <NavbarItem>Pricing</NavbarItem>
          <NavbarItem>Showcase</NavbarItem>
        </NavbarContent>
        <NavbarContent>
          <Link to="/auth">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link to="/dashboard">
            <Button>Start Building</Button>
          </Link>
        </NavbarContent>
      </Navbar>

      <main className="flex-1">
        <section className="py-24 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background -z-10" />
          <Container className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              <span>Next-generation AI Builder</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50">
              Build stunning websites <br /> with conversational AI
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Stop coding from scratch. Describe your vision, and BuildAI generates 
              production-ready React components with Tailwind CSS in seconds.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/dashboard">
                <Button size="lg" className="h-12 px-8 text-lg">
                  Start Building for Free
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-12 px-8 text-lg">
                View Showcase
              </Button>
            </div>
            
            <div className="mt-20 relative max-w-5xl mx-auto">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-xl blur opacity-25" />
              <div className="relative bg-card border rounded-xl shadow-2xl overflow-hidden aspect-video">
                <img 
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426&ixlib=rb-4.0.3" 
                  alt="BuildAI App Preview" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                   <Button size="lg" className="gap-2">
                     <Rocket className="w-5 h-5" />
                     Watch Demo
                   </Button>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section className="py-24 bg-muted/50">
          <Container>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">Everything you need to ship faster</h2>
              <p className="text-muted-foreground">Professional tools powered by advanced AI agents.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<Zap className="w-8 h-8 text-primary" />}
                title="Instant Live Preview"
                description="See your changes in real-time as you describe them. No more waiting for builds."
              />
              <FeatureCard 
                icon={<Code className="w-8 h-8 text-primary" />}
                title="Monaco Code Editor"
                description="Full control over the generated code. Tweak every pixel in a professional IDE."
              />
              <FeatureCard 
                icon={<Globe className="w-8 h-8 text-primary" />}
                title="One-Click Deploy"
                description="Launch your site to the world instantly with our global edge infrastructure."
              />
            </div>
          </Container>
        </section>
      </main>

      <footer className="border-t py-12">
        <Container className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
            <Sparkles className="w-6 h-6 text-primary" />
            <span>BuildAI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 BuildAI. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <span>Twitter</span>
            <span>Discord</span>
            <span>Github</span>
          </div>
        </Container>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-card border p-8 rounded-xl hover:shadow-lg transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}
