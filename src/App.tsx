import { useEffect, useState } from 'react'
import { CurriculumHome } from './components/CurriculumHome'
import { ArraysModule } from './modules/arrays/ArraysModule'

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
  }

  return <CurriculumHome />
}
