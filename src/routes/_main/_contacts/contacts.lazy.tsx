import Contacts from '@/pages/contacts'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_main/_contacts/contacts')({
  component: () => <Contacts />
})
