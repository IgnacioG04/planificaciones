import { useState } from "react";

function Home() {
    const [formData, setFormData] = useState({
        nombre: "",
        turno: "",
        area: "",
        grado: "",
        tipo: "anual", // Por defecto "anual"
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8000/generateword/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                // Descargar el archivo generado
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = "Planificación.docx";
                link.click();
            } else {
                const errorData = await response.json();
                alert(`Error al generar el archivo Word: ${errorData.detail}`);
            }
        } catch (error) {
            console.error("Error al conectar con el backend:", error);
            alert("Error al conectar con el backend.");
        }
    };

    return (
        <div className="container">
            <h2>Generador de Planificación</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="nombre">Nombre del docente</label>
                    <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        className="form-control"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="turno">Turno</label>
                    <select
                        id="turno"
                        name="turno"
                        className="form-select"
                        value={formData.turno}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Seleccione un turno</option>
                        <option value="Mañana">Mañana</option>
                        <option value="Tarde">Tarde</option>
                        <option value="Noche">Noche</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="area">Área</label>
                    <select
                        id="area"
                        name="area"
                        className="form-select"
                        value={formData.area}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Seleccione un área</option>
                        <option value="Matemáticas">Matemáticas</option>
                        <option value="Lengua y Literatura">Lengua y Literatura</option>
                        <option value="Ciencias Naturales">Ciencias Naturales</option>
                        <option value="Ciencias Sociales">Ciencias Sociales</option>
                        <option value="Educación Artística">Educación Artística</option>
                        <option value="Educación Física">Educación Física</option>
                        <option value="Educación Tecnológica">Educación Tecnológica</option>
                        <option value="Formación Ética y Ciudadana">Formación Ética y Ciudadana</option>
                        <option value="Inglés">Inglés</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="grado">Grado</label>
                    <select
                        id="grado"
                        name="grado"
                        className="form-select"
                        value={formData.grado}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Seleccione un grado</option>
                        <option value="1">1°</option>
                        <option value="2">2°</option>
                        <option value="3">3°</option>
                        <option value="4">4°</option>
                        <option value="5">5°</option>
                        <option value="6">6°</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="tipo">Tipo de planificación</label>
                    <select
                        id="tipo"
                        name="tipo"
                        className="form-select"
                        value={formData.tipo}
                        onChange={handleChange}
                    >
                        <option value="anual">Anual</option>
                        <option value="diaria">Diaria</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Generar</button>
            </form>
        </div>
    );
}

export default Home;