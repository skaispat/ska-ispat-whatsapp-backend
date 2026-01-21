import express from "express";
import cors from "cors";
import { sendWhatsappMessage } from "./src/controller/sendWhatsappMessage.controller.js";
import { sendWhatsappMessageHod } from "./src/controller/sendWhatsappMessageHod.controller.js";

const app = express();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/api/send-whatsappMessage", sendWhatsappMessage);
app.post("/api/send-whatsappMessage-hod", sendWhatsappMessageHod);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
