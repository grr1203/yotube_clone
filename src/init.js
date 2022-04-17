import "dotenv/config";
import "regenerator-runtime";
import "./db";
import "./models/Video";
import "./models/User";
import "./models/Comment";
import app from "./server";

const PORT = process.env.PORT || 4000; //heroku or local

const handleListening = () => console.log(`Server listening on PORT:${PORT}✨`);

app.listen(PORT, handleListening);
