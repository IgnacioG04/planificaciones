from fastapi import FastAPI, Form, HTTPException
from fastapi.responses import FileResponse
from docx import Document
import groq
from fastapi.middleware.cors import CORSMiddleware
import re
import os

app = FastAPI()

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Funciones auxiliares
def obtener_template(tipo):
    """Obtiene la plantilla según el tipo."""
    return f"templates/{tipo}_template.docx"

def guardar_archivo(doc, filename):
    """Guarda el archivo Word."""
    doc.save(filename)

def obtener_ai_response(grado, area):
    """Obtiene la respuesta de la IA."""
    client = groq.Client(api_key=os.environ["GROQ_API_KEY"]) # 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 Api nueva
    model = client.get_model("llama-3.1-70b-versatile")
    prompt = f"""Genera contenido para una planificación de clase en {area} para el grado {grado}. Incluye: - Fundamentación - Objetivos Generales - Capacidades"""
    response = client.generate(prompt=prompt, max_tokens=500)
    return response["choices"][0]["text"]

def separar_secciones(texto):
    """Separa el texto en secciones."""
    return texto.split("\n\n")

def limpiar_texto(texto):
    """Limpia el texto eliminando caracteres no válidos."""
    return re.sub(r'[^\x20-\x7E\n]', '', texto).strip()

def remplazar_texto(doc, nombre, turno, area, grado, texto):
    """Remplaza texto en la plantilla."""
    for para in doc.paragraphs:
        para.text = (
            para.text.replace("{{nombre}}", nombre)
            .replace("{{turno}}", turno)
            .replace("{{area}}", area)
            .replace("{{grado}}", grado)
            .replace("{{fundamentacion}}", texto["fundamentacion"])
            .replace("{{objetivos}}", texto["objetivos"])
            .replace("{{capacidades}}", texto["capacidades"])
        )

# Rutas
@app.get("/")
async def root():
    """Verifica que el backend esté funcionando."""
    return {"message": "El backend está funcionando correctamente"}

@app.post("/generate-word/")
async def generate_word(
    nombre: str = Form(...),
    turno: str = Form(...),
    area: str = Form(...),
    grado: str = Form(...),
    tipo: str = Form(...),
):
    """
    Genera un archivo Word con contenido generado por IA.
    
    :param nombre: Nombre del docente
    :param turno: Turno
    :param area: Área académica
    :param grado: Grado
    :param tipo: Tipo de planificación (anual/diaria)
    :return: Archivo Word generado
    """
    try:
        print("Generando planificacion...")
        template_file = obtener_template(tipo)
        print("Plantilla cargada correctamente...")
        doc = Document(template_file)
        print("Documento creado correctamente...")
        texto_ai = obtener_ai_response(grado, area)
        print("Texto generado por IA correctamente...")
        secciones = separar_secciones(texto_ai)
        texto_ai = {
            "fundamentacion": limpiar_texto(secciones[0] if len(secciones) > 0 else ""),
            "objetivos": limpiar_texto(secciones[1] if len(secciones) > 1 else ""),
            "capacidades": limpiar_texto(secciones[2] if len(secciones) > 2 else ""),
        }

        remplazar_texto(doc, nombre, turno, area, grado, texto_ai)
        print("Texto reemplazado correctamente...")
        output_file = "output.docx"
        guardar_archivo(doc, output_file)
        print("Archivo guardado correctamente")
        return FileResponse(
            output_file,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            filename=output_file,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 