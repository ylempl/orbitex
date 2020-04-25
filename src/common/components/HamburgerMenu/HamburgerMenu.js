import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'

const HamburgerMenu = () => {
  const [toggle, setToggle] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setToggle(!toggle)}
        className={classNames('navbar-toggler', {
          collapsed: !toggle
        })}
        aria-expanded={toggle}
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>
        <div
        className={classNames('collapse', 'navbar-collapse', {
          show: toggle
        })}
      >
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              Simulator
              <span className="sr-only">(current)</span>
            </Link>
          </li>
          <li>
              <Link to="/calc" className="nav-link">
                Calc
                <span className="sr-only"></span>
              </Link>
            </li>
        </ul>
      </div>
    </>
  )
}
export default HamburgerMenu