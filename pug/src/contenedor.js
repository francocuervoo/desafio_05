const fs = require("fs"); // Import module fs

// Contenedor class
class Contenedor {
  constructor(fileName) {
    this.fileName = fileName;
    this.id = 0;
    this.data = [];
  }
  // Contenedor Methods
  async save(product) { // Save product
    await this.getAll();
    this.id++;
    product.id = this.id;
    this.data.push(product);
    try {
      await fs.promises.writeFile(
        this.fileName,
        JSON.stringify(this.data, null, 2)
      );
      console.log("El id del objeto ingresado es", this.id);
      return this.id; // Return id
    } catch (error) {
      console.log(error);
    }
  }

  async saveList(nuevaLista){ // Guardo lista
    try{
      await fs.promises.writeFile(this.fileName, nuevaLista) // Save file JSON
      console.log('El archivo fue guardado con éxito.');
      
    }
    catch (error){
      console.log(error)
    }
  }

  async getById(id) { // Get product by id
    await this.getAll();
    try {
      const objetoId = this.data.find((dat) => dat.id == id); // Search object id
      if (objetoId) {
        console.log("El objeto con el id", id, "es", objetoId);
        return objetoId;
      }
    } catch (error) {
      return null;
    }
  }

  async getAll() { //Get all productos
    try {
      const data = await fs.promises.readFile(this.fileName, "utf-8");
      if (data) {
        this.data = JSON.parse(data); // Data to object
        this.data.map((producto) => {
          if (this.id < producto.id) this.id = producto.id; // Nax id in the file
        });
        return this.data;
      }
    } catch (error) {
      return;
    }
  }

  async deleteById(id) { //Delete product by id
    try {
      const data = await fs.promises.readFile(this.fileName, "utf-8");
      if (data) {
        this.data = JSON.parse(data); // Data to object
        // New array without the object with the id
        const objetoSinId = this.data.filter((dat) => dat.id != id);
        // Save the new array in the file
        await fs.promises.writeFile(
          this.fileName,
          JSON.stringify(objetoSinId, null, 2)
        );
        console.log(`El producto con el id ${id} fue eliminado.`);
        return id
      }
    } catch (error) {
      console.log(error)
    }
  }

  async deleteAll() { // Delete all
    this.data = [];
    try {
      await fs.promises.writeFile(
        this.fileName,
        JSON.stringify(this.data, null, 2)
      );
      return console.log("Se borraron todos los objetos del archivo");
    } catch (error) {
      console.log(error);
    }
  }

  async updateById(id, newProduct) {
    // Busco qué posición en el array de productos tiene el producto con el id buscado
    // Tiene que ser doble == ya que solo necesito comparar el valor y no el tipo
    let lista = await this.getAll();
    
    // FindIndex toma todos los elementos de la lista y comparara el id del producto con el id del parámetro
    const index = lista.findIndex(product => product.id == id);

    // Uso let ya que va a sufrir cambios la variable
    // Los corchetes buscan el orden dentro del array
    let producto = lista[index];

    try {
      if (producto) {
        //Desestructuración del nuevo producto
        const { title, price, thumbnail } = newProduct;

        //Actualizo los datos
        producto.title = title;
        producto.price = price;
        producto.thumbnail = thumbnail;

        //Inserto el producto modificado en la lista
        lista[index] = producto;

        const nuevaListaJson = JSON.stringify(lista , null, 2);
        await this.saveList(nuevaListaJson)

        return producto

      }
    }
    catch  {
      return null;
    }
  }
}


//Productos
// let p1 = {
//   title: "Heladera",
//   price: 80000,
//   thumbnail: "https://imgur.com/GkEYT7d",
// };

// let p2 = {
//   title: "Lavarropas",
//   price: 60000,
//   thumbnail: "https://imgur.com/RRNmknL",
// };
// let p3 = {
//   title: "Microondas",
//   price: 40000,
//   thumbnail: "https://imgur.com/gSBY8op",
// };

// let p4 = {
//   title: "Televisor",
//   price: 70000,
//   thumbnail: "https://imgur.com/oCD5WBs",
// };

async function allFunctionsContenedor() {
  // await objetoContenedor.save(p1);
  // await objetoContenedor.save(p2);
  // await objetoContenedor.save(p3);
  // await objetoContenedor.save(p4);
  // await objetoContenedor.getAll();
  //await objetoContenedor.getById(3);
  //await objetoContenedor.deleteById(5);
  //await objetoContenedor.deleteAll();
}

//const objetoContenedor = new Contenedor("productos.json");

allFunctionsContenedor();

module.exports = Contenedor;
