import { useState } from "react";

const useForm = (callback) => {
  const [values, setValues] = useState({});
  const handleSubmit = (e) => {
    e.preventDefault();
    callback(values);
  };

  const handleChange = (e) => {
    e.persist();
    setValues((values) => ({
      ...values,
      [e.target.name]: e.target.value,
    }));
  };

  return {
    handleChange,
    handleSubmit,
    values,
    setValues,
  };
};

export default useForm;
