import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VideoPlayer from "./pages/VideoPlayer";
import Channel from "./pages/Channel";
import CreateChannel from "./pages/CreateChannel";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Header />

      <div className="app-layout">
        <Sidebar />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/login" element={<Login />} />

            <Route path="/register" element={<Register />} />

            <Route
              path="/video/:id"
              element={<VideoPlayer />}
            />

            <Route
              path="/channel/:id"
              element={<Channel />}
            />

            <Route
              path="/create-channel"
              element={<CreateChannel />}
            />

            <Route
              path="*"
              element={<NotFound />}
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;