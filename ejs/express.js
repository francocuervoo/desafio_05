/* eslint-disable no-undef */

const Contenedor = require("./src/contenedor.js");

const objetoContenedor = new Contenedor("productos.json");

const emoji = require("node-emoji"); // Import node-emoji
const express = require("express"); // Import express
const app = express(); // Server app
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs"); // Seteo el engine que voy a usar y la extension ejs
app.set("views", "./views"); //Establecemos el directorio donde se encuentran los archivos de la plantilla.
app.use(express.static("public")); // Static file folder

app.get("/", (req, res) => {
  // Formulario de la ruta raíz
  res.sendFile(__dirname + '/public/index.html')
});

app.get("/productos", async (req, res) => {
  const lista = await objetoContenedor.getAll();
  res.render("vistaProductos.ejs", {
    lista,
  });
});

app.post("/productos", async (req, res) => {
  const { body } = req;
  await objetoContenedor.save(body);
  res.redirect("/");
});

const PORT = 8082;

const server = app.listen(PORT, () => {
  console.log(
    emoji.get("computer"),
    `Servidor express corriendo en el puerto http://localhost:${PORT}`
  );
});

server.on("error", (error) =>
  console.log(emoji.get("computer"), `Error en servidor ${error}`)
);
