import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { removeTodo } from '../features/todoSlice';

function Todos() {

  const todos=useSelector(state=>state.todos)
  const dispatch=useDispatch();

  return (
    <>
      <ul className=' h-auto w-2/3 flex flex-col gap-1'>
      {
        todos.map((todo)=>(
          <div>
            <li className='h-12 w-full bg-orange-200 rounded-l-full rounded-r-full p-3 flex items-center justify-between ' key={todo.id}>
              <p className='text-lg'>{todo.text}</p>
              <button onClick={()=>dispatch(removeTodo(todo.id))}
                className='text-3xl font-bold text-red-600'  
              >X</button>
            </li>
          </div>
        ))
      }
      </ul>
    </>
  )
}

export default Todos