import { Routes, Route } from "react-router-dom";
import { Feature } from "./Components/Feature";
import { Header } from "./Components/Header";
import { Home } from "./Components/Home";
import { Footer } from "./Components/Footer";
import { LoginPage } from "./Pages/LoginPage";
import { Profile } from "./Pages/Profile";
import { Todo } from "./Pages/Todopage";
import GoogleCallback from "./Context/Googleaut";

const App = () => {
  return (
    <>
  

      <Routes>
        <Route
          path="/"
          element={
            <>
                <Header />
              <Home />
              <Feature />
              <Footer />
            </>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<Profile />}/>
        <Route path="/todos" element={<Todo />}/>
             <Route path="/google/callback" element={<GoogleCallback />} />
      </Routes>
    </>
  );
};

export default App;
