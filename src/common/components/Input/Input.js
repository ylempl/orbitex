import React from 'react'

const Input = ({type = 'text', id, value, placeholder, handleChange, name, noValidate, invalid, checked}) => {
  let isInvalid = invalid && 'is-invalid'
  let className = type === 'radio' ? 'form-check-input' : 'form-control'

  return (
      <input
        className={`${className} ${isInvalid}`}
        name={name}
        type={type}
        id={id}
        placeholder={placeholder}
        onChange={(e) => handleChange(e)}
        noValidate={noValidate}
        value={value}
        defaultChecked={checked}
      />

  )
}

export default Input