import FillOrder from '@/pages/dispatcher/fill-order'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_main/_dispatcher/fill-order')({
  component: () => <FillOrder />,
})
