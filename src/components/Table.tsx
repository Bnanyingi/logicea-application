import React, { useEffect, useState } from "react";
import "./Table.css";
import FilterSorting from "./FilterSorting";
import Form from "./Form";
import axios from "axios";
// import NewForm from "./NewForm";
import { useNavigate } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";
import { format } from "date-fns";
import Cookies from "js-cookie";
import Logout from "./Logout";
import Login from "./Login";

export interface Joke {
  id?: number;
  Title: string;
  Body: string;
  Author: string;
  Views: number;
  CreatedAt: number;
}

const Table: React.FC = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token") || null);
  const [jokes, setJokes] = useState<Joke[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [filterBy, setFilterBy] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [selectedJoke, setSelectedJoke] = useState<Joke | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  const handleAddNewJoke = () => {
    setSelectedJoke(null);
    setShowForm(true);
    // navigate("/form");
  };

  const handleFormSubmit = async (updatedJoke: Joke) => {
    try {
      const response = await axios.put(
        `https://retoolapi.dev/zu9TVE/jokes/${updatedJoke.id}`,
        updatedJoke
      );
      const updatedJokes = jokes.map((joke) =>
        joke.id === updatedJoke.id ? response.data : joke
      );
      setJokes(updatedJokes);
      setSelectedJoke(null);
      setShowForm(false);
    } catch (error) {
      console.error("Error updating joke:", error);
    }
  };

  const handleEdit = (joke: Joke) => {
    setSelectedJoke(joke);
    setShowForm(true);
    // navigate("/form");
  };

  const handleAddJoke = async (newJoke: Joke) => {
    try {
      const response = await axios.post(
        "https://retoolapi.dev/zu9TVE/jokes",
        newJoke
      );
      const addedJoke = response.data;
      const updatedJokes = [...jokes, addedJoke];
      setJokes(updatedJokes);
      setShowForm(false);
    } catch (error) {
      console.error("Error adding joke:", error);
    }
  };

  const handleFormClose = () => {
    setSelectedJoke(null);
    setShowForm(false);
  };

  const handleFormDelete = async () => {
    try {
      if (selectedJoke) {
        await axios.delete(
          `https://retoolapi.dev/zu9TVE/jokes/${selectedJoke.id}`
        );
        const updatedJokes = jokes.filter(
          (joke) => joke.id !== selectedJoke.id
        );
        setJokes(updatedJokes);
        setSelectedJoke(null);
        setShowForm(false);
      }
    } catch (error) {
      console.error("Error deleting joke:", error);
    }
  };

  const handleFilterSort = (filterBy: string, sortBy: string) => {
    setFilterBy(filterBy);
    setSortBy(sortBy);
  };

  const fetchJokes = async () => {
    try {
      let apiUrl = `https://retoolapi.dev/zu9TVE/jokes?_page=${currentPage}&_limit=${itemsPerPage}`;

      if (filterBy) {
        switch (filterBy) {
          case "lessThan50":
            apiUrl += "&Views_lte=50";
            break;
          case "between50And100":
            apiUrl += "&Views_gte=50&Views_lte=100";
            break;
          case "moreThan100":
            apiUrl += "&Views_gte=100";
            break;
          default:
            break;
        }
      }

      if (sortBy) {
        apiUrl += `&_sort=Views&_order=${sortBy === "asc" ? "asc" : "desc"}`;
      }

      const response = await fetch(apiUrl);
      const data = await response.json();
      setJokes(data);
      setTotalItems(parseInt(response.headers.get("X-Total-Count") || "0", 10));
    } catch (error) {
      console.error("Error fetching jokes:", error);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
  
    if (storedToken || storedUsername) {
      const newToken = storedToken || storedUsername;
      setToken(newToken);
      
      if (newToken !== null) {
        localStorage.setItem("token", newToken);
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    fetchJokes();
  }, [currentPage, itemsPerPage, filterBy, sortBy]);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleNextPage = () => {
    const maxPage = Math.ceil(totalItems / itemsPerPage);
    if (currentPage < maxPage) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handleItemsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setItemsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };

  const getViewsColor = (views: number): string => {
    if (views >= 0 && views <= 25) {
      return "tomato";
    } else if (views >= 26 && views <= 50) {
      return "orange";
    } else if (views >= 51 && views <= 75) {
      return "yellow";
    } else if (views >= 76 && views <= 100) {
      return "green";
    } else {
      return "inherit";
    }
  };

  const handleDarkModeToggle = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <div>
    {token ? (
    <div>
      <FilterSorting onFilterSort={handleFilterSort} />
      <DarkModeToggle
        isDarkMode={isDarkMode}
        onDarkModeToggle={handleDarkModeToggle}
      />
      <div className="New-Joke"></div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Created Date</th>
              <th>Views</th>
            </tr>
          </thead>
          <tbody>
            {jokes.map((joke) => (
              <tr key={joke.id}>
                <td>
                  <a className="link-form" onClick={() => handleEdit(joke)}>
                    {joke.Title}
                  </a>
                </td>
                <td>{joke.Author}</td>
                <td>{format(new Date(joke.CreatedAt), "dd MMM yyyy")}</td>
                <td style={{ color: getViewsColor(joke.Views) }}>
                  {joke.Views}
                </td>
                {/* <td>
                  <button onClick={() => handleEdit(joke)}>Edit</button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>

        <button className="new-button" onClick={handleAddNewJoke}>
          Add New Joke
        </button>

        {showForm ? (
          selectedJoke ? (
            <Form
              joke={selectedJoke}
              onSubmit={handleFormSubmit}
              onClose={handleFormClose}
              onDelete={handleFormDelete}
            />
          ) : (
            <Form onSubmit={handleAddJoke} onClose={handleFormClose} />
          )
        ) : null}
        <div className="pagination-container">
          <button onClick={handlePrevPage} disabled={currentPage === 1}>
            {"<"}
          </button>
          <span>Page {currentPage}</span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === Math.ceil(totalItems / itemsPerPage)}
          >
            {">"}
          </button>
        </div>
        <div className="items-per-page-container">
          <label htmlFor="itemsPerPage">Items per page:</label>
          <select
            className="selection-page"
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
          >
            <option value="5">5</option>
            <option value="10">10</option>
          </select>
        </div>
      </div>
      <Logout />
    </div>
     ) : (
      <Login setToken={setToken} />
    )}
  </div>
  );
};

export default Table;
