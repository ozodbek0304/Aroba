import ControlUsers from '@/pages/admin/control-users'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_main/_admin/control-users')({
    component: () => <ControlUsers />
})
