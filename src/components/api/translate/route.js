const OpenAI = require('openai');

// Lấy khóa API từ biến môi trường
const API_KEY = process.env.OPENAI_API_KEY;

// Tạo một instance của OpenAI với khóa API
const openai = new OpenAI({
    apiKey: API_KEY
});

async function translateText(text, language) {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    "role": "system",
                    "content": `
            You will be provided with a sentence. Your tasks are to:
            - Detect what language the sentence is in
            - Translate the sentence into ${language}
            Do not return anything other than the translated sentence.
          `
                },
                {
                    "role": "user",
                    "content": text
                }
            ],
            temperature: 0.7,
            max_tokens: 64,
            top_p: 1,
        });

        return response.choices[0].message.content;
    } catch (error) {
        throw new Error('Failed to translate text');
    }
}

async function handlePOSTRequest(request) {
    try {
        const { text, language } = await request.json();
        const translatedText = await translateText(text, language);

        return {
            status: 200,
            body: JSON.stringify({ text: translatedText }),
            headers: { 'Content-Type': 'application/json' }
        };
    } catch (error) {
        return {
            status: 500,
            body: JSON.stringify({ error: error.message }),
            headers: { 'Content-Type': 'application/json' }
        };
    }
}

module.exports = { POST: handlePOSTRequest };
