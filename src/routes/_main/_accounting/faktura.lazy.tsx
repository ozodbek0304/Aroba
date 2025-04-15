import CheckTransfer from '@/pages/accounting/check-transfer'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_main/_accounting/faktura')({
  component: () => <CheckTransfer />,
})
