import { Route, Routes } from '@solidjs/router';
import Home from './pages/Home';
import Room from './pages/Room';

function App() {

  return (
    <div class="container mx-auto">
      <Routes>
        <Route path="/*" component={Room} />
        <Route path="/" component={Home} />
      </Routes>
    </div>
  )
}

export default App
