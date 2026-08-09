'use client'

import { SnackbarProvider } from 'notistack'




export default function SnackbarProviders({
  children
}: {
  children: React.ReactNode
}) {
 
  return    <SnackbarProvider
  maxSnack={6}
  anchorOrigin={{
    vertical: 'bottom',
    horizontal: 'right'
  }}
> {children}</SnackbarProvider>
}