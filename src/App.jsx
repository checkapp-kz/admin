import Reviews from './components/Reviews';

function App() {
  return (
    <Router>
      <Routes>
        {/* существующие маршруты... */}
        <Route path="/reviews" element={<Reviews />} />
      </Routes>
    </Router>
  );
} 