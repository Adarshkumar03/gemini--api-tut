import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as fs from "fs";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);

function fileToGenerativePath(path, mimeType){
    return {
        inlineData: {
            data: Buffer.from(fs.readFileSync(path)).toString("base64"),
            mimeType
        },
    };
}

async function run(){
    const model = genAI.getGenerativeModel({model: "gemini-pro-vision"});
    const prompt = "";
    const imageParts = [fileToGenerativePath("indIntegral.jpg", "image/jpeg")];
    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text();
    console.log(text);
}

run();