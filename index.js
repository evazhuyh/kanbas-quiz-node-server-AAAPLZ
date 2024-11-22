import express from 'express';
import Hello from "./Hello.js"
const express = require('express');
const app = express();
Hello(app);
app.listen(4000);