// context.js
import React, { createContext, useState, useContext } from 'react';

const MyContext = createContext();

const MyProvider = ({ children }) => {
  const [examId, setexamId] = useState(null);

  const handleExamId = (id) => {
    setexamId(id);
  };

  return <MyContext.Provider value={{ examId, handleExamId }}>{children}</MyContext.Provider>;
};

export { MyContext, MyProvider };
