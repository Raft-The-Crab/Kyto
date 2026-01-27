import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import CommandsListPage from './pages/CommandsListPage'
import EventsListPage from './pages/EventsListPage'
import ModulesListPage from './pages/ModulesListPage'
import MarketplacePage from './pages/MarketplacePage'
import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DocsPage from './pages/DocsPage'
import TermsOfService from './pages/TermsOfServicePage'
import PrivacyPolicy from './pages/PrivacyPolicyPage'
import AutoModPage from './pages/AutoModPage'
import ChangelogPage from './pages/ChangelogPage'
import CommandBuilderPage from './pages/CommandBuilderPage'
import EventBuilderPage from './pages/EventBuilderPage'
import ModuleBuilderPage from './pages/ModuleBuilderPage'
import { StatusPage } from './pages/StatusPage'
import { DocumentationPage } from './pages/DocumentationPage'
import { IntegrationsPage } from './pages/IntegrationsPage'

import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { CommandPalette } from '@/components/layout/CommandPalette'

import { AnimatePresence, motion } from 'framer-motion'

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="h-full"
    >
      {children}
    </motion.div>
  )
}

function App() {
  const location = useLocation()

  return (
    <ThemeProvider defaultTheme="dark" storageKey="kyto-theme">
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

          {/* Builder Routes - Dedicated Pages */}
          <Route
            path="/command/:id"
            element={
              <PageWrapper>
                <CommandBuilderPage />
              </PageWrapper>
            }
          />
          <Route
            path="/event/:id"
            element={
              <PageWrapper>
                <EventBuilderPage />
              </PageWrapper>
            }
          />
          <Route
            path="/module/:id"
            element={
              <PageWrapper>
                <ModuleBuilderPage />
              </PageWrapper>
            }
          />
          <Route
            path="/builder/commands/:id"
            element={
              <PageWrapper>
                <CommandBuilderPage />
              </PageWrapper>
            }
          />
          <Route
            path="/builder/events/:id"
            element={
              <PageWrapper>
                <EventBuilderPage />
              </PageWrapper>
            }
          />
          <Route
            path="/builder/modules/:id"
            element={
              <PageWrapper>
                <ModuleBuilderPage />
              </PageWrapper>
            }
          />

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
                <TermsOfService />
              </PageWrapper>
            }
          />
          <Route
            path="/privacy"
            element={
              <PageWrapper>
                <PrivacyPolicy />
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
          <Route
            path="/status"
            element={
              <PageWrapper>
                <StatusPage />
              </PageWrapper>
            }
          />
          <Route
            path="/documentation"
            element={
              <PageWrapper>
                <DocumentationPage />
              </PageWrapper>
            }
          />
          <Route
            path="/integrations"
            element={
              <PageWrapper>
                <IntegrationsPage />
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
