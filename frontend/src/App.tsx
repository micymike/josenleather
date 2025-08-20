import { useState } from 'react';
import {Routes, Route} from 'react-router-dom'

import './App.css'
import LandingPage from './components/shared/LandingPage'

function App() {

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
    </Routes>
  )
}

export default App
