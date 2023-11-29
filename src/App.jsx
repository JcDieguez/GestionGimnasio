import React from 'react';
import RegistrationForm from './components/RegistrationForm';
import UserList from './components/UserList';

const App = () => {
  return (
    <div>
      <h1>Gestión de Clientes en el Gimnasio</h1>
      <RegistrationForm />
      <hr />
      <UserList />
    </div>
  );
};

export default App;