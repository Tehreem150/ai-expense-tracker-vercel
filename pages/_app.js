import { Provider, useDispatch } from "react-redux";
import { useEffect } from "react";
import { store } from "../src/redux/store"; // ✅ named import
import { checkAuth } from "../src/redux/authSlice";
import Layout from "../src/components/Layout";
import "../styles/globals.css";

// ✅ Safe AuthProvider
function AuthProvider({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    // runs only on client
    if (typeof window !== "undefined") {
      dispatch(checkAuth());
    }
  }, [dispatch]);

  return children;
}

export default function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AuthProvider>
    </Provider>
  );
}
