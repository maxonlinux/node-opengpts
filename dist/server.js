"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const uuid_1 = require("uuid");
const axios_1 = __importDefault(require("axios"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { ASSISTANT_ID, PORT } = process.env;
const corsOptions = {
    methods: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    credentials: true,
};
const app = (0, express_1.default)();
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)(corsOptions));
const randUserID = (0, uuid_1.v4)();
const randThreadID = (0, uuid_1.v4)();
app.post("/messages", async (req, res) => {
    const { userID, threadID } = req.body;
    try {
        const response = await axios_1.default.get(`https://opengpts-example-vz4y4ooboq-uc.a.run.app/threads/${threadID}/messages`, {
            headers: {
                Cookie: `opengpts_user_id=${userID}`,
                Origin: "https://opengpts-example-vz4y4ooboq-uc.a.run.app",
                Referer: "https://opengpts-example-vz4y4ooboq-uc.a.run.app/",
                "Sec-Fetch-Site": "same-origin",
                "Sec-GPC": "1",
                "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            },
        });
        res.status(200).json(response.data);
    }
    catch (error) {
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
        stream.on("data", (chunk) => {
            res.write(chunk);
        });
        stream.on("end", () => {
            res.end();
        });
    }
    catch (error) {
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
async function newRequest({ input, threadID = randThreadID, userID = randUserID, }) {
    if (!ASSISTANT_ID) {
        throw new Error("ASSISTANT_ID is not defined. Please check .env");
    }
    const postData = {
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
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
    };
    try {
        const res = await axios_1.default.post("https://opengpts-example-vz4y4ooboq-uc.a.run.app/runs/stream", postData, Object.assign(Object.assign({}, options), { responseType: "stream" }));
        return res.data;
    }
    catch (error) {
        throw error;
    }
}
