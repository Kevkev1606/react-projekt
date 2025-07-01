import './App.css'
import NavBar from './components/NavBar/NavBar.jsx'
import { Outlet } from 'react-router-dom'

function App() {
  return (
    <div className='App'>
      <NavBar />
      <div className='Content'>
        <Outlet />
      </div>
    </div>
  )
}

export default App
