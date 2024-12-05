import {
  createContext,
  useContext,
  useState,
  useEffect,
  useReducer,
  useCallback,
} from "react";
const BASE_URL = "/api/cities";
// const BASE_URL = "http://localhost:8000";
const CitiesContext = createContext();
const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};
function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return { ...state, isLoading: false, cities: action.payload };
    case "city/loaded":
      return { ...state, isLoading: false, currentCity: action.payload };
    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };
    case "rejected":
      return { ...state, isLoading: false, error: action.payload };
    default:
      throw new Error("Unknown action type");
  }
}
function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );
  // const [cities, setCities] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [currentCity, setCurrentCity] = useState({});
  useEffect(() => {
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        //setCities(data)
        dispatch({ type: "cities/loaded", payload: data });
      } catch (err) {
        console.log(err);
        // alert("There was an error loading data...");
        dispatch({
          type: "rejected",
          paylod: "There was an error loading cities...",
        });
      }
      // finally {
      //   setIsLoading(false);
      // }
    }
    fetchCities();
  }, []);
  const getCity = useCallback(
    async function getCity(id) {
      if (Number(id) === currentCity.id) return;
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${BASE_URL}/cities/${id}`);
        const data = await res.json();
        // setCurrentCity(data);
        dispatch({ type: "city/loaded", payload: data });
      } catch (err) {
        console.log(err);
        // alert("There was an error loading data...");
        dispatch({
          type: "rejected",
          paylod: "There was an error loading the city...",
        });
      }
      // finally {
      //   setIsLoading(false);
      // }
    },
    [currentCity.id]
  );
  async function createCity(newCity) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      // console.log(data);
      // setCities((cities) => [...cities, data]);
      dispatch({ type: "city/created", payload: data });
    } catch (err) {
      console.log(err);
      // alert("There was an error creating the city");
      dispatch({
        type: "rejected",
        paylod: "There was an error creating city...",
      });
    }
    // finally {
    //   setIsLoading(false);
    // }
  }
  async function deleteCity(id) {
    dispatch({ type: "loading" });
    try {
      await fetch(`${BASE_URL}/cities/${id}`, { method: "DELETE" });
      // setCities((cities) => cities.filter((city) => city.id !== id));
      dispatch({ type: "city/deleted", payload: id });
    } catch (err) {
      console.log(err);
      // alert("There was an error deleting the city");
      dispatch({
        type: "rejected",
        paylod: "There was an error deleting the city...",
      });
    }
    // finally {
    //   setIsLoading(false);
    // }
  }
  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        error,
        getCity,
        createCity,
        deleteCity,
      }}>
      {children}
    </CitiesContext.Provider>
  );
}
function useCities() {
  const globalValues = useContext(CitiesContext);
  if (globalValues === undefined)
    throw new Error("useCities() was used outside fo the CitiesProvider");
  return globalValues;
}
export { CitiesProvider, useCities };
