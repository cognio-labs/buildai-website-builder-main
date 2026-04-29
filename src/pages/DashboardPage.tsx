import { useState } from 'react'
import { 
  AppShell, AppShellSidebar, AppShellMain, 
  SidebarItem, Button, Page, PageHeader, 
  PageTitle, PageActions, PageBody, 
  DataTable, EmptyState, MobileSidebarTrigger,
  Card, CardHeader, CardTitle, CardDescription, CardFooter,
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
  Input, Label, toast
} from '@blinkdotnew/ui'
import { LayoutDashboard, Plus, Settings, LogOut, Sparkles, Folder, Trash2, ExternalLink } from 'lucide-react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { blink } from '../lib/blink'
import { useAuth } from '../hooks/useAuth'

interface Project {
  id: string
  name: string
  description: string
  latestCode: string
  chatHistory: string
  createdAt: string
  updatedAt: string
}

import { ThemeToggle } from '../components/ThemeToggle'

export function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      if (!user) return []
      return await blink.db.projects.list({
        where: { userId: user.id },
        orderBy: { updatedAt: 'desc' }
      }) as Project[]
    },
    enabled: !!user
  })

  const createProject = useMutation({
    mutationFn: async (name: string) => {
      const id = 'proj_' + Math.random().toString(36).substring(2, 9)
      return await blink.db.projects.create({
        id,
        userId: user!.id,
        name,
        description: 'New AI generated project',
        chatHistory: '[]',
        latestCode: ''
      })
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      setIsCreateOpen(false)
      setNewProjectName('')
      toast.success('Project created successfully')
      navigate({ to: '/builder/$projectId', params: { projectId: data.id } })
    }
  })

  const deleteProject = useMutation({
    mutationFn: async (id: string) => {
      return await blink.db.projects.delete(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast.success('Project deleted')
    }
  })

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
            <SidebarItem icon={<LayoutDashboard className="w-5 h-5" />} label="Projects" active />
            <SidebarItem icon={<Settings className="w-5 h-5" />} label="Settings" />
            <Link to="/billing">
               <SidebarItem icon={<Sparkles className="w-5 h-5" />} label="Upgrade to Pro" />
            </Link>
          </div>
          <div className="shrink-0 border-t p-4 space-y-4">
            <div className="flex items-center justify-between px-2">
               <span className="text-xs text-muted-foreground uppercase font-semibold">Theme</span>
               <ThemeToggle />
            </div>
            <div className="flex items-center gap-3 px-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                {user.displayName?.[0] || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.displayName || 'User'}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
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
            <PageTitle>My Projects</PageTitle>
            <PageActions>
              <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                New Project
              </Button>
            </PageActions>
          </PageHeader>
          <PageBody>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {[1,2,3].map(i => <div key={i} className="h-48 rounded-xl bg-muted animate-pulse" />)}
              </div>
            ) : projects.length === 0 ? (
              <EmptyState 
                icon={<Folder className="w-12 h-12" />}
                title="No projects found"
                description="Start your first project and build something amazing with AI."
                action={{ label: 'Create Project', onClick: () => setIsCreateOpen(true) }}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <Card key={project.id} className="group overflow-hidden border-border/50 hover:border-primary/50 transition-colors">
                    <div className="aspect-video bg-muted relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 z-10">
                        <Link to="/builder/$projectId" params={{ projectId: project.id }}>
                          <Button size="sm" className="gap-2">
                            Open Builder
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20">
                        <Sparkles className="w-16 h-16" />
                      </div>
                    </div>
                    <CardHeader className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{project.name}</CardTitle>
                          <CardDescription className="line-clamp-1">{project.description}</CardDescription>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => deleteProject.mutate(project.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardFooter className="p-4 pt-0 text-xs text-muted-foreground">
                      Updated {new Date(project.updatedAt).toLocaleDateString()}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </PageBody>
        </Page>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Project Name</Label>
                <Input 
                  id="name" 
                  placeholder="My Portfolio" 
                  value={newProjectName} 
                  onChange={(e) => setNewProjectName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && createProject.mutate(newProjectName)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
              <Button 
                onClick={() => createProject.mutate(newProjectName)}
                disabled={!newProjectName.trim() || createProject.isPending}
              >
                {createProject.isPending ? 'Creating...' : 'Create Project'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </AppShellMain>
    </AppShell>
  )
}
