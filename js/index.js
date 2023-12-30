document.addEventListener("DOMContentLoaded", function () {

    class Cafe {
        constructor(nombre, precio, img) {
            this.nombre = nombre;
            this.precio = precio;
            this.img = img;
        }
    }

    const contenedorCafes = document.getElementById("contenedorCafes");
    const listaPedidos = document.getElementById("listaPedidos");
    const carrito = document.getElementById("carrito");
    const totalElement = document.getElementById("total");

    const cerrarCarrito = document.createElement("button");
    cerrarCarrito.textContent = "Cerrar Carrito";
    cerrarCarrito.className = "btn btn-danger cerrar-carrito";
    cerrarCarrito.addEventListener("click", () => {
        limpiarCarrito();
        carrito.style.display = "none";
    });

    let total = 0;

    // Hacer una solicitud AJAX para obtener los datos de los cafés desde el archivo JSON
    fetch("cafes.json")
        .then(response => response.json())
        .then(data => {
            // Procesar los datos JSON y crear objetos Café
            const ArrayCafes = data.map(cafe => new Cafe(cafe.nombre, cafe.precio, cafe.img));

            // Mostrar los cafés en el contenedor
            ArrayCafes.forEach(cafe => {
                let div = document.createElement("div");
                div.className = "col-md-3 m-3";
                div.innerHTML = `
                    <div class="card" style="width: 18rem;">
                        <img src="${cafe.img}" class="card-img-top" alt="...">
                        <div class="card-body">
                            <h5 class="card-title">${cafe.nombre}</h5>
                            <p class="card-text">$${cafe.precio}</p>
                            <button class="btn btn-primary ordenar-btn">Ordenar</button>
                        </div>
                    </div>
                `;

                contenedorCafes.appendChild(div);

                const btnOrdenar = div.querySelector('.ordenar-btn');
                btnOrdenar.addEventListener('click', function () {
                    ordenarCafe(cafe.nombre, cafe.precio);
                });
            });
        })
        .catch(error => console.error("Error al cargar los datos:", error));

    function ordenarCafe(nombre, precio) {
        const pedido = {
            nombre: nombre,
            precio: precio
        };

        agregarAlCarrito(pedido);
        total += pedido.precio;
        actualizarTotal();
        mostrarCarrito();
    }

    function agregarAlCarrito(pedido) {
        const li = document.createElement("li");
        li.textContent = `${pedido.nombre} - $${pedido.precio}`;
        listaPedidos.appendChild(li);
    }

    function mostrarCarrito() {
        const botonesCerrarCarrito = carrito.getElementsByClassName("cerrar-carrito");
        if (botonesCerrarCarrito.length === 0) {
            carrito.appendChild(cerrarCarrito);
        }
        carrito.style.display = "block";
    }

    function actualizarTotal() {
        totalElement.textContent = `Total: $${total.toFixed(2)}`;
    }

    function limpiarCarrito() {
        while (listaPedidos.firstChild) {
            listaPedidos.removeChild(listaPedidos.firstChild);
        }
        total = 0;
        actualizarTotal();
    }
});