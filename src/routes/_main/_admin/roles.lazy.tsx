import Roles from '@/pages/admin/roles'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_main/_admin/roles')({
    component: () => <Roles />
})
