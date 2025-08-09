import express from 'express';
import __get_dirname from '../bin/__dirname.js';

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// app.use("chat",express.static(__get_dirname(import.meta.url, '../public/components/chat')));
// app.use("graph",express.static(__get_dirname(import.meta.url, '../public/components/graph')));
// app.use("forum",express.static(__get_dirname(import.meta.url, '../public/components/forum')));
app.use(express.static(__get_dirname(import.meta.url, '../public')));

export default app