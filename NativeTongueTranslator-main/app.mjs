import express from 'express';
import bodyParser from 'body-parser';
import * as GradioClient from "@gradio/client"; 
import { initializeApp } from "firebase/app";


const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Route to handle the prediction request
app.post('/predict', async (req, res) => {
    try {
        const { param_0 } = req.body;
        const client = await GradioClient.Client.connect("RoyVoy/RoyVoy-English-to-Halkomelem");
        const result = await client.predict("/predict", {
            param_0: param_0,
        });

        // Log the entire result to understand its structure
        console.log('Prediction result:', result);

        // Extract the translation text by splitting and cleaning the string
        const dataString = result.data[0];
        console.log('Data string:', dataString); // Log the data string to understand its structure

        // Further clean the translation text
        const translationText = dataString
            .split('translation_text=')[1] // Split the string to isolate the translation text
            .replace(/^[`"']|[`"']\)$/g, '') // Remove surrounding quotes and closing parenthesis
            .trim(); // Remove any leading or trailing spaces

        console.log('Translation text:', translationText); // Log the extracted text

        if (translationText) {
            res.send(translationText);
        } else {
            console.error('Translation text not found');
            res.status(500).send('Translation text not found');
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error fetching prediction');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
