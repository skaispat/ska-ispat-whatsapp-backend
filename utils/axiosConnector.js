import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const axiosclient = axios.create({
  baseURL: process.env.WHATSAPP_ENDPOINT,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
  },
});

export default axiosclient;
