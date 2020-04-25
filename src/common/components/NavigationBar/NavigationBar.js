import React from 'react'

import HamburgerMenu from '../HamburgerMenu/HamburgerMenu'
import Logo from '../Logo/Logo'

const NavigationBar = ({label}) => {
  return (
    <nav className="navbar navbar-expand-sm navbar-dark">
      <Logo path="/" label={label} />
      <HamburgerMenu />
    </nav>
  )
}
export default NavigationBar