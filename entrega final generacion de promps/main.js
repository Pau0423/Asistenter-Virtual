const SYSTEM_CONTEXT = `
Eres un asistente virtual de Secretaría Remota Personalizada. 
Tu misión es: dar la bienvenida, hacer preguntas para detectar necesidades, 
recomendar un paquete (Básico, Intermedio, Avanzado) y ofrecer contacto humano. 
Responde de forma breve, cálida y con una sola pregunta por turno.

PAQUETES DISPONIBLES:
- BÁSICO: Gestión de agenda y recordatorios ($50/mes)
- INTERMEDIO: + Atención telefónica y emails ($100/mes) 
- AVANZADO: + Gestión completa y reportes ($150/mes)
`;

document.addEventListener("DOMContentLoaded", () => {
  const mensajeChat = document.getElementById("chatContainer");
  const entradaUsuario = document.getElementById("messageInput");
  const botonEnviar = document.getElementsByClassName("btn")[0];

  if (!mensajeChat || !entradaUsuario || !botonEnviar) {
    console.error("Faltan elementos en el HTML");
    return;
  }

  function agregaMensaje(texto, esUsuario) {
    const mensajeDiv = document.createElement("div");
    mensajeDiv.textContent = texto;
    mensajeDiv.className = esUsuario ? "user-message" : "bot-message";
    mensajeChat.appendChild(mensajeDiv);
    mensajeChat.scrollTop = mensajeChat.scrollHeight;
  }

  const ClaveApi = "AIzaSyBatHCf5o__rY-X1iwgCnMciY3WysEqTrE";
  const urlApi = `https://genai.googleapis.com/v1beta3/models/gemini-2.0:generateContent?key=${ClaveApi}`;
  const instruccionSistema = SYSTEM_CONTEXT;

  async function obtenerRespuestGemini(preguntaUsuario) {
    const cuerpo = {
      contents: [{ parts: [{ text: preguntaUsuario }] }],
      systemInstruction: { parts: [{ text: instruccionSistema }] },
    };

    try {
      const respuesta = await fetch(urlApi, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cuerpo),
      });

      const resultado = await respuesta.json();
      const textoBot = resultado.candidates?.[0]?.content?.parts?.[0]?.text;
      agregaMensaje(textoBot || "No se pudo obtener respuesta", false);
    } catch (error) {
      console.error("Error al llamar la API", error);
      agregaMensaje("Hubo un problema, intente más tarde", false);
    }
  }

  function mensajeEntrada() {
    const textoUsuario = entradaUsuario.value.trim();
    if (textoUsuario === "") return;

    agregaMensaje(textoUsuario, true);
    entradaUsuario.value = "";
    obtenerRespuestGemini(textoUsuario);
  }

  botonEnviar.addEventListener("click", mensajeEntrada);
  entradaUsuario.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      mensajeEntrada();
    }
  });
});
