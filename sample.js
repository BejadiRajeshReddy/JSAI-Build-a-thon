import ModelClient from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";
import fs from "fs";

const token = process.env["GITHUB_TOKEN"];
const endpoint = "https://models.github.ai/inference";
const modelName = "openai/gpt-4.1";

export async function main() {
  const client = new ModelClient(endpoint, new AzureKeyCredential(token));

  // Read and encode the image
  const imageData = fs.readFileSync("contoso_layout_sketch.jpg");
  const base64Image = imageData.toString('base64');

  const response = await client.path("/chat/completions").post({
    body: {
      messages: [
        { 
          role: "user", 
          content: [
            {
              type: "text",
              text: "Convert this hand-drawn website sketch into HTML and CSS code. Create a complete, functional webpage."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        },
      ],
      model: modelName,
      temperature: 0.7,
      max_tokens: 2000,
    }
  });

  if (response.status !== "200") {
    throw response.body.error;
  }
  console.log(response.body.choices[0].message.content);
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});

