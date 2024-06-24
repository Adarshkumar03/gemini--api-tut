import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import readline from "readline";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let isAwaitingResponse = false;

async function run(){
    const model = genAI.getGenerativeModel({model: "gemini-pro"});
    const chat = model.startChat({
        history: [],
        generationConfig: {
            maxOutputTokens: 500,
        }
    })

    function askAndRespond(){
        if(!isAwaitingResponse){
            rl.question("You: ", async (msg) => {
                if(msg.toLowerCase() === "exit"){
                    rl.close();
                }else{
                    isAwaitingResponse = true;
                    try{
                        const result = await chat.sendMessageStream(msg);
                        let text = "";
                        for await (const chunk of result.stream){
                            const chunkText = await chunk.text();
                            console.log("AI: ", chunkText);
                            text+=chunkText;
                        }
                        isAwaitingResponse = false;
                        askAndRespond();
                    }catch(err){
                        console.error("Error: ", err);
                        isAwaitingResponse = false;
                    }
                }
            });
        }else{
            console.log("Please wait for the current response to complete");
        }
    }
    
    askAndRespond();
}

run();