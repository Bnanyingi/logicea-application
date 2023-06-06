import React, { useEffect, useState } from "react";
import "./Table.css";
import FilterSorting from "./FilterSorting";
import Form from "./Form";
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";

interface Joke {
  id: number;
  Title: string;
  Body: string;
  Author: string;
  Views: number;
  CreatedAt: number;
}

const Table: React.FC = () => {
  const [jokes, setJokes] = useState<Joke[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [filterBy, setFilterBy] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [selectedJoke, setSelectedJoke] = useState<Joke | null>(null);
  const navigate = useNavigate();

  const handleFilterSort = (filterBy: string, sortBy: string) => {
    setFilterBy(filterBy);
    setSortBy(sortBy);
  };

  useEffect(() => {
    fetchJokes();
  }, [currentPage, itemsPerPage, filterBy, sortBy]);

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

  const handleEdit = (joke: Joke) => {
    setSelectedJoke(joke);
    navigate('/form');
  };

  const handleFormClose = () => {
    setSelectedJoke(null);
  };

  const handleFormSubmit = (updatedJoke: Joke) => {
    const updatedJokes = jokes.map((joke) => {
      if (joke.id === updatedJoke.id) {
        return updatedJoke;
      }
      return joke;
    });
    setJokes(updatedJokes);
    setSelectedJoke(null);
  };

  const handleFormDelete = () => {
    const updatedJokes = jokes.filter((joke) => joke.id !== selectedJoke?.id);
    setJokes(updatedJokes);
    setSelectedJoke(null);
  };

  return (
    <div>
      <FilterSorting onFilterSort={handleFilterSort} />
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
                  <Link to="/form" onClick={() => handleEdit(joke)}>
                    {joke.Title}
                  </Link>
                </td>
                <td>{joke.Author}</td>
                <td>{new Date(joke.CreatedAt).toLocaleDateString()}</td>
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
      {selectedJoke && (
      <Form
      initialValues={selectedJoke}
      onClose={handleFormClose}
      onSubmit={handleFormSubmit}
      onDelete={handleFormDelete}
    />
      )}
    </div>
  );
};

export default Table;