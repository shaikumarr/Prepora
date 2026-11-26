import axios from 'axios';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const BASE = 'https://generativelanguage.googleapis.com/v1beta';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let cachedModels = null;

// Returns a ranked list of models to try. VITE_GEMINI_MODEL (optional) wins if set.
async function listModels() {
  if (import.meta.env.VITE_GEMINI_MODEL) return [import.meta.env.VITE_GEMINI_MODEL];
  if (cachedModels) return cachedModels;

  const { data } = await axios.get(`${BASE}/models`, {
    headers: { 'x-goog-api-key': API_KEY },
    params: { pageSize: 200 },
    timeout: 30000,
  });
  const names = (data.models || [])
    .filter((m) => m.supportedGenerationMethods?.includes('generateContent'))
    .map((m) => m.name.replace('models/', ''))
    .filter((n) => /flash/.test(n) && !/(image|tts|live|audio|embedding|robotics)/.test(n));

  const isRisky = (n) => /(preview|exp|omni|thinking|8b)/.test(n);
  const safe = names.filter((n) => !isRisky(n)).sort().reverse();
  const risky = names.filter(isRisky).sort().reverse();
  const ranked = [...safe, ...risky].slice(0, 6);
  if (!ranked.length) throw new Error('No Gemini model is available for this API key.');
  cachedModels = ranked;
  return ranked;
}

function friendlyError(err) {
  const status = err?.response?.status;
  if (err?.message?.includes('VITE_GEMINI_API_KEY') || err?.message?.includes('No Gemini model')) return err.message;
  if (status === 400 || status === 403) return 'Gemini rejected the request. Check that your API key is valid and enabled.';
  if (status === 404) return 'Gemini model not found. Remove VITE_GEMINI_MODEL from .env, or set it to a valid model name, then restart the dev server.';
  if (status === 429) return 'Gemini quota reached for every available model. Wait a minute and try again, or check your quota in Google AI Studio.';
  if (status >= 500) return 'Gemini is temporarily unavailable. Try again shortly.';
  if (err instanceof SyntaxError) return 'Gemini returned an unreadable response. Try generating again.';
  if (!err?.response) return 'Network error. Check your connection and try again.';
  return err.message || 'Something went wrong while generating.';
}

async function callGemini(prompt) {
  if (!API_KEY) throw new Error('Missing VITE_GEMINI_API_KEY. Add it to your .env file and restart the dev server.');

  let models;
  try {
    models = await listModels();
  } catch (err) {
    throw new Error(friendlyError(err));
  }

  let lastErr;
  for (const model of models) {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const { data } = await axios.post(
          `${BASE}/models/${model}:generateContent`,
          {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: 'application/json', temperature: 0.7 },
          },
          { headers: { 'x-goog-api-key': API_KEY }, timeout: 60000 }
        );
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) throw new Error('Gemini returned an empty response.');
        const parsed = JSON.parse(text.replace(/```json|```/g, '').trim());
        cachedModels = [model, ...models.filter((m) => m !== model)]; // remember the working model
        return parsed;
      } catch (err) {
        lastErr = err;
        const status = err.response?.status;
        if (status === 429 || status === 404) break; // this model is out of quota or missing: try the next one
        const retryable = !status || status >= 500 || err instanceof SyntaxError;
        if (!retryable) throw new Error(friendlyError(err));
        await sleep(1000 * 2 ** attempt); // retry after 1s, 2s
      }
    }
  }
  throw new Error(friendlyError(lastErr));
}

const asArray = (d) => (Array.isArray(d) ? d : Object.values(d).find(Array.isArray) || []);

const context = ({ technology, experience, difficulty, company }) =>
  `Technology: ${technology}\nExperience Level: ${experience}\nDifficulty: ${difficulty}` +
  (company ? `\nTarget Company: ${company} (reflect their typical interview style)` : '');

export async function generateQuestions(sel) {
  const prompt = `Generate 15 interview questions with answers for:\n${context(sel)}\n\nReturn ONLY a JSON array of 15 objects, each with the keys "question" and "answer". Keep each answer clear and under 120 words.`;
  const list = asArray(await callGemini(prompt))
    .filter((x) => x?.question && x?.answer)
    .map(({ question, answer }) => ({ question: String(question), answer: String(answer) }));
  if (!list.length) throw new Error('No questions were returned. Try again.');
  return list;
}

export async function generateMcqs(sel) {
  const prompt = `Generate 10 multiple choice questions for:\n${context(sel)}\n\nReturn ONLY a JSON array of 10 objects, each with: "question" (string), "options" (array of exactly 4 strings, no A/B/C/D prefixes), "correctIndex" (integer 0-3), "explanation" (string, under 60 words). Randomise the position of the correct option.`;
  const list = asArray(await callGemini(prompt))
    .filter((x) => x?.question && Array.isArray(x.options) && x.options.length === 4 && Number.isInteger(x.correctIndex))
    .map((x) => ({ question: String(x.question), options: x.options.map(String), correctIndex: x.correctIndex, explanation: String(x.explanation || '') }));
  if (!list.length) throw new Error('No MCQs were returned. Try again.');
  return list;
}