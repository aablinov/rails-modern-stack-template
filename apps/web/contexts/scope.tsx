import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { CookieValueTypes, setCookie } from 'cookies-next'

import  { LAST_PROJECT_ID_COOKIE_NAME } from '@/lib/cookieNames'
import {useParams} from "next/navigation";

interface State {
  scope: CookieValueTypes | undefined
  setScope: (scope: CookieValueTypes) => void
}
interface ScopeProviderProps {
  children: React.ReactNode
}

const ScopeContext = createContext<State | undefined>(undefined)

function setScopeCookies(scope: CookieValueTypes) {
  if (!scope) return

  setCookie(LAST_PROJECT_ID_COOKIE_NAME, scope, {
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production' ? true : false,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365) // 1 year
  })
}

function ScopeProvider({ children }: ScopeProviderProps) {
  const {project} = useParams<{project: string}>();
  // const project = router.query.project as string
  const [scope, setScope] = useState<CookieValueTypes>(project)

  useEffect(() => {
    if (typeof project === 'string') {
      setScopeCookies(project)
      setScope(project)
    }
  }, [project, project])

  const handleSetScope = useCallback((slug: CookieValueTypes) => {
    setScopeCookies(slug)
    setScope(slug)
  }, [])

  const activeScope = project || scope
  const value = useMemo(() => ({ setScope: handleSetScope, scope: activeScope }), [activeScope, handleSetScope])

  return <ScopeContext.Provider value={value}>{children}</ScopeContext.Provider>
}

function useScope() {
  const context = useContext(ScopeContext)

  if (context === undefined) {
    throw new Error('useScope must be used within a ScopeProvider')
  }

  return context
}

export { ScopeProvider, useScope }