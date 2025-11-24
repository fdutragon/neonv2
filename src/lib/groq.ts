export interface GroqMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface GroqChoice {
  index: number
  message: { role: 'assistant'; content: string }
  finish_reason?: string
}

export interface GroqChatResponse {
  id: string
  object: string
  created: number
  model: string
  choices: GroqChoice[]
}

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

export async function groqChatCompletion(messages: GroqMessage[], model = 'llama-3.1-70b-versatile'): Promise<string> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY || ''
  if (!apiKey) throw new Error('Groq API key não configurada')

  const res = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.6,
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Erro Groq: ${res.status} ${text}`)
  }

  const data = (await res.json()) as GroqChatResponse
  const content = data.choices?.[0]?.message?.content || ''
  return content.trim()
}
