import { Routes, Route, NavLink } from 'react-router-dom'
import Pokemon from './components/Pokemon'
import Home from './components/Home'

export default function App() {
  return (
    <>
      <nav className="navbar ">
        <div className="container">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/pokemon">Pokémon</NavLink>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pokemon" element={<Pokemon />} />
      </Routes>
    </>
  )
}
