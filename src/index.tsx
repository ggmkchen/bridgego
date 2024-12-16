import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'  
import './index.css';
import App from './App';

// 確保 root 不為 null
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement); // 明確確認元素存在
  root.render(
    <Router >
        <App />
    </Router>
  );
} else {
  console.error("Failed to find the root element.");
}