import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

interface InputData {
  content: string;
  additional_kwargs: any;
  type: string;
  example: boolean;
}

interface RequestBody {
  input: InputData[];
  assistant_id: string;
  thread_id: string;
}

interface NewRequestParams {
  input: string;
  threadID?: string;
  userID?: string;
}

const { ASSISTANT_ID, PORT } = process.env;

const corsOptions = {
  methods: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  credentials: true,
};

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors(corsOptions));

const randUserID = uuidv4();
const randThreadID = uuidv4();

app.post("/messages", async (req, res) => {
  const { userID, threadID } = req.body;

  try {
    const response = await axios.get(
      `https://opengpts-example-vz4y4ooboq-uc.a.run.app/threads/${threadID}/messages`,
      {
        headers: {
          Cookie: `opengpts_user_id=${userID}`,
          Origin: "https://opengpts-example-vz4y4ooboq-uc.a.run.app",
          Referer: "https://opengpts-example-vz4y4ooboq-uc.a.run.app/",
          "Sec-Fetch-Site": "same-origin",
          "Sec-GPC": "1",
          "User-Agent":
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      }
    );

    res.status(200).json(response.data)
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send({ error: "Internal server error" });
  }
});

app.post("/query", async (req, res) => {
  const { input, threadID, userID } = req.body;

  if (!input || input.trim().length < 1) {
    return res.status(400).send({ error: "Input cannot be empty" });
  }

  try {
    const stream = await newRequest({ input: input.trim(), threadID, userID });
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });

    stream.on("data", (chunk: any) => {
      res.write(chunk);
    });

    stream.on("end", () => {
      res.end();
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  if (!PORT) {
    throw new Error("PORT is not defined. Please check .env");
  }

  console.log(`App listening on port ${PORT}`);
});

async function newRequest({
  input,
  threadID = randThreadID,
  userID = randUserID,
}: NewRequestParams) {
  if (!ASSISTANT_ID) {
    throw new Error("ASSISTANT_ID is not defined. Please check .env");
  }

  const postData: RequestBody = {
    input: [
      {
        content: input,
        additional_kwargs: {},
        type: "human",
        example: false,
      },
    ],
    assistant_id: ASSISTANT_ID,
    thread_id: threadID,
  };

  const options = {
    headers: {
      "Content-Type": "application/json",
      Cookie: `opengpts_user_id=${userID}`,
      Accept: "text/event-stream",
      "Accept-Language": "en-US,en;q=0.7",
      "Cache-Control": "no-cache",
      Origin: "https://opengpts-example-vz4y4ooboq-uc.a.run.app",
      Pragma: "no-cache",
      Referer: "https://opengpts-example-vz4y4ooboq-uc.a.run.app/",
      "Sec-Fetch-Site": "same-origin",
      "Sec-GPC": "1",
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  };

  try {
    const res = await axios.post(
      "https://opengpts-example-vz4y4ooboq-uc.a.run.app/runs/stream",
      postData,
      { ...options, responseType: "stream" }
    );

    return res.data;
  } catch (error) {
    throw error;
  }
}
