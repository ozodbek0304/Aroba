import Contract from '@/pages/accounting/contract'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_main/_accounting/contract')({
  component: () => <Contract />,
})
