import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router'
import { LandingPage } from './pages/LandingPage'
import { DashboardPage } from './pages/DashboardPage'
import { BuilderPage } from './pages/BuilderPage'
import { PreviewPage } from './pages/PreviewPage'
import { BillingPage } from './pages/BillingPage'
import { AuthPage } from './pages/AuthPage'

const rootRoute = createRootRoute({
  component: () => <Outlet />,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
})

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: DashboardPage,
})

const builderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/builder/$projectId',
  component: BuilderPage,
})

const previewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/preview/$projectId',
  component: PreviewPage,
})

const billingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/billing',
  component: BillingPage,
})

const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth',
  component: AuthPage,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  builderRoute,
  previewRoute,
  billingRoute,
  authRoute,
])

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export default function App() {
  return <RouterProvider router={router} />
}
