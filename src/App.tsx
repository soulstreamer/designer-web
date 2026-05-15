import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import Login from './pages/Login'
import Board from './pages/Board'
import Dashboard from './pages/Dashboard'
import NotFound from './pages/NotFound'
import OptimizareSEO from './pages/OptimizareSEO'
import Mentenanta from './pages/Mentenanta'
import FAQ from './pages/FAQ'
import PoliticaConfidentialitate from './pages/PoliticaConfidentialitate'
import TermeniConditii from './pages/TermeniConditii'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/board" element={<Board />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/optimizare-seo" element={<OptimizareSEO />} />
      <Route path="/mentenanta" element={<Mentenanta />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/politica-de-confidentialitate" element={<PoliticaConfidentialitate />} />
      <Route path="/termeni-si-conditii" element={<TermeniConditii />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
