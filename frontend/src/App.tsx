import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import UniversalBuilderPage from './pages/UniversalBuilderPage'
import CommandsListPage from './pages/CommandsListPage'
import EventsListPage from './pages/EventsListPage'
import ModulesListPage from './pages/ModulesListPage'
import MarketplacePage from './pages/MarketplacePage'
import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DocsPage from './pages/DocsPage'
import TermsOfServicePage from './pages/TermsOfServicePage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import AutoModPage from './pages/AutoModPage'
import ChangelogPage from './pages/ChangelogPage'

import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { CommandPalette } from '@/components/layout/CommandPalette'

import { AnimatePresence, motion } from 'framer-motion'

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="h-full"
    >
      {children}
    </motion.div>
  )
}

function App() {
  const location = useLocation()

  return (
    <ThemeProvider defaultTheme="light" storageKey="botify-theme">
      <CommandPalette />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageWrapper>
                <LandingPage />
              </PageWrapper>
            }
          />
          <Route
            path="/login"
            element={
              <PageWrapper>
                <LoginPage />
              </PageWrapper>
            }
          />
          <Route
            path="/signup"
            element={
              <PageWrapper>
                <SignupPage />
              </PageWrapper>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PageWrapper>
                <DashboardPage />
              </PageWrapper>
            }
          />

          <Route
            path="/commands"
            element={
              <PageWrapper>
                <CommandsListPage />
              </PageWrapper>
            }
          />
          <Route
            path="/events"
            element={
              <PageWrapper>
                <EventsListPage />
              </PageWrapper>
            }
          />
          <Route
            path="/modules"
            element={
              <PageWrapper>
                <ModulesListPage />
              </PageWrapper>
            }
          />

          <Route path="/builder/commands/:id" element={<UniversalBuilderPage />} />
          <Route path="/builder/events/:id" element={<UniversalBuilderPage />} />
          <Route path="/builder/modules/:id" element={<UniversalBuilderPage />} />

          <Route
            path="/marketplace"
            element={
              <PageWrapper>
                <MarketplacePage />
              </PageWrapper>
            }
          />

          <Route
            path="/docs"
            element={
              <PageWrapper>
                <DocsPage />
              </PageWrapper>
            }
          />
          <Route
            path="/terms"
            element={
              <PageWrapper>
                <TermsOfServicePage />
              </PageWrapper>
            }
          />
          <Route
            path="/privacy"
            element={
              <PageWrapper>
                <PrivacyPolicyPage />
              </PageWrapper>
            }
          />

          <Route
            path="/changelog"
            element={
              <PageWrapper>
                <ChangelogPage />
              </PageWrapper>
            }
          />

          <Route
            path="/automod"
            element={
              <PageWrapper>
                <AutoModPage />
              </PageWrapper>
            }
          />

          <Route path="/builder" element={<Navigate to="/commands" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </ThemeProvider>
  )
}

export default App
