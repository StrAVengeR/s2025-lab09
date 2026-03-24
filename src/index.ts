import { ImageAnnotatorClient } from '@google-cloud/vision';
import * as fs from 'fs';

const client = new ImageAnnotatorClient();

function main(fileNames: string[]): void {
    fileNames.forEach((fileName: string) => {
        console.log(`Running logo detection on ${fileName}`);
        
        if (!fs.existsSync(fileName)) {
            console.log(`File ${fileName} not found`);
            return;
        }

        client.logoDetection({image: {content: new Uint8Array(fs.readFileSync(fileName))}})
        .then(([result]) => {
            let scores: number[] = [];
            const logos = result.logoAnnotations;
            logos?.forEach((logo) => {
                if (logo.description)
                    console.log(`"${logo.description}" found in in file ${fileName}`);
                if (logo.score)
                    scores.push(logo.score);
            });
            const avg = scores.reduce((a, b) => a + b) / scores.length;
            console.log(`Average score for ${fileName}: ${avg}`);
        })
        .catch((err) => {
            console.log(`Error: ${err.message}`);
        });
    });
}

// Async version
async function mainAsync(fileNames: string[]): Promise<void> {
    for (const fileName of fileNames) {
        console.log(`Running logo detection on ${fileName}`);
        
        if (!fs.existsSync(fileName)) {
            console.log(`File ${fileName} not found`);
            continue;
        }

        try {
            const [result] = await client.logoDetection({image: {content: new Uint8Array(fs.readFileSync(fileName))}});
            let scores: number[] = [];
            const logos = result.logoAnnotations;
            logos?.forEach((logo) => {
                if (logo.description)
                    console.log(`"${logo.description}" found in in file ${fileName}`);
                if (logo.score)
                    scores.push(logo.score);
            });
            const avg = scores.reduce((a, b) => a + b) / scores.length;
            console.log(`Average score for ${fileName}: ${avg}`);
        } catch (err: any) {
            console.log(`Error: ${err.message}`);
        }
    }
}

main([
    './images/cmu.jpg',
    './images/logo-types-collection.jpg',
    './images/not-a-file.jpg'
]);

mainAsync([
    './images/cmu.jpg',
    './images/logo-types-collection.jpg',
    './images/not-a-file.jpg'
]);