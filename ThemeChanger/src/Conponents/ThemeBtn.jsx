import React from 'react'
import { useTheme } from '../Context/themeContext'

function ThemeBtn() {

  const{theme,toggleTheme}=useTheme()

  return (
    <button className='h-8 w-40 bg-slate-300 rounded-3xl' onClick={toggleTheme}>{theme.toUpperCase()} Mode</button>
  )
}

export default ThemeBtn