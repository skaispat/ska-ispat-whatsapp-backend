import express from "express";
import cors from "cors";
import { sendWhatsappMessage } from "./src/controller/sendWhatsappMessageHr.js";
import { sendWhatsappMessageHod } from "./src/controller/sendWhatsappMessageHod.controller.js";
import {
  sendLeaveApprovedMessage,
  sendLeaveRejectedMessage,
} from "./src/controller/sendWhatsappMessageEmployee.controller.js";
import { sendAttendancePdfWhatsapp } from "./src/controller/sendAttendancePdfWhatsapp.controller.js";

const app = express();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running fine",
    timestamp: new Date().toISOString(),
  });
});

app.post("/api/send-whatsappMessage-hr", sendWhatsappMessage);
app.post("/api/send-whatsappMessage-hod", sendWhatsappMessageHod);
app.post(
  "/api/send-whatsappMessage-employee-approved",
  sendLeaveApprovedMessage,
);
app.post(
  "/api/send-whatsappMessage-employee-rejected",
  sendLeaveRejectedMessage,
);
// Attendance PDF WhatsApp route
app.post("/api/send-attendance-pdf-whatsapp", sendAttendancePdfWhatsapp);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
