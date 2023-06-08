import React, { useState, useEffect } from "react";
import "./Form.css";
import { Joke } from "./Table";

interface FormProps {
  joke?: Joke;
  onSubmit: (updatedJoke: Joke) => void;
  onDelete?: () => void;
  onClose?: () => void;
}

const Form: React.FC<FormProps> = ({ joke, onSubmit, onDelete, onClose }) => {
  const [formValues, setFormValues] = useState<Joke>({
    id: joke?.id,
    Title: joke?.Title || "",
    Body: joke?.Body || "",
    Author: joke?.Author || "",
    Views: joke?.Views || 0,
    CreatedAt: joke?.CreatedAt || 0,
  });

  useEffect(() => {
    if (joke) {
      setFormValues(joke);
    }
  }, [joke]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (joke) {
      const updatedJoke: Joke = {
        id: joke.id,
        Title: formValues.Title,
        Body: formValues.Body,
        Author: formValues.Author,
        Views: formValues.Views,
        CreatedAt: joke.CreatedAt,
      };

      onSubmit(updatedJoke);
    } else {
      const newJoke: Joke = {
        id: Date.now(),
        Title: formValues.Title,
        Body: formValues.Body,
        Author: formValues.Author,
        Views: formValues.Views,
        CreatedAt: Date.now(),
      };

      onSubmit(newJoke);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="form-container">
      <h2>{joke ? "Edit Joke" : "Add New Joke"}</h2>
      <form>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="Title"
            value={formValues.Title}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="author">Author:</label>
          <input
            type="text"
            id="author"
            name="Author"
            value={formValues.Author}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="views">Views:</label>
          <input
            type="number"
            id="views"
            name="Views"
            value={formValues.Views}
            onChange={handleChange}
          />
        </div>

        <div className="button-group">
          <button type="button" onClick={handleSubmit}>
            {joke ? "Update" : "Submit"}
          </button>
          {joke && (
            <>
              <button
                type="button"
                className="delete-button"
                onClick={handleDelete}
              >
                Delete
              </button>
            </>
          )}
          <button type="button" className="close-button" onClick={handleClose}>
            Close
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;
