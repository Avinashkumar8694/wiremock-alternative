exports.generatePText = async (req, res) => {
    try {
        const text = await generatePrivateText(req.body.messages, req.body.stream || false , req.body.model || 'openai');
        res.status(200).json(text);
    } catch (err) {
        res.status(500).send(err);
    }
};
exports.generatePImage = async (req, res) => {
    try {
        const image = await generateImage(req.query.prompt, req.query.width || 1024, req.query.height || 1024, req.query.seed || 42, req.query.model='flux');
        res.setHeader('Content-Type', 'image/png'); // Change this to the correct image content type if needed
        res.status(200).send(image);
    } catch (err) {
        res.status(500).send(err);
    }
};




async function generatePrivateText(messages, stream=false, model='openai') {
    const response = await fetch('https://text.pollinations.ai/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            messages: messages,
            // messages: [
            //     { role: 'user', content: 'Generate a creative story' }
            // ],
            model: model, // 'openai'
            private: true,  // Response won't appear in public feed
            stream: stream  // Stream response to client
        })
    });

    const data = await response.text();
    return data;
}


async function generateImage(prompt, width=1024, height=1024, seed=42, model='flux') {
    // Fetching the image from the URL
    const response = await fetch(`https://pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&seed=${seed}&model=${model}&stream=false`);
    // Reading the response as a buffer
    const arrayBuffer = await response.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);
    return imageBuffer;
}