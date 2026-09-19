import { Routes, Route } from 'react-router-dom'
import Pokemon from './components/Pokemon'
import Home from './components/Home'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/pokemon" element={<Pokemon />} />
    </Routes>
  )
}
