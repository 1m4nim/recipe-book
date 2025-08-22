import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RecipeSearch from './components/RecipeSearch.jsx';
import RecipeDetail from './components/RecipeDetail.jsx';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<RecipeSearch />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;