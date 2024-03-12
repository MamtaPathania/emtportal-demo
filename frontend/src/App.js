import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import HomePage from './components/HomePage';
import SubscriptionPage from './components/SubscriptionPage';
import MainPage from './components/MainPage';
import SignUp from './components/SignUp'
import AccessLogs from './components/AccessLogs';
function App() {
  return (
    <div className="bg-black h-screen">
      <Router>
        <Routes>
          <Route index element={<SignUp/>}/>
          <Route path="/emt-service" element={<MainPage/>}/>
          <Route path="/emt-service/check-logs" element={<HomePage/>}/>
          <Route path="/emt-service/subscription" element={<SubscriptionPage/>}/>
          <Route path="/emt-service/access-logs" element={<AccessLogs/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
