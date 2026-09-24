
import CustomerLayout from '@/app/components/layout/Layout';
import {ReactNode} from 'react'
export default function Layout({ children }:{children:ReactNode}) {
  return <CustomerLayout>{children}</CustomerLayout>;
}