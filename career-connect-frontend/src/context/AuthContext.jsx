import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [student, setStudent] = useState(() => {
    const saved = localStorage.getItem('portal_student');
    return saved ? JSON.parse(saved) : null;
  });

  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem('portal_admin');
    return saved ? JSON.parse(saved) : null;
  });

  const loginStudent = (studentData) => {
    setStudent(studentData);
    localStorage.setItem('portal_student', JSON.stringify(studentData));
  };

  const logoutStudent = () => {
    setStudent(null);
    localStorage.removeItem('portal_student');
  };

  const loginAdmin = (adminData) => {
    setAdmin(adminData);
    localStorage.setItem('portal_admin', JSON.stringify(adminData));
  };

  const logoutAdmin = () => {
    setAdmin(null);
    localStorage.removeItem('portal_admin');
  };

  const updateStudentContext = (updatedData) => {
    const merged = { ...student, ...updatedData };
    setStudent(merged);
    localStorage.setItem('portal_student', JSON.stringify(merged));
  };

  return (
    <AuthContext.Provider
      value={{
        student,
        admin,
        loginStudent,
        logoutStudent,
        updateStudentContext,
        loginAdmin,
        logoutAdmin,
        isAuthenticatedStudent: !!student,
        isAuthenticatedAdmin: !!admin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
