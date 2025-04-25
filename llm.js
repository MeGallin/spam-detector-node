import { ChatOpenAI } from '@langchain/openai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize the LLM with GPT-4o-mini and temperature 0 for deterministic output
export const llm = new ChatOpenAI({
  modelName: 'gpt-4.1',
  temperature: 0,
  openAIApiKey: process.env.OPENAI_API_KEY,
});
