from google import genai
import os

# PEGALA AQUÍ ENTRE LAS COMILLAS (La que empieza por AIza...)
key = "AIzaSyAehpZEh75XXhgXDKZRVl3eWPhihwvqO9U" 

client = genai.Client(api_key=key)

try:
    print("🛰️ Forzando generación directa...")
    # Usamos el ID exacto que tu lista confirmó antes
    response = client.models.generate_content(
        model="models/gemini-2.0-flash", 
        contents="Genera el código completo de un archivo HTML llamado 'dashboard.html' para EcoTrace. Usa Tailwind CSS. Fondo verde oscuro, tarjetas con bordes dorados (#fbbf24). Incluye 3 métricas: CO2, Energía, Puntos Eco.")    
    html_code = response.text
    if "```html" in html_code:
        html_code = html_code.split("```html")[1].split("```")[0]
    
    with open("dashboard.html", "w") as f:
        f.write(html_code.strip())
    
    print("\n✅ ¡POR FIN! Archivo 'dashboard.html' creado.")
    print("Míralo en la columna de la derecha en Cursor.")
except Exception as e:
    print(f"❌ Error: {e}")