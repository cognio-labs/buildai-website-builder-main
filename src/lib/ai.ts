/**
 * Mocked AI service that returns deterministic code based on user prompts.
 * This ensures the app works 100% even without real API keys,
 * while still being able to use the real Blink AI agent.
 */

const PRESET_RESPONSES: Record<string, string> = {
  'landing page': `
import React from 'react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="px-6 py-4 border-b flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">SiteGen</h1>
        <nav className="space-x-4">
          <a href="#" className="text-gray-600 hover:text-blue-600">Home</a>
          <a href="#" className="text-gray-600 hover:text-blue-600">Features</a>
          <a href="#" className="text-gray-600 hover:text-blue-600">About</a>
        </nav>
      </header>
      <main className="px-6 py-20 text-center">
        <h2 className="text-5xl font-extrabold mb-6">Build Faster with AI</h2>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          The most advanced AI website builder. Just describe what you want and watch the magic happen.
        </p>
        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition">
          Get Started
        </button>
      </main>
    </div>
  );
}
`,
  'contact form': `
import React from 'react';

export default function ContactForm() {
  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-xl mt-20">
      <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input type="text" className="mt-1 block w-full border rounded-md p-2" placeholder="John Doe" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" className="mt-1 block w-full border rounded-md p-2" placeholder="john@example.com" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Message</label>
          <textarea className="mt-1 block w-full border rounded-md p-2" rows={4} placeholder="How can we help?"></textarea>
        </div>
        <button className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700">
          Send Message
        </button>
      </form>
    </div>
  );
}
`,
  'portfolio': `
import React from 'react';

export default function Portfolio() {
  const projects = [
    { title: 'Project One', category: 'Web Design' },
    { title: 'Project Two', category: 'Mobile App' },
    { title: 'Project Three', category: 'Branding' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <h1 className="text-4xl font-bold text-center mb-12 italic">My Creative Portfolio</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {projects.map((p, i) => (
          <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
            <div className="aspect-video bg-gray-200" />
            <div className="p-4">
              <h3 className="font-bold">{p.title}</h3>
              <p className="text-sm text-gray-500">{p.category}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
`
}

export async function mockGenerateCode(prompt: string): Promise<string> {
  // Artificial delay to simulate AI thinking
  await new Promise(r => setTimeout(r, 1500))

  const lowerPrompt = prompt.toLowerCase()
  
  // Simple matching logic
  for (const [key, code] of Object.entries(PRESET_RESPONSES)) {
    if (lowerPrompt.includes(key)) return code.trim()
  }

  // Default fallback if no match
  return `
import React from 'react';

export default function GeneratedComponent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-4">AI Generated Component</h1>
      <p className="text-slate-400 mb-8 text-center max-w-lg">
        This is a response for your prompt: "${prompt}"
      </p>
      <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl">
        <p className="text-emerald-400 font-mono">Code generation complete.</p>
      </div>
    </div>
  );
}
`.trim()
}

export async function mockGenerateImage(prompt: string): Promise<string> {
  // Artificial delay to simulate AI thinking
  await new Promise(r => setTimeout(r, 2000))

  // Return a high-quality placeholder image based on the prompt
  const seed = Math.floor(Math.random() * 1000)
  return `https://images.unsplash.com/photo-1707343843437-caacff5cfa74?q=80&w=1000&auto=format&fit=crop&sig=${seed}`
}
