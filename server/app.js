// server/app.js

const express = require('express');
const mongoose = require('mongoose');
const UserModel = require('./models/User');
const cors = require('cors');

const app = express();
app.use(express.json());
// Habilita CORS para todas las solicitudes
app.use(cors());

// Conexión a MongoDB Atlas
mongoose.connect('mongodb+srv://juancruzdieguez95:zbmivk7w@gimnasio.umkjusr.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Conexión exitosa a MongoDB');
  })
  .catch(err => console.error('Error de conexión a MongoDB:', err));

// Ruta para manejar el registro de nuevos usuarios
app.post('/api/users', async (req, res) => {
  try {
    const { name, email, phoneNumber, isPaid, paymentDueDate } = req.body; // Datos del formulario

    // Crea un nuevo usuario con el modelo
    const newUser = new UserModel({ name, email, phoneNumber, isPaid, paymentDueDate });

    // Guarda el usuario en la base de datos
    await newUser.save();

    // Responde con un mensaje de éxito
    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar el usuario' });
  }
});

// Ruta para obtener todos los usuarios
app.get('/api/users', async (req, res) => {
  try {
    const users = await UserModel.find(); // Obtener todos los usuarios de la base de datos
    res.status(200).json(users); // Responder con los usuarios encontrados
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
});

// Ruta para eliminar un usuario específico
app.delete('/api/users/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    // Lógica para eliminar el usuario con el ID proporcionado
    await UserModel.findByIdAndDelete(userId);
    res.status(200).json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el usuario' });
  }
});

// Ruta para actualizar un usuario específico
app.put('/api/users/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const { name, email, phoneNumber, isPaid, paymentDueDate } = req.body; // Datos actualizados

    // Busca y actualiza el usuario en la base de datos
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { name, email, phoneNumber, isPaid, paymentDueDate },
      { new: true } // Para devolver el usuario actualizado
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el usuario' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
