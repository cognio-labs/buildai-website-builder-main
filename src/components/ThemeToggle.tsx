import { Button, useBlinkUI } from '@blinkdotnew/ui'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
  const { darkMode, setDarkMode } = useBlinkUI()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setDarkMode(darkMode === 'dark' ? 'light' : 'dark')}
    >
      {darkMode === 'dark' ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </Button>
  )
}
