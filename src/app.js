const Hapi = require('@hapi/hapi');
const { loadModel, predict } = require('./inference');

(async () => {
    // Load and get Machine Learning Model
    const model = await loadModel();
    console.log('model loaded!');

    // Initializing HTTP Server
    const server = Hapi.server({
        host: process.env.NODE_ENV !== 'production' ? 'localhost': '0.0.0.0',
        port: 3000
    });

    server.route({
        method: 'POST',
        path: '/predicts',
        handler: async (request) => {
            // Get Image That Upload by User
            const {image} = request.payload;
            // Do and get Prediction result by giving model and image
            const predictions = await predict(model, image);
            // get prediction result
            const [paper, rock] = predictions;

            if (paper) {
                return { result: 'paper' };
            }

            if (rock) {
                return { result: 'rock' };
            }

            return { result: 'scissors' };
        },

        // Make request payload as `multipart/form-data` to accept file upload
        options: {
            payload: {
                allow: 'multipart/form-data',
                multipart: true,
            }
        }
    });


    // running server
    await server.start();
    console.log(`Server start at: ${server.info.uri}`);
})();