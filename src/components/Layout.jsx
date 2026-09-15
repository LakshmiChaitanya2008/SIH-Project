import { Outlet, useLocation } from 'react-router'
import { useEffect } from 'react'
import Header from './Header'
import Footer from './Footer'
import HelpHint from './HelpHint'
import IntroAnimation from './IntroAnimation'

const noHeaderFooterRoutes = ['/role-selection', '/citizen/access', '/university/access', '/auth']

export default function Layout() {
  const location = useLocation()
  const hideHeaderFooter = noHeaderFooterRoutes.includes(location.pathname)

  return (
    <div className="min-h-screen flex flex-col w-full bg-[#FAFAF8]">
      <IntroAnimation />
      {!hideHeaderFooter && <Header />}
      <div className="flex-grow flex flex-col w-full">
        <Outlet />
      </div>
      {!hideHeaderFooter && <Footer />}
      <HelpHint />
    </div>
  )
}
