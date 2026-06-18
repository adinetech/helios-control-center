import * as React from "react"
import { LayoutDashboard, Factory, AlertTriangle, Activity, Sun } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "../ui/button"
import { useFarms } from "../../hooks/useApi"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command"

export function CommandMenu() {
  const [open, setOpen] = React.useState(false)
  const navigate = useNavigate()
  const { data: farms } = useFarms()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-full justify-start rounded-[0.5rem] bg-muted/50 text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <span className="hidden lg:inline-flex">Search command...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            <CommandItem onSelect={() => runCommand(() => navigate("/"))}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate("/farms"))}>
              <Factory className="mr-2 h-4 w-4" />
              <span>Solar Farms</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate("/alerts"))}>
              <AlertTriangle className="mr-2 h-4 w-4" />
              <span>Alerts</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate("/status"))}>
              <Activity className="mr-2 h-4 w-4" />
              <span>System Status</span>
            </CommandItem>
          </CommandGroup>
          {farms && farms.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Installations">
                {farms.map((farm: any) => (
                  <CommandItem
                    key={farm.id}
                    value={`${farm.name} ${farm.location}`}
                    onSelect={() => runCommand(() => navigate(`/farms/${farm.id}`))}
                  >
                    <Sun className="mr-2 h-4 w-4 text-yellow-500" />
                    <span>{farm.name}</span>
                    <span className="ml-2 text-xs text-muted-foreground">{farm.location}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}
