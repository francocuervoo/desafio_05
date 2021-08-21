/* eslint-disable no-undef */

const Contenedor = require("./src/contenedor.js");

const objetoContenedor = new Contenedor("productos.json");

const emoji = require("node-emoji"); // Import node-emoji
const express = require("express"); // Import express
const app = express(); // Server app
const handlebars = require("express-handlebars");

app.use(express.urlencoded({extended: true})) // Middleware

app.engine( // Configuración del HBS
  ".hbs",
  handlebars({
    defaultLayout: "layoutFrame",
    extname: "hbs",
    layoutsDir: __dirname + "/views",
  })
);

app.set("view engine", "hbs"); // Seteo el engine que voy a usar y la extension hbs
app.use(express.static("public")); // Static file folder

app.get("/", (req, res) => {
  // Formulario de la ruta raíz
  res.render("bodyForm"), { layout: "layoutFrame" }; // Le paso el form en el body
});

app.get("/productos", async (req, res) => {
  const lista = await objetoContenedor.getAll();
  res.render("bodyProducts", {
    layout: "layoutFrame",
    lista,
  });
});

app.post('/productos', async (req, res) => {
  const { body } = req;
  await objetoContenedor.save(body);
  res.redirect('/');
});

const PORT = 8081;

const server = app.listen(PORT, () => {
  console.log(
    emoji.get("computer"),
    `Servidor express corriendo en el puerto http://localhost:${PORT}`
  );
});

server.on("error", (error) =>
  console.log(emoji.get("computer"), `Error en servidor ${error}`)
);
