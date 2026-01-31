import React from 'react'
import { Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import BuilderPage from './pages/BuilderPage'
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
import StatusPage from './pages/StatusPage'
import IntegrationsPage from './pages/IntegrationsPage'
import LicensePage from './pages/LicensePage'
import FeaturesPage from './pages/FeaturesPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import BlogPage from './pages/BlogPage'
import CareersPage from './pages/CareersPage'
import HostingPage from './pages/HostingPage'

import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { CommandPalette } from '@/components/layout/CommandPalette'

import { AnimatePresence, motion } from 'framer-motion'

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      {children}
    </motion.div>
  )
}

const ParameterizedRedirect = ({ to }: { to: string }) => {
  const params = useParams()
  return <Navigate to={to.replace(':id', params.id || '')} replace />
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
            path="/builder"
            element={
              <PageWrapper>
                <BuilderPage />
              </PageWrapper>
            }
          />
          <Route
            path="/builder/commands"
            element={<Navigate to="/builder?tab=commands" replace />}
          />
          <Route path="/builder/events" element={<Navigate to="/builder?tab=events" replace />} />
          <Route path="/builder/modules" element={<Navigate to="/builder?tab=modules" replace />} />

          <Route path="/commands" element={<Navigate to="/builder?tab=commands" replace />} />
          <Route path="/events" element={<Navigate to="/builder?tab=events" replace />} />
          <Route path="/modules" element={<Navigate to="/builder?tab=modules" replace />} />

          <Route
            path="/command/:id"
            element={<ParameterizedRedirect to="/builder/commands/:id" />}
          />
          <Route path="/event/:id" element={<ParameterizedRedirect to="/builder/events/:id" />} />
          <Route path="/module/:id" element={<ParameterizedRedirect to="/builder/modules/:id" />} />
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
            path="/tos"
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
            path="/hosting"
            element={
              <PageWrapper>
                <HostingPage />
              </PageWrapper>
            }
          />
          <Route path="/documentation" element={<Navigate to="/docs" replace />} />
          <Route
            path="/integrations"
            element={
              <PageWrapper>
                <IntegrationsPage />
              </PageWrapper>
            }
          />
          <Route
            path="/license"
            element={
              <PageWrapper>
                <LicensePage />
              </PageWrapper>
            }
          />
          <Route
            path="/features"
            element={
              <PageWrapper>
                <FeaturesPage />
              </PageWrapper>
            }
          />
          <Route
            path="/about"
            element={
              <PageWrapper>
                <AboutPage />
              </PageWrapper>
            }
          />
          <Route
            path="/contact"
            element={
              <PageWrapper>
                <ContactPage />
              </PageWrapper>
            }
          />
          <Route
            path="/blog"
            element={
              <PageWrapper>
                <BlogPage />
              </PageWrapper>
            }
          />
          <Route
            path="/careers"
            element={
              <PageWrapper>
                <CareersPage />
              </PageWrapper>
            }
          />
          <Route path="/pricing" element={<Navigate to="/license" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </ThemeProvider>
  )
}

export default App
