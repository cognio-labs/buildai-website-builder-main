import { useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Sandpack } from '@codesandbox/sandpack-react'
import { Sparkles } from 'lucide-react'
import { blink } from '../lib/blink'

export function PreviewPage() {
  const { projectId } = useParams({ from: '/preview/$projectId' })

  const { data: project, isLoading } = useQuery({
    queryKey: ['preview', projectId],
    queryFn: async () => {
      return await blink.db.projects.get(projectId) as any
    },
    enabled: !!projectId
  })

  if (isLoading) return <div className="h-screen flex items-center justify-center">Loading Preview...</div>
  if (!project) return <div className="h-screen flex items-center justify-center">Project not found</div>

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <header className="h-12 border-b px-4 flex items-center justify-between shrink-0 bg-card">
         <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="font-bold text-sm">{project.name}</span>
            <span className="text-xs text-muted-foreground ml-2 border px-1.5 py-0.5 rounded">Preview Only</span>
         </div>
      </header>
      <div className="flex-1">
        <Sandpack 
          template="react"
          theme="dark"
          files={{
            '/App.js': project.latestCode || 'export default function App() { return <div>No code yet</div> }'
          }}
          options={{
            showNavigator: false,
            showTabs: false,
            editorHeight: '100%',
          }}
          className="sandpack"
        />
      </div>
    </div>
  )
}
