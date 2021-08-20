//NO ESTA EN USO

// eslint-disable-next-line no-unused-vars
const send = (e) => {
  e.preventDefault();

  const titulo = document.getElementById("title").value;
  const precio = document.getElementById("price").value;
  const imgurl = document.getElementById("thumbnail").value;

  const data = {
    title: titulo,
    price: precio,
    thumbnail: imgurl,
  };

  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data) /*Lo paso a JSON */,
  };

  fetch("/api/productos", options)
    .then((res) => res.json())
    .then((data) =>
      alert(
        "Nuevo producto agregado: \n Título: " +
          JSON.stringify(data.title) +
          "\n Precio: $" +
          data.price +
          "\n ID: " +
          data.id
      )
    )
    .then(() => {
      document.getElementById("title").value = "";
      document.getElementById("price").value = "";
      document.getElementById("thumbnail").value = "";
    })
    .catch((error) => console.log(error));
};
