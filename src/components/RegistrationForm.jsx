import React, { useState, useEffect } from 'react';
import '../assets/RegistrationForm.css'; // Importa el archivo de estilos CSS

const RegistrationForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const [paymentDueDate, setPaymentDueDate] = useState('');

  // Función para calcular la fecha de vencimiento del pago
  const calculateDueDate = () => {
    const today = new Date();
    const dueDate = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
    return dueDate.toISOString().split('T')[0];
  };

  useEffect(() => {
    if (isPaid) {
      const newDueDate = calculateDueDate();
      setPaymentDueDate(newDueDate);
    }
  }, [isPaid]);

  // Maneja el cambio en el estado de pago
  const handlePaymentChange = (e) => {
    setIsPaid(e.target.checked);
    if (!e.target.checked) {
      setPaymentDueDate('');
    } else {
      const newDueDate = calculateDueDate();
      setPaymentDueDate(newDueDate);
    }
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
      name,
      email,
      phoneNumber,
      isPaid,
      paymentDueDate,
    };

    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        console.log('Usuario registrado exitosamente');
        // Actualizar la lista de usuarios si es necesario
      } else {
        console.error('Error al registrar el usuario');
      }
    } catch (error) {
      console.error('Error al conectar con el servidor', error);
    }
  };

  return (
    <div className="registration-form-container"> {/* Aplica una clase contenedora */}
      <h2>Registro de Socios</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nombre:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Correo electrónico:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Número de teléfono:
          <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        </label>
        <label className="paid-label"> {/* Aplica una clase para la etiqueta de pago */}
          ¿Está pagado?
          <input type="checkbox" checked={isPaid} onChange={handlePaymentChange} />
        </label>
        {isPaid && (
          <label>
            Fecha de vencimiento del pago:
            <input
              type="date"
              value={paymentDueDate}
              onChange={(e) => setPaymentDueDate(e.target.value)}
            />
          </label>
        )}
        <button type="submit" className="submit-button">Registrar</button> {/* Aplica una clase para el botón de envío */}
      </form>
    </div>
  );
};

export default RegistrationForm;
