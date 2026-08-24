import { useEffect, useState } from 'react'
import { CurriculumHome } from './components/CurriculumHome'
import { ArraysModule } from './modules/arrays/ArraysModule'
import { StringsModule } from './modules/strings/StringsModule'
import { HashMapsSetsModule } from './modules/hash-maps-sets/HashMapsSetsModule'
import { TwoPointersModule } from './modules/two-pointers/TwoPointersModule'
import { SystemDesignModule } from './modules/system-design/SystemDesignModule'
import { getSystemDesignModule } from './modules/system-design/content'

function currentRoute() {
  const hash = window.location.hash || '#/'
  const match = hash.match(/^#\/modules\/([^/?#]+)/)
  return match ? { kind: 'module' as const, moduleId: match[1] } : { kind: 'home' as const }
}

export default function App() {
  const [route, setRoute] = useState(currentRoute)

  useEffect(() => {
    const onHashChange = () => {
      setRoute(currentRoute())
      window.scrollTo({ top: 0 })
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  if (route.kind === 'module') {
    if (route.moduleId === 'arrays') return <ArraysModule />
    if (route.moduleId === 'strings') return <StringsModule />
    if (route.moduleId === 'hash-maps-sets') return <HashMapsSetsModule />
    if (route.moduleId === 'two-pointers') return <TwoPointersModule />

    const systemDesignConfig = getSystemDesignModule(route.moduleId)
    if (systemDesignConfig) return <SystemDesignModule config={systemDesignConfig} />
  }

  return <CurriculumHome />
}
