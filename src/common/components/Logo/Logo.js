import React from 'react'
import { Link } from 'react-router-dom'

const Logo = ({path, label}) => {
  return (
    <Link to={path} className="navbar-brand">
      {label}
    </Link>
  )
}
export default Logo