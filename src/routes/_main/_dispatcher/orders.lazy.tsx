import Orders from '@/pages/dispatcher/orders'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_main/_dispatcher/orders')({
  component: () => <Orders />,
})
