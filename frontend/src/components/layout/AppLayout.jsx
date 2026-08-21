import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navigation from './Navigation'
import Footer from './Footer'
import { PageTransition } from '../ui/Motion'

export default function AppLayout() {
  const location = useLocation()

  return (
    <div className="flex min-h-screen flex-col bg-page">
      <Navigation />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}
