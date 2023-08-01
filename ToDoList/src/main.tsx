import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import {Box, ChakraProvider} from "@chakra-ui/react";
import {BrowserRouter} from "react-router-dom";
import {CookiesProvider} from "react-cookie";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider>
      <BrowserRouter>
        <CookiesProvider>
          <Box
            className="background"
            style={{
              background: "linear-gradient(45deg, #141e30, #243b55)",
              minHeight: "100vh"
            }}>
            <App />
          </Box>
        </CookiesProvider>
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
);
