import {Provider} from 'react-redux'
import AddTodos from './components/AddTodos'
import Todos from './components/Todos'
import { store } from './app/store'


function App() {
  return (
    <Provider store={store}>
      <div className='min-h-screen w-full bg-gray-400 flex flex-col items-center gap-10 p-10'>
        <p className='text-5xl text-blue-700 font-serif font-bold shadow-2xl shadow-black p-3 h rounded-3xl'>Todo Application</p>
        <AddTodos/>
        <Todos/>
      </div>
    </Provider>
  )
}

export default App
