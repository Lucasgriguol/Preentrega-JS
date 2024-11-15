// Datos de los productos
const productos = [
    { nombre: "La iniquidad", descripcion: "¿Qué es iniquidad?", precio: 7400, imagen: "./recursos/la iniquidad.webp" },
    { nombre: "Sentados en lugares celestiales", descripcion: "Este es un libro de Reforma", precio: 7700, imagen: "./recursos/lugares celestiales.webp" },
    { nombre: "La llave maestra de Dios", descripcion: "Este libro está lleno de respuestas", precio: 7100, imagen: "./recursos/llave maestra.webp" },
    { nombre: "Hijos del trueno", descripcion: "El Espíritu Santo está despertando el espíritu", precio: 6500, imagen: "./recursos/trueno.webp" },
    { nombre: "Ayuno cuántico", descripcion: "Ayuno y cuántico combinados", precio: 6800, imagen: "./recursos/ayuno.webp" },
    { nombre: "Sansón, la historia se repite", descripcion: "Los tiempos finales muestran similitudes", precio: 7000, imagen: "./recursos/sanson.webp" }
];

let carrito = JSON.parse(localStorage.getItem('carrito')) || {};  // Cargar el carrito desde localStorage
let total = 0;
let formularioPagoVisible = false;  // Controla si el formulario de pago está visible

// Crear la barra de búsqueda y mostrarla en el DOM
function crearBarraBusqueda() {
    const header = document.querySelector('header');
    
    const searchContainer = document.createElement('div');
    searchContainer.classList.add('search-container');

    const inputSearch = document.createElement('input');
    inputSearch.type = 'text';
    inputSearch.id = 'search';
    inputSearch.placeholder = 'Buscar...';

    searchContainer.appendChild(inputSearch);
    header.appendChild(searchContainer);

    // Agregar evento para filtrar productos
    inputSearch.addEventListener('input', (event) => {
        const searchTerm = event.target.value.toLowerCase();
        localStorage.setItem('searchTerm', searchTerm);
        const productosFiltrados = productos.filter(producto =>
            producto.nombre.toLowerCase().includes(searchTerm)
        );
        mostrarProductos(productosFiltrados);
    });

    // Cargar término de búsqueda guardado en localStorage
    const searchTerm = localStorage.getItem('searchTerm') || '';
    inputSearch.value = searchTerm;
    const productosFiltrados = productos.filter(producto =>
        producto.nombre.toLowerCase().includes(searchTerm)
    );
    mostrarProductos(productosFiltrados);
}

// Mostrar productos en la página
function mostrarProductos(productosFiltrados) {
    const contenedorLibros = document.querySelector('.contenedorlibro');
    contenedorLibros.innerHTML = '';
    if (productosFiltrados.length === 0) {
        contenedorLibros.innerHTML = '<p>No se encontraron productos.</p>';
        return;
    }
    productosFiltrados.forEach(producto => {
        const divCard = document.createElement('div');
        divCard.classList.add('card');

        const img = document.createElement('img');
        img.src = producto.imagen;
        img.alt = producto.nombre;

        const h3 = document.createElement('h3');
        h3.textContent = producto.nombre;

        const p = document.createElement('p');
        p.textContent = producto.descripcion;

        const h4 = document.createElement('h4');
        h4.textContent = `$${producto.precio}`;

        const button = document.createElement('button');
        button.classList.add('add-to-cart');
        button.textContent = 'Agregar al carrito';
        button.setAttribute('data-producto', producto.nombre);
        button.setAttribute('data-precio', producto.precio);

        // Evento para agregar al carrito
        button.addEventListener('click', function () {
            agregarAlCarrito(producto.nombre, producto.precio);
        });

        divCard.appendChild(img);
        divCard.appendChild(h3);
        divCard.appendChild(p);
        divCard.appendChild(h4);
        divCard.appendChild(button);

        contenedorLibros.appendChild(divCard);
    });
}

// Crear carrito en el DOM
function crearCarrito() {
    if (!document.getElementById('cart')) {
        const cart = document.createElement('div');
        cart.id = 'cart';
        cart.className = 'carrito';

        const cartContent = document.createElement('div');
        cartContent.className = 'cart-content';

        const closeButton = document.createElement('button');
        closeButton.className = 'cerrarCarrito';
        closeButton.textContent = 'X';
        closeButton.onclick = cerrarCarrito;
        cartContent.appendChild(closeButton);

        const cartTitle = document.createElement('h2');
        cartTitle.textContent = 'Carrito';
        cartTitle.style.color = 'white';
        cartContent.appendChild(cartTitle);

        const cartList = document.createElement('ul');
        cartList.id = 'cart-items';
        cartContent.appendChild(cartList);

        const checkoutButton = document.createElement('button');
        checkoutButton.className = 'checkout';
        checkoutButton.textContent = 'Ir al checkout';
        checkoutButton.onclick = mostrarFormularioPago;
        cartContent.appendChild(checkoutButton);

        const totalElement = document.createElement('div');
        totalElement.className = 'total';
        totalElement.id = 'total-price';
        totalElement.textContent = 'Total: $0';
        cartContent.appendChild(totalElement);

        const clearButton = document.createElement('button');
        clearButton.className = 'clear-cart';
        clearButton.textContent = 'Eliminar todo';
        clearButton.onclick = eliminarTodo;
        cartContent.appendChild(clearButton);

        cart.appendChild(cartContent);
        document.body.appendChild(cart);

        const overlay = document.createElement('div');
        overlay.id = 'cart-background';
        overlay.className = 'carrito-background';
        overlay.onclick = cerrarCarrito;
        document.body.appendChild(overlay);
    }
}

// Agregar productos al carrito
function agregarAlCarrito(producto, precio) {
    crearCarrito();

    if (carrito[producto]) {
        carrito[producto].cantidad += 1;
    } else {
        carrito[producto] = { precio, cantidad: 1 };
    }

    actualizarCarrito();
    localStorage.setItem('carrito', JSON.stringify(carrito)); // Guardar carrito en localStorage
}

// Función para actualizar el carrito en el DOM
function actualizarCarrito() {
    const cartItems = document.getElementById('cart-items');
    const totalPrice = document.getElementById('total-price');

    cartItems.innerHTML = '';
    total = 0;

    for (let producto in carrito) {
        const item = carrito[producto];
        const li = document.createElement('li');
        li.textContent = `${producto} - $${item.precio} x ${item.cantidad}`;

        const eliminarUnoButton = document.createElement('button');
        eliminarUnoButton.textContent = 'Eliminar uno';
        eliminarUnoButton.onclick = function () {
            eliminarProducto(producto, 1);
        };

        const eliminarTodoButton = document.createElement('button');
        eliminarTodoButton.textContent = 'Eliminar todo';
        eliminarTodoButton.onclick = function () {
            eliminarProducto(producto, item.cantidad);
        };

        li.appendChild(eliminarUnoButton);
        li.appendChild(eliminarTodoButton);
        cartItems.appendChild(li);

        total += item.precio * item.cantidad;
    }

    totalPrice.textContent = `Total: $${total.toFixed(2)}`;

    // Guardar carrito en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Eliminar todo del carrito
function eliminarTodo() {
    carrito = {};
    localStorage.removeItem('carrito');
    actualizarCarrito();
}

// Cerrar el carrito
function cerrarCarrito() {
    document.getElementById('cart').style.right = '-400px';
    document.getElementById('cart-background').classList.remove('visible');
}

// Cargar la barra de búsqueda al inicio
crearBarraBusqueda();