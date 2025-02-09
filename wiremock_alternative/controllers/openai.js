exports.generateChat = async (req, res) => {
    try {
        const text = await generatePrivateText(req.body.messages, req.body.stream || false , req.body.model || 'openai');
        res.status(200).json(text);
    } catch (err) {
        res.status(500).send(err);
    }
};

async function generatePrivateText(messages, model='openai') {
    const response = await fetch('https://text.pollinations.ai/openai', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            messages: messages,
            model: model, // 'openai'
            private: true,  // Response won't appear in public feed
            // stream: stream  // Stream response to client
        })
    });

    const data = await response.json();
    return data;
}



// curl --location 'https://text.pollinations.ai/openai' \
// --header 'Content-Type: application/json' \
// --data '{
//         "messages": [
//             {
//                 "role": "user",
//                 "content": [
//                     {"type": "text", "text": "descibe this ui template for generation image. give detailed response. include theme styling as well"},
//                     {
//                         "type": "image_url",
//                         "image_url": {"url": "https://themewagon.com/wp-content/uploads/2020/12/eflyer.jpg"}
//                     }
//                 ]
//             }
//         ],
//         "model": "openai"
//     }'