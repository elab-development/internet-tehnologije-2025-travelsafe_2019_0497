import { Route, Routes } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import ProtectedRoute from './routes/ProtectedRoute'
import { ROLES } from './utils/constants'

// Javne stranice
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import PackagesPage from './pages/PackagesPage'
import NotFoundPage from './pages/NotFoundPage'

// Stranice klijenta
import ClientDashboard from './pages/client/ClientDashboard'
import MyTravelsPage from './pages/client/MyTravelsPage'
import NewTravelPage from './pages/client/NewTravelPage'
import MyPoliciesPage from './pages/client/MyPoliciesPage'
import PolicyDetailsPage from './pages/client/PolicyDetailsPage'

// Stranice agenta
import AgentDashboard from './pages/agent/AgentDashboard'
import AgentRequestsPage from './pages/agent/AgentRequestsPage'
import AgentPolicyDetailsPage from './pages/agent/AgentPolicyDetailsPage'

// Stranice administratora
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsersPage from './pages/admin/AdminUsersPage'
import AdminPackagesPage from './pages/admin/AdminPackagesPage'
import AdminPoliciesPage from './pages/admin/AdminPoliciesPage'

// Glavni raspored ruta aplikacije. Sve rute dele isti layout (navigacija + podnožje).
export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* ---------- Javne stranice ---------- */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/packages" element={<PackagesPage />} />

        {/* ---------- Stranice za CLIENT-a ---------- */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.CLIENT]} />}>
          <Route path="/client/dashboard" element={<ClientDashboard />} />
          <Route path="/my-travels" element={<MyTravelsPage />} />
          <Route path="/travels/new" element={<NewTravelPage />} />
          <Route path="/my-policies" element={<MyPoliciesPage />} />
          <Route path="/policies/:id" element={<PolicyDetailsPage />} />
        </Route>

        {/* ---------- Stranice za AGENT-a (i ADMIN-a) ---------- */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.AGENT, ROLES.ADMIN]} />}>
          <Route path="/agent/dashboard" element={<AgentDashboard />} />
          <Route path="/agent/requests" element={<AgentRequestsPage />} />
          <Route path="/agent/policies/:id" element={<AgentPolicyDetailsPage />} />
        </Route>

        {/* ---------- Stranice za ADMIN-a ---------- */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/packages" element={<AdminPackagesPage />} />
          <Route path="/admin/policies" element={<AdminPoliciesPage />} />
        </Route>

        {/* ---------- 404 ---------- */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
