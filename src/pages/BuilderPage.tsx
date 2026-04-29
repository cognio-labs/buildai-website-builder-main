import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  Button, Page, PageHeader, PageTitle, 
  PageActions, PageBody, Input, 
  Tabs, TabsList, TabsTrigger, TabsContent,
  toast, Banner, LoadingOverlay
} from '@blinkdotnew/ui'
import { 
  Sparkles, Send, Eye, Code, 
  Share2, Rocket, ArrowLeft, 
  ChevronRight, AlertCircle, RefreshCcw
} from 'lucide-react'
import { Sandpack } from '@codesandbox/sandpack-react'
import Editor from '@monaco-editor/react'
import ReactDiffViewer from 'react-diff-viewer-continued'
import { blink } from '../lib/blink'
import { useAuth } from '../hooks/useAuth'
import { mockGenerateCode } from '../lib/ai'
import { ThemeToggle } from '../components/ThemeToggle'

interface Project {
  id: string
  name: string
  description: string
  latestCode: string
  chatHistory: string
  updatedAt: string
}

interface Message {
  role: 'user' | 'assistant'
  content: string
  code?: string
}

export function BuilderPage() {
  const { projectId } = useParams({ from: '/builder/$projectId' })
  const { user, isLoading: authLoading } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [activeTab, setActiveTab] = useState('preview')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [latestCode, setLatestCode] = useState('')
  const [showDiff, setShowDiff] = useState(false)
  const [previousCode, setPreviousCode] = useState('')
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [imagePrompt, setImagePrompt] = useState('')
  
  const chatEndRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<any>(null)

  // Fetch project data
  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const data = await blink.db.projects.get(projectId) as Project
      if (data) {
        setMessages(JSON.parse(data.chatHistory || '[]'))
        setLatestCode(data.latestCode || '')
      }
      return data
    },
    enabled: !!projectId && !!user
  })

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Save project mutation
  const saveProject = useMutation({
    mutationFn: async (updates: Partial<Project>) => {
      return await blink.db.projects.update(projectId, {
        ...updates,
        updatedAt: new Date().toISOString()
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', projectId] })
    }
  })

  const handleSend = async () => {
    if (!input.trim() || isGenerating) return

    const userMessage: Message = { role: 'user', content: input }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setIsGenerating(true)
    setError(null)
    setShowDiff(false)

    try {
      // Logic for AI generation
      // We'll use the mock service for now as requested
      const generatedCode = await mockGenerateCode(input)
      
      const assistantMessage: Message = { 
        role: 'assistant', 
        content: `I've updated the code based on your request.`,
        code: generatedCode
      }
      
      setPreviousCode(latestCode)
      setLatestCode(generatedCode)
      const finalMessages = [...updatedMessages, assistantMessage]
      setMessages(finalMessages)
      
      // Auto-save to DB
      await saveProject.mutateAsync({
        chatHistory: JSON.stringify(finalMessages),
        latestCode: generatedCode
      })
      
      toast.success('Code generated successfully')
    } catch (err) {
      console.error(err)
      setError('Failed to generate code. Please try again.')
      toast.error('Generation failed')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim() || isGeneratingImage) return
    
    setIsGeneratingImage(true)
    try {
      const { mockGenerateImage } = await import('../lib/ai')
      const imageUrl = await mockGenerateImage(imagePrompt)
      setGeneratedImages([imageUrl, ...generatedImages])
      setImagePrompt('')
      toast.success('Image generated!')
    } catch (err) {
      toast.error('Failed to generate image')
    } finally {
      setIsGeneratingImage(false)
    }
  }

  const handleEditorMount = (editor: any, monaco: any) => {
    editorRef.current = editor
    
    // Add basic auto-completion
    monaco.languages.registerCompletionItemProvider('javascript', {
      provideCompletionItems: (model: any, position: any) => {
        const suggestions = [
          {
            label: 'div',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: '<div>$0</div>',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'HTML div element'
          },
          {
            label: 'className',
            kind: monaco.languages.CompletionItemKind.Property,
            insertText: 'className="$0"',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          },
          {
            label: 'useState',
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: 'const [${1:state}, set${1/(.*)/${1:/capitalize}/}] = useState(${2:initialValue})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          }
        ]
        return { suggestions }
      }
    })
  }

  const formatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument').run()
    }
  }

  if (authLoading || projectLoading) return <div className="h-screen flex items-center justify-center">Loading Builder...</div>
  if (!user) {
    navigate({ to: '/auth' })
    return null
  }
  if (!project) return <div>Project not found</div>

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Top Bar */}
      <header className="h-16 border-b px-4 flex items-center justify-between shrink-0 bg-card">
        <div className="flex items-center gap-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h1 className="font-bold text-lg">{project.name}</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" className="gap-2" onClick={() => {
             const url = window.location.origin + '/preview/' + project.id
             navigator.clipboard.writeText(url)
             toast.success('Share link copied!')
          }}>
            <Share2 className="w-4 h-4" />
            Share
          </Button>
          <Button className="gap-2">
            <Rocket className="w-4 h-4" />
            Deploy
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Chat & Assets */}
        <div className="w-[35%] flex flex-col border-r bg-card/50">
          <Tabs defaultValue="chat" className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="h-12 bg-transparent border-b rounded-none px-4 justify-start gap-4">
              <TabsTrigger value="chat" className="data-[state=active]:bg-muted">Chat</TabsTrigger>
              <TabsTrigger value="images" className="data-[state=active]:bg-muted">Images</TabsTrigger>
            </TabsList>
            
            <TabsContent value="chat" className="flex-1 flex flex-col overflow-hidden m-0">
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {messages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                       <Sparkles className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">What are we building today?</h3>
                      <p className="text-muted-foreground">Describe your vision, like "a modern landing page for a coffee shop".</p>
                    </div>
                  </div>
                )}
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl p-4 ${
                      m.role === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-tr-none' 
                        : 'bg-muted border rounded-tl-none'
                    }`}>
                      <p className="text-sm leading-relaxed">{m.content}</p>
                    </div>
                  </div>
                ))}
                {isGenerating && (
                  <div className="flex justify-start">
                    <div className="bg-muted border rounded-2xl rounded-tl-none p-4 max-w-[85%] flex items-center gap-2">
                       <div className="flex gap-1">
                          <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                          <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                       </div>
                       <span className="text-xs text-muted-foreground ml-2 font-medium">BuildAI is thinking...</span>
                    </div>
                  </div>
                )}
                {error && (
                  <Banner variant="error" className="mt-4">
                    <div className="flex items-center gap-4 justify-between w-full">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        <span>{error}</span>
                      </div>
                      <Button size="sm" variant="ghost" className="h-7 px-2" onClick={handleSend}>
                        <RefreshCcw className="w-3 h-3 mr-1" />
                        Retry
                      </Button>
                    </div>
                  </Banner>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="p-4 border-t bg-card">
                <div className="relative">
                  <Input 
                    placeholder="Type your prompt..." 
                    className="pr-12 h-12 rounded-xl"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  />
                  <Button 
                    size="icon" 
                    className="absolute right-1.5 top-1.5 h-9 w-9 rounded-lg"
                    disabled={!input.trim() || isGenerating}
                    onClick={handleSend}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="images" className="flex-1 flex flex-col overflow-hidden m-0 p-4 space-y-4">
              <div className="space-y-2">
                <h3 className="font-bold">Generate AI Image</h3>
                <div className="flex gap-2">
                  <Input 
                    placeholder="e.g. 'futuristic coffee shop'..." 
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerateImage()}
                  />
                  <Button onClick={handleGenerateImage} disabled={!imagePrompt.trim() || isGeneratingImage}>
                    {isGeneratingImage ? <RefreshCcw className="w-4 h-4 animate-spin" /> : 'Generate'}
                  </Button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto grid grid-cols-2 gap-4">
                {generatedImages.map((img, i) => (
                  <div key={i} className="group relative aspect-square rounded-lg overflow-hidden border bg-muted">
                    <img src={img} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                       <Button size="sm" variant="secondary" onClick={() => {
                          navigator.clipboard.writeText(img)
                          toast.success('Image URL copied!')
                       }}>Copy URL</Button>
                    </div>
                  </div>
                ))}
                {generatedImages.length === 0 && !isGeneratingImage && (
                  <div className="col-span-2 h-40 flex items-center justify-center text-muted-foreground text-sm border-2 border-dashed rounded-lg">
                    No images generated yet
                  </div>
                )}
                {isGeneratingImage && (
                  <div className="aspect-square rounded-lg border bg-muted animate-pulse flex items-center justify-center">
                    <RefreshCcw className="w-8 h-8 text-muted-foreground animate-spin" />
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Panel: Preview/Code */}
        <div className="flex-1 flex flex-col bg-muted/20">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <div className="flex items-center justify-between px-4 border-b bg-card shrink-0">
              <TabsList className="h-12 bg-transparent border-none">
                <TabsTrigger value="preview" className="gap-2 data-[state=active]:bg-muted">
                  <Eye className="w-4 h-4" />
                  Preview
                </TabsTrigger>
                <TabsTrigger value="code" className="gap-2 data-[state=active]:bg-muted">
                  <Code className="w-4 h-4" />
                  Code
                </TabsTrigger>
              </TabsList>
              
              {activeTab === 'code' && (
                <div className="flex items-center gap-2">
                   <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`h-8 gap-2 ${showDiff ? 'bg-primary/10 text-primary' : ''}`}
                    onClick={() => setShowDiff(!showDiff)}
                   >
                     Diff View
                   </Button>
                </div>
              )}
            </div>

            <div className="flex-1 relative">
              <TabsContent value="preview" className="h-full m-0 p-0 border-none">
                {!latestCode ? (
                   <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                      <Sparkles className="w-12 h-12 text-muted-foreground/20" />
                      <p className="text-muted-foreground">Describe what you want to build to see it here.</p>
                   </div>
                ) : (
                  <Sandpack 
                    template="react"
                    theme="dark"
                    files={{
                      '/App.js': latestCode
                    }}
                    options={{
                      showNavigator: false,
                      showTabs: false,
                      editorHeight: '100%',
                    }}
                    className="sandpack"
                  />
                )}
              </TabsContent>
              <TabsContent value="code" className="h-full m-0 p-0 border-none">
                {showDiff ? (
                  <div className="h-full overflow-auto bg-background p-4">
                     <ReactDiffViewer 
                        oldValue={previousCode} 
                        newValue={latestCode} 
                        splitView={true} 
                        useDarkTheme={true}
                     />
                  </div>
                ) : (
                  <Editor
                    height="100%"
                    defaultLanguage="javascript"
                    theme="vs-dark"
                    value={latestCode}
                    options={{
                      readOnly: true,
                      minimap: { enabled: false },
                      fontSize: 14,
                    }}
                  />
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
