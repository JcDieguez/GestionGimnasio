import React, { useState, useEffect } from 'react';
import '../assets/UserList.css'; // Importa el archivo de estilos CSS

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [editedUser, setEditedUser] = useState(null); // Estado para el usuario en edición
  const [searchTerm, setSearchTerm] = useState('');
  const [showPaid, setShowPaid] = useState(false);
  const [showUnpaid, setShowUnpaid] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users');
        if (response.ok) {
          const data = await response.json();
          if (data && Array.isArray(data)) {
            setUsers(data);
          } else {
            console.error('La respuesta del servidor no tiene la estructura esperada');
          }
        } else {
          console.error('Error al obtener la lista de usuarios');
        }
      } catch (error) {
        console.error('Error al conectar con el servidor', error);
      }
    };

    fetchUsers();
  }, []);

  const calculateDaysRemaining = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const differenceInTime = due.getTime() - today.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    return differenceInDays;
  };

  const handleDelete = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedUsers = users.filter((user) => user._id !== userId);
        setUsers(updatedUsers);
        console.log('Usuario eliminado exitosamente');
      } else {
        console.error('Error al eliminar el usuario');
      }
    } catch (error) {
      console.error('Error al conectar con el servidor', error);
    }
  };

  const handleEdit = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${editedUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedUser),
      });
  
      if (response.ok) {
        const updatedUsers = users.map((user) => {
          if (user._id === editedUser._id) {
            return { ...user, ...editedUser };
          }
          return user;
        });
  
        setUsers(updatedUsers);
        if (editedUser.isPaid) {
          // Actualizar la fecha de vencimiento si se marca como pagado
          const updatedUser = updatedUsers.find((user) => user._id === editedUser._id);
          const today = new Date();
          const daysToAdd = 30; // Cambia esto por la cantidad de días que desees agregar
          today.setDate(today.getDate() + daysToAdd);
          updatedUser.paymentDueDate = today.toISOString(); // Actualiza la fecha de vencimiento
        }
  
        console.log('Usuario editado exitosamente');
        setEditedUser(null);
      } else {
        console.error('Error al editar el usuario');
      }
    } catch (error) {
      console.error('Error al conectar con el servidor', error);
    }
  };

  const filteredUsers = users.filter((user) => {
    const nameMatch = user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const isPaidMatch = showPaid ? user.isPaid : true;
    const isUnpaidMatch = showUnpaid ? !user.isPaid : true;
    const isOverdue = user.isPaid && user.paymentDueDate && calculateDaysRemaining(user.paymentDueDate) < 0;

    return nameMatch && isPaidMatch && isUnpaidMatch && !isOverdue;
  });

  const overdueUsers = users.filter((user) => {
    const nameMatch = user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const isOverdue = user.isPaid && user.paymentDueDate && calculateDaysRemaining(user.paymentDueDate) < 0;

    return nameMatch && isOverdue;
  });

  return (
    <div className="user-list-container">
      <h2>Usuarios Registrados</h2>
      <p>Total de usuarios: {users.length}</p>
      <p>Usuarios filtrados por pago: {filteredUsers.length}</p>
      <input
        type="text"
        placeholder="Buscar por nombre"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <label>
        <input
          type="checkbox"
          checked={showPaid}
          onChange={(e) => setShowPaid(e.target.checked)}
        />
        Cuota registrada
      </label>
      <label>
        <input
          type="checkbox"
          checked={showUnpaid}
          onChange={(e) => setShowUnpaid(e.target.checked)}
        />
        Cuota no registrada
      </label>
      <ul className="user-list">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <li key={user._id}>
              <p>Nombre: {user.name}</p>
              <p>Pagado: {user.isPaid ? 'Sí' : 'No'}</p>
              {user.isPaid && (
                <p>Vencimiento del pago: {user.paymentDueDate}</p>
              )}
              {user.isPaid && user.paymentDueDate && (
                <p>Días restantes para el vencimiento: {calculateDaysRemaining(user.paymentDueDate)}</p>
              )}
              <button onClick={() => setEditedUser(user)}>Editar</button>
              <button onClick={() => handleDelete(user._id)}>Eliminar</button>
            </li>
          ))
        ) : (
          <li>No hay usuarios deudores</li>
        )}
      </ul>
      <h2>Usuarios Vencidos</h2>
      <ul className="overdue-list">
        {overdueUsers.length > 0 ? (
          overdueUsers.map((user) => (
            <li key={user._id}>
              <p>Nombre: {user.name}</p>
              <p>Pagado: {user.isPaid ? 'Sí' : 'No'}</p>
              <p>Vencimiento del pago: {user.paymentDueDate}</p>
              <button onClick={() => setEditedUser(user)}>Editar</button>
              <button onClick={() => handleDelete(user._id)}>Eliminar</button>
            </li>
          ))
        ) : (
          <li>No hay usuarios vencidos</li>
        )}
      </ul>
      {editedUser && (
        <div className="edit-user-form">
          <h2>Editar Usuario</h2>
          <input
            type="text"
            placeholder="Nombre"
            value={editedUser.name}
            onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Email"
            value={editedUser.email}
            onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
          />
          <div>
            <label>
              <input
                type="checkbox"
                checked={editedUser.isPaid}
                onChange={(e) => setEditedUser({ ...editedUser, isPaid: e.target.checked })}
              />
              Pagado
            </label>
          </div>
          <button onClick={handleEdit}>Guardar Cambios</button>
        </div>
      )}
    </div>
  );
};

export default UserList;
