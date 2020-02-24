import React from 'react'

const Button = ({type = 'button', label, color, marginBottom, icon, id, handleClick, disabled}) => {
  let colorClass = color ? ` btn-${color}` : ''
  let marginBottomClass = marginBottom ? ` ${marginBottom}` : ''

  return (
    <button data-testid='button' type={type} className={`btn${colorClass}${marginBottomClass}`} onClick={handleClick && ((e) => handleClick(e, id))} disabled={disabled} >
      {icon && (
        <i className={`fa fa-${icon}`} aria-hidden="true" />
      )}
      {label}
    </button>
  )
}

export default Button