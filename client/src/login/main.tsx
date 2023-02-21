import 'modern-normalize/modern-normalize.css';
import './main.css';
import { createRoot } from 'react-dom/client';

createRoot(document.getElementById('root')!)
  .render(<>
    <h1>Login</h1>
    <input placeholder="" />
    <input type="submit"
           value="Se connecter" />
  </>);
