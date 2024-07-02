import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Login from "./components/login/Login";
import Home from "./components/home/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const routes = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route index element={<Login />} />
        <Route path="home" element={<Home />} />
      </Route>
    )
  );
  return (
    <div className="App">
      <RouterProvider router={routes} />
      <ToastContainer autoClose={3000} />
    </div>
  );
}

export default App;
