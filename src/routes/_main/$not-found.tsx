import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main/$not-found')({
  component: () => <NotFound />
})

const NotFound = () => {
  return (
    <div>
    </div>
  )
}
