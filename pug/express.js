/* eslint-disable no-undef */
const Contenedor = require("./src/contenedor.js");

const objetoContenedor = new Contenedor("productos.json");

const emoji = require("node-emoji"); // Import node-emoji
const express = require("express"); // Import express
const app = express(); // Server app

app.set("views", "./views"); // Establish directory where the files are located
app.set("view engine", "pug"); // Motor pug

app.use(express.static("public")); // Static file folder

app.get("/", (req, res) => { // Formulario en la ruta raíz
  res.sendFile(__dirname + '/public/index.html');
});

app.post("/productos", async (req, res) => {
  const { body } = req;
  await objetoContenedor.save(body);
  res.redirect('/')
});

app.get("/productos", async (req, res) => { // Product list
  const lista = await objetoContenedor.getAll();
  res.render("vistaProductos", {
    lista,
  });
});

const PORT = 8080;

const server = app.listen(PORT, () => {
  console.log(
    emoji.get("computer"),
    `Servidor express corriendo en el puerto http://localhost:${PORT}`
  );
});

server.on("error", (error) =>
  console.log(emoji.get("computer"), `Error en servidor ${error}`)
);
