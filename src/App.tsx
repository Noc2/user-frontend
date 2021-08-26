import { useEffect, useState } from "react";
import {
  CssBaseline,
  ThemeProvider,
  Box,
  CircularProgress,
} from "@material-ui/core";

import Router from "./components/Router";
import AppBar from "./components/AppBar";
import theme from "./theme";
import DelmonicosService from "./services/Delmonicos";
import KeyringService from "./services/Keyring";
import UserContextProvider from "./components/UserContext";

const Loading = () => {
  return (
    <Box
      display="flex"
      height="100%"
      justifyContent="center"
      alignItems="center"
    >
      <CircularProgress size={90} />
    </Box>
  );
};

const App = () => {
  const [ isInitialized, setInitialized ] = useState(false);
  const [ initialUserState, setInitialUserState ] = useState({ hasPaymentConsent: false });
  useEffect(() => {
    DelmonicosService
      .connect()
      .then(() => KeyringService.init())
      .then(() => DelmonicosService.fundAccountIfRequired(KeyringService.address))
      .then(() => DelmonicosService.hasPaymentConsent(KeyringService.address).then((consent) => setInitialUserState({ hasPaymentConsent: consent })))
      .then(() => setInitialized(true));
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      { isInitialized === false && <Loading /> }
      { isInitialized && (
        <UserContextProvider initialState={initialUserState}>
          <Router>
            <AppBar />
          </Router>
        </UserContextProvider>
      )}
    </ThemeProvider>
  );
}

export default App;
