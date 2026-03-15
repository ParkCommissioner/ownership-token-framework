import { Outlet, createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/value-accrual")({
  component: () => <Outlet />,
})
