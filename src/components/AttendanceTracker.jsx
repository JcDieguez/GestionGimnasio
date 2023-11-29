import React, { useState } from 'react';

const AttendanceTracker = () => {
  const [attendanceList, setAttendanceList] = useState([]);
  const [selectedClients, setSelectedClients] = useState([]);

  // Supongamos que tienes una lista de clientes
  const clients = [
    { id: 1, name: 'Cliente 1' },
    { id: 2, name: 'Cliente 2' },
    { id: 3, name: 'Cliente 3' },
    // ... otros clientes
  ];

  const handleToggleAttendance = (clientId) => {
    const isSelected = selectedClients.includes(clientId);
    if (isSelected) {
      const updatedClients = selectedClients.filter((id) => id !== clientId);
      setSelectedClients(updatedClients);
    } else {
      setSelectedClients([...selectedClients, clientId]);
    }
  };

  const handleMarkAttendance = () => {
    const newAttendance = {
      date: new Date().toLocaleDateString(),
      clients: selectedClients.map((clientId) => clients.find((client) => client.id === clientId)),
    };
    setAttendanceList([...attendanceList, newAttendance]);
    setSelectedClients([]);
  };

  return (
    <div>
      <h2>Control de Asistencia</h2>
      <ul>
        {clients.map((client) => (
          <li key={client.id}>
            <label>
              <input
                type="checkbox"
                checked={selectedClients.includes(client.id)}
                onChange={() => handleToggleAttendance(client.id)}
              />
              {client.name}
            </label>
          </li>
        ))}
      </ul>
      <button onClick={handleMarkAttendance}>Tomar Asistencia</button>
      <div>
        <h3>Lista de Asistencia</h3>
        <ul>
          {attendanceList.map((attendance, index) => (
            <li key={index}>
              <strong>{attendance.date}</strong> -{' '}
              {attendance.clients.map((client) => client.name).join(', ')}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AttendanceTracker;
