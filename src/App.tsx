import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TodoApp from './components/TodoApp';
import AnalyticsDashboard from './components/AnalyticsDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TodoApp />} />
        <Route path="/analytics" element={<AnalyticsDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
