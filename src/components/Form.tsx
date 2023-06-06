import React, { useState } from 'react';

interface FormProps {
  initialValues: Joke;
  onClose: () => void;
  onSubmit: (updatedJoke: Joke) => void;
  onDelete: () => void;
}

interface Joke {
  id: number;
  Title: string;
  Body: string;
  Author: string;
  Views: number;
  CreatedAt: number;
}


const Form: React.FC<FormProps> = ({
  initialValues,
  onClose,
  onSubmit,
  onDelete,
}) => {
  const [formValues, setFormValues] = useState<Joke>({
    id: initialValues.id,
    Title: initialValues.Title,
    Body: initialValues.Body,
    Author: initialValues.Author,
    Views: initialValues.Views,
    CreatedAt: initialValues.CreatedAt,
  });

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
    const updatedJoke: Joke = {
      id: initialValues.id,
      Title: formValues.Title,
      Body: formValues.Body,
      Author: formValues.Author,
      Views: formValues.Views,
      CreatedAt: formValues.CreatedAt,
    };

    onSubmit(updatedJoke);
  };
  return (
    <div>
      <form>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="Title"
          value={formValues.Title}
          onChange={handleChange}
        />

        <label htmlFor="author">Author:</label>
        <input
          type="text"
          id="author"
          name="Author"
          value={formValues.Author}
          onChange={handleChange}
        />

        <label htmlFor="views">Views:</label>
        <input
          type="number"
          id="views"
          name="Views"
          value={formValues.Views}
          onChange={handleChange}
        />

        <div>
          <button type="button" onClick={handleSubmit}>
            Update
          </button>
          <button type="button" onClick={onDelete}>
            Delete
          </button>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;
