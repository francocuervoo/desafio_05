/* eslint-disable no-undef */
const Contenedor = require("./src/contenedor.js");

const objetoContenedor = new Contenedor("productos.json");

const emoji = require("node-emoji"); // Import node-emoji
const express = require("express"); // Import express
const app = express(); // Server app
const router = express.Router();

app.set("views", "./views"); // Establish directory where the files are located
app.set("view engine", "pug"); // Motor pug

app.use(express.json()); // Transform to json
app.use(
  express.urlencoded({ extended: true }) // Receives a parameter for the body
);

app.use(express.static("public")); // Static file folder

app.use("/api/productos", router); // Router

app.get("/front", (req, res) => {
  res.sendFile(__dirName + "./public/index.html");
});

app.get("/", (req, res) => {
  res.send("Servidor Express");
});

// Api paths products
router.get("/", async (req, res) => {
  const lista = await objetoContenedor.getAll();
  res.status(200).send(lista);
});

// Filter id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const productoById = await objetoContenedor.getById(id);
  try {
    if (productoById) {
      res.status(200).send(productoById);
    } else {
      res.status(400).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    console.log(error);
  }
});

// Random product
app.get("/api/productoRandom", async (req, res) => {
  let arrayProducts = await objetoContenedor.getAll();
  let max = arrayProducts.length;
  let randomId = Math.floor(Math.random() * max);
  let randomProduct = arrayProducts[randomId];
  res.send(randomProduct);
});

// Add product
router.post("/", async (req, res) => {
  const { body } = req;
  await objetoContenedor.save(body);
  res.status(200).send(body);
});

// Update product
router.put("/:id", async (req, res) => {
  //Desestructuración
  const {
    body,
    params: { id },
  } = req;
  const anterior = await objetoContenedor.getById(id);
  const nuevo = await objetoContenedor.updateById(id, body);

  if (anterior) {
    res.status(200).send({ anterior, nuevo });
  } else {
    res.status(400).json({ error: "Producto no encontrado" });
  }
});

// Delete product
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const borrado = await objetoContenedor.deleteById(id);

  if (borrado) {
    console.log("Producto borrado", borrado);
    res.status(200).send({ borrado });
  } else {
    res
      .status(400)
      .json({ error: "El producto que se intenta borrar no existe." });
  }
});

// PUG
app.get("/pug", async (req, res) => { // Product list
  const lista = await objetoContenedor.getAll();
  res.render("index.pug", {
    lista,
  });
});

app.get("/pug/producto/:id", async (req, res) => { // Product by id
  const { id } = req.params;
  const productoById = await objetoContenedor.getById(id);
  try {
    if (productoById) {
        res.render("producto", {
          productoById,
      });
    } else {
      res.render("producto", {
        productoById: {
          title: "No hay producto",
          id: 0,
          price: 0,
          thumbnail: "https://previews.123rf.com/images/nezezon/nezezon1401/nezezon140100009/25314570-ilustraci%C3%B3n-de-s%C3%ADmbolo-de-prohibido.jpg"
        },
    });
    }
  } catch (error) {
    console.log(error);
  }
});

app.get("/pug/create", (req,res) => { // PUG Create product
  res.render("formulario")
})

app.post("/pug/productos", async (req, res) => {
  const { body } = req;
  await objetoContenedor.save(body);
  res.status(200).send('<div><h3>Grabado!</h3><button><a href="/pug">Regresar</a></button></div>')
});





// app.post("/", async (req,res) => {
//   const data = req.body
//   const lista = await objetoContenedor.getAll();  
//   lista.push(data) //Agrego el nuevo producto
//   console.log(emoji.get('ballot_box_with_check'), 'Grabado!')
//   res.status(200).send('<div><h3>Grabado!</h3><button><a href="/pug">Regresar</a></button></div>')
// })









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
