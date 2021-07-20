import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

// import SignupPage from "./auth/pages/SignupPage";
// import LoginPage from "./auth/pages/LoginPage";
// import HomePage from "./home/pages/HomePage";
// import ProfilePage from "./profile/pages/ProfilePage";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import MainFooter from "./shared/components/Navigation/MainFooter";
import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";

const SignupPage = React.lazy(() => import("./auth/pages/SignupPage"));
const LoginPage = React.lazy(() => import("./auth/pages/LoginPage"));
const HomePage = React.lazy(() => import("./home/pages/HomePage"));
const ProfilePage = React.lazy(() => import("./profile/pages/ProfilePage"));

const MainTheme = createMuiTheme({
  palette: {
    primary: {
      main: "#e64a19",
    },
    secondary: {
      main: "#ffe082",
    },
  },
});

const App = () => {
  const { token, login, logout, userId } = useAuth();

  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <HomePage />
        </Route>
        <Route path="/profile" exact>
          <ProfilePage />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <HomePage />
        </Route>
        <Route path="/profile" exact>
          <ProfilePage />
        </Route>
        <Route path="/signup" exact>
          <SignupPage />
        </Route>
        <Route path="/login" exact>
          <LoginPage />
        </Route>
        <Redirect to="/signup" />
      </Switch>
    );
  }

  return (
    <ThemeProvider theme={MainTheme}>
      <AuthContext.Provider
        value={{
          isLoggedIn: !!token,
          token: token,
          userId: userId,
          login: login,
          logout: logout,
        }}
      >
        <Router>
          <MainNavigation />
          <main>
            <Suspense fallback={<div className="center">Loading...</div>}>
              {routes}
            </Suspense>
          </main>
          <MainFooter />
        </Router>
      </AuthContext.Provider>
    </ThemeProvider>
  );
};

export default App;
