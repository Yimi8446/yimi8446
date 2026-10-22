import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini API client lazily
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      aiClient = new GoogleGenAI({ apiKey });
    }
  }
  return aiClient;
}

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', store: 'Mundo Regalón' });
});

// AI Gift Helper Recommendation API
app.post('/api/ai-gift-recommendation', async (req, res) => {
  try {
    const { prompt, age, eventType, budgetBob } = req.body;
    
    const ai = getGenAI();
    if (!ai) {
      return res.status(503).json({
        error: 'Servicio de IA no configurado',
        recommendation: 'Te sugerimos explorar nuestros juguetes educativos y sets de cumpleaños destacados en el catálogo.',
        suggestions: ['Juegos de Mesa Educativos', 'Autos a Control Remoto', 'Set de Arte Creativo']
      });
    }

    const systemInstruction = `
      Eres 'Regalito', el duende sabio asesor de regalos de la tienda 'Mundo Regalón'.
      Tu misión es recomendar el regalo perfecto para niños y eventos especiales en Bolivia (cumpleaños, 15 años, bodas, baby shower).
      Debes responder en español boliviano, de manera súper entusiasta, alegre, amigable para niños y familias.
      Responde en formato JSON con la siguiente estructura:
      {
        "greeting": "Un mensaje divertido y cariñoso",
        "recommendations": [
          {
            "title": "Nombre del regalo sugerido",
            "why": "Por qué es genial para esta edad/evento",
            "estimatedBob": "Precio aproximado en Bs.",
            "category": "Juguetes | Cumpleaños | 15 Años | Baby Shower | Educativos"
          }
        ],
        "tip": "Un consejo divertido para envolver o entregar el regalo"
      }
    `;

    const userMessage = `
      Busco un regalo con estas características:
      - Detalle / Consulta: ${prompt || 'Sin descripción específica'}
      - Edad del destinatario: ${age || 'Cualquier edad'}
      - Evento: ${eventType || 'General / Cumpleaños'}
      - Presupuesto en Bolivianos (Bs.): ${budgetBob ? budgetBob + ' Bs' : 'Cualquier presupuesto'}

      Damm 3 recomendaciones ideales para la tienda.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userMessage,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      }
    });

    const responseText = response.text;
    if (responseText) {
      try {
        const parsed = JSON.parse(responseText);
        return res.json(parsed);
      } catch {
        return res.json({
          greeting: '¡Hola! Aquí tienes unas ideas mágicas:',
          recommendations: [
            {
              title: 'Kit de Robótica o Lego Educativo',
              why: 'Excelente para potenciar la creatividad y diversión.',
              estimatedBob: '120 - 180 Bs',
              category: 'Educativos'
            }
          ],
          tip: '¡Agrega una nota hecha a mano con moño de colores!'
        });
      }
    }

    return res.status(500).json({ error: 'No se obtuvo respuesta de la IA' });
  } catch (err: unknown) {
    console.error('Error in AI Gift endpoint:', err);
    return res.status(500).json({
      error: 'Error al procesar la recomendación',
      recommendation: 'Intenta nuevamente o navega por nuestras categorías de juguetes y regalos.'
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🎈 Mundo Regalón server running on http://localhost:${PORT}`);
  });
}

startServer();
