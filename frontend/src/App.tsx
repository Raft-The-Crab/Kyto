import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import CommandsBuilderPage from './pages/CommandsBuilderPage'
import EventListenersPage from './pages/EventListenersPage'
import ModulesBuilderPage from './pages/ModulesBuilderPage'
import MarketplacePage from './pages/MarketplacePage'
import TermsOfServicePage from './pages/TermsOfServicePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/builder/commands" element={<CommandsBuilderPage />} />
        <Route path="/builder/events" element={<EventListenersPage />} />
        <Route path="/builder/modules" element={<ModulesBuilderPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/terms" element={<TermsOfServicePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
