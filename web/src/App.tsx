import { Route, Routes } from '@solidjs/router';
import { useUser } from './api/user';
import Header from './components/header';
import Home from './pages/Home';
import Room from './pages/Room';
import Who from './pages/Who';

function App() {
  const user = useUser();

  return (
    <div class="container mx-auto">
      <Header />
      {user.user() ? (
        <Routes>
          <Route path="/user" component={Who} />
          <Route path="/:room" component={Room} />
          <Route path="/" component={Home} />
        </Routes>
      ) : (
        <Who />
      )}
    </div>
  );
}

export default App;
