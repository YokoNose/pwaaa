// src/components/Write.jsx
import React, { useState, useEffect } from "react";
import appFirebase from "../credenciales";
import { getDatabase, ref, set, push, onValue, remove, update } from "firebase/database";
import { obtenerDatos, guardarDatos } from '../storage'; // Importa las funciones de IndexedDB

const Write = () => {
  const [inputValue1, setInputValue1] = useState("");
  const [inputValue2, setInputValue2] = useState("");
  const [inputValue3, setInputValue3] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [obras, setObras] = useState([]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result); // Incluye automáticamente el prefijo MIME
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveData = async () => {
    const db = getDatabase(appFirebase);
    const newDocRef = push(ref(db, "Arte/obras"));

    const newData = {
      obraName: inputValue1,
      obraDescription: inputValue2,
      obraAutor: inputValue3,
      image: imageBase64,
      timestamp: new Date(),
    };

    try {
      // Guarda los datos en Firebase
      await set(newDocRef, newData);
      alert("Guardado exitoso");

      // Guarda los datos en IndexedDB
      await guardarDatos(newData);

      // Actualiza el estado local
      setObras([...obras, newData]);
      setInputValue1("");
      setInputValue2("");
      setInputValue3("");
      setImageBase64("");
      setImageUrl("");
    } catch (error) {
      alert("Error al guardar: " + error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      // Recupera los datos de Firebase
      const db = getDatabase(appFirebase);
      const obrasRef = ref(db, "Arte/obras");

      onValue(obrasRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const obrasArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setObras(obrasArray);
        } else {
          setObras([]);
        }
      });

      // Recupera los datos de IndexedDB para offline
      const offlineData = await obtenerDatos();
      setObras(offlineData);
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    const db = getDatabase(appFirebase);
    const obraRef = ref(db, `Arte/obras/${id}`);

    try {
      // Elimina el nodo seleccionado de Firebase
      await remove(obraRef);
      alert("Obra eliminada correctamente");

      // Actualiza el estado local
      setObras(obras.filter(obra => obra.id !== id));
    } catch (error) {
      console.error("Error al eliminar la obra:", error);
    }
  };

  const handleUpdate = async (id, newName, newDescription, newAutor) => {
    const db = getDatabase(appFirebase);
    const obraRef = ref(db, `Arte/obras/${id}`);

    const updatedData = {
      obraName: newName,
      obraDescription: newDescription,
      obraAutor: newAutor,
    };

    try {
      // Actualiza los datos en Firebase
      await update(obraRef, updatedData);
      alert("Obra actualizada correctamente");

      // Actualiza el estado local
      setObras(obras.map(obra => obra.id === id ? { ...obra, ...updatedData } : obra));
    } catch (error) {
      console.error("Error al actualizar la obra:", error);
    }
  };

  return (
    <div>
      <h2>Formulario para Guardar Obras</h2>
      <input type="text" placeholder="Nombre de la Obra" value={inputValue1} onChange={(e) => setInputValue1(e.target.value)} />
      <input type="text" placeholder="Descripción de la Obra" value={inputValue2} onChange={(e) => setInputValue2(e.target.value)} />
      <input type="text" placeholder="Autor de la Obra" value={inputValue3} onChange={(e) => setInputValue3(e.target.value)} />
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button onClick={saveData}>Guardar</button>
      {imageUrl && <img src={imageUrl} alt="Imagen seleccionada" style={{ width: "200px" }} />}
      <h3>Obras Guardadas:</h3>
      <ul>
        {obras.map((obra) => (
          <li key={obra.id}>
            <h4>{obra.obraName}</h4>
            <p>{obra.obraDescription}</p>
            <p>Autor: {obra.obraAutor}</p>
            {obra.image && <img src={obra.image} alt={obra.obraName} style={{ width: "150px" }} />}
            <button onClick={() => handleDelete(obra.id)}>Eliminar</button>
            <button onClick={() => handleUpdate(obra.id, "Nuevo Nombre", "Nueva Descripción", "Nuevo Autor")}>Actualizar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Write;
