import express from "express"; //no babel: const express = require("express");

const PORT = 4000;
const app = express();

//Application Setting
const handleHome = (req, res) => {
  console.log("Somebody is trying to go home..");
  return res.send("This is response ✔");
};

app.get("/", handleHome);

const handleListening = () =>
  console.log(`Server listening on localhost:${PORT}✨`);

app.listen(4000, handleListening);
