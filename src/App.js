import "./App.css";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "./context/authContext";

function App() {
  const [auth, setAuth] = useContext(AuthContext);
  useEffect(() => {
    const token = localStorage.getItem("auth");
    if (!auth && token) {
      setAuth(token);
    }
  }, []);
  return (
    <div className="App">
      <Router>
        <Switch>
          {!auth ? (
            <Route path="/">
              <Login />
            </Route>
          ) : (
            <Route path="/main">
              <Dashboard />
            </Route>
          )}
        </Switch>
      </Router>
    </div>
  );
}

export default App;
