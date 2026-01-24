import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import CommandsBuilderPage from './pages/CommandsBuilderPage'
import EventsBuilderPage from './pages/EventsBuilderPage'
import ModulesBuilderPage from './pages/ModulesBuilderPage'
import CommandsListPage from './pages/CommandsListPage'
import EventsListPage from './pages/EventsListPage'
import ModulesListPage from './pages/ModulesListPage'
import MarketplacePage from './pages/MarketplacePage'
import TermsOfServicePage from './pages/TermsOfServicePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        {/* Lists */}
        <Route path="/commands" element={<CommandsListPage />} />
        <Route path="/events" element={<EventsListPage />} />
        <Route path="/modules" element={<ModulesListPage />} />
        
        {/* Builders */}
        <Route path="/builder/commands/:id" element={<CommandsBuilderPage />} />
        <Route path="/builder/events/:id" element={<EventsBuilderPage />} />
        <Route path="/builder/modules/:id" element={<ModulesBuilderPage />} />
        
        {/* Fallback routes for creating new items if ID is missing */}
        <Route path="/builder/commands" element={<Navigate to="/commands" replace />} />
        <Route path="/builder/events" element={<Navigate to="/events" replace />} />
        <Route path="/builder/modules" element={<Navigate to="/modules" replace />} />

        {/* Marketplace & Legal */}
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/terms" element={<TermsOfServicePage />} />
        
        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
