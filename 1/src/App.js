import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.scss";
import CountryPage from "./pages/CountryPage";
import ErrorPage from "./pages/ErrorPage";
import Homepage from "./pages/Homepage";
import Header from "./components/Header";
import Footer from "./components/Footer";

localStorage.removeItem("region");
localStorage.removeItem("countries");

function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("https://restcountries.com/v2/all")
      .then((res) => res.json())
      .then((json) => {
        if (json.message) {
          throw new Error(json.message);
        } else {
          setData(json);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error(error);
        setError(true);
        setLoading(false);
      });
  }, []);

  return (
    <div className="app">
      <Header />
      {!loading ? (
        <Routes>
          <Route
            path="/"
            element={
              !error ? (
                data && <Homepage data={data} />
              ) : (
                <ErrorPage error={error} />
              )
            }
          />

          {data &&
            data.map((country) => {
              return (
                <Route
                  path={`/${country.alpha3Code}`}
                  key={country.alpha3Code}
                  element={<CountryPage country={country} data={data} />}
                />
              );
            })}
          <Route path="/:code" element={<ErrorPage error={error} />} />
        </Routes>
      ) : (
        <div className="loader-cont">
          <div className="loader-animation"></div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default App;
