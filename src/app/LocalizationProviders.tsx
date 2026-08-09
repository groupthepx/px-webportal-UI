'use client'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'

export default function LocalizationProviders({
  children
}: {
  children: React.ReactNode
}) {

  return <LocalizationProvider dateAdapter={AdapterDayjs}>
    {children}
  </LocalizationProvider>
}