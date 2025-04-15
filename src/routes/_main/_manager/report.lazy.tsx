import Report from '@/pages/manager/report'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_main/_manager/report')({
    component: () => <Report />
})
