import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addTodo } from '../features/todoSlice'

function AddTodos() {

  const [txt,setTxt]=useState('')
  const dispatch=useDispatch()

  return (
    <>
      <div className='h-12 w-1/2 flex'>
        <input type="text" value={txt} placeholder='Write Your Task' className='h-12 w-4/5 bg-gray-200 text-xl rounded-l-full pl-5'
        onChange={(e)=>setTxt(e.target.value)}
        />
        <button className='h-12 w-1/5 bg-green-500 rounded-r-full' 
        onClick={(e)=>{
          e.preventDefault()
          if(txt!=='')
            dispatch(addTodo(txt))
          setTxt('')
        }}
        >Add</button>
      </div>
    </>
  )
}

export default AddTodos