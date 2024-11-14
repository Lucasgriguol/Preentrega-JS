// Datos de los productos
const productos = [
    {
        nombre: "La iniquidad",
        descripcion: "¿Qué es iniquidad? - El conflicto entre las dos simientes - Las Moradas de iniquidad - Operación y Manifestación de la iniquidad.",
        precio: 7400,
        imagen: "./recursos/la iniquidad.webp"
    },
    {
        nombre: "Sentados en lugares celestiales",
        descripcion: "Este es un libro de Reforma que lo llevará a entender el Gobierno de Dios y Su poder.",
        precio: 7700,
        imagen: "./recursos/lugares celestiales.webp"
    },
    {
        nombre: "La llave maestra de Dios",
        descripcion: "Este libro está lleno de respuestas para vencer la adversidad tanto emocional, física, como también financiera.",
        precio: 7100,
        imagen: "./recursos/llave maestra.webp"
    },
    {
        nombre: "Hijos del trueno",
        descripcion: "Alrededor del mundo, el Espíritu Santo está despertando el espíritu de miles de niños y niñas, introduciéndolos en un mover sobrenatural.",
        precio: 6500,
        imagen: "./recursos/trueno.webp"
    },
    {
        nombre: "Ayuno cuántico",
        descripcion: "Ayuno y cuántico; la combinación de ambos, te llevará al entendimiento del mundo invisible de Dios.",
        precio: 6800,
        imagen: "./recursos/ayuno.webp"
    },
    {
        nombre: "Sansón, la historia se repite",
        descripcion: "Los tiempos finales de la iglesia muestran una asombrosa similitud con la historia que relata la vida de Sansón.",
        precio: 7000,
        imagen: "./recursos/sanson.webp"
    }
];

// Cargar carrito de localStorage si existe
let carrito = JSON.parse(localStorage.getItem('carrito')) || {};
let total = 0;  // Variable para el total del carrito

// Mostrar los productos en el DOM
function mostrarProductos(productosFiltrados) {
    const contenedorLibros = document.querySelector('.contenedorlibro');
    
    // Limpiar el contenedor antes de mostrar productos nuevos
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

// Función de búsqueda
document.getElementById('search').addEventListener('input', function (event) {
    const searchTerm = event.target.value.toLowerCase();
    const productosFiltrados = productos.filter(producto => producto.nombre.toLowerCase().includes(searchTerm));
    
    // Guardar término de búsqueda en localStorage
    localStorage.setItem('searchTerm', searchTerm);

    mostrarProductos(productosFiltrados);  // Mostrar productos filtrados
});

// Recuperar el término de búsqueda de localStorage y mostrar productos
document.addEventListener('DOMContentLoaded', () => {
    const searchTerm = localStorage.getItem('searchTerm') || '';
    document.getElementById('search').value = searchTerm;

    const productosFiltrados = productos.filter(producto => producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()));
    mostrarProductos(productosFiltrados);
    actualizarCarrito();  // Asegurarnos de que el carrito se actualice
});

// Crear carrito si no existe
function crearCarrito() {
    if (!document.getElementById('cart')) {
        const cart = document.createElement('div');
        cart.id = 'cart';
        cart.className = 'carrito';

        const cartContent = document.createElement('div');
        cartContent.className = 'cart-content';

        // Crear y agregar la X para cerrar el carrito
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
        checkoutButton.onclick = checkout;
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

// Mostrar carrito
function mostrarCarrito() {
    document.getElementById('cart').style.right = '0';
    document.getElementById('cart-background').classList.add('visible');
}

// Ocultar carrito
function cerrarCarrito() {
    document.getElementById('cart').style.right = '-400px';
    document.getElementById('cart-background').classList.remove('visible');
}

// Agregar al carrito
function agregarAlCarrito(producto, precio) {
    crearCarrito();

    if (carrito[producto]) {
        carrito[producto].cantidad += 1;
    } else {
        carrito[producto] = { precio, cantidad: 1 };
    }

    actualizarCarrito();
    mostrarCarrito();
}

// Actualizar carrito en el DOM
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

// Eliminar producto del carrito
function eliminarProducto(producto, cantidad) {
    if (carrito[producto]) {
        carrito[producto].cantidad -= cantidad;

        if (carrito[producto].cantidad <= 0) {
            delete carrito[producto];
        }

        actualizarCarrito();
    }
}

// Eliminar todo del carrito
function eliminarTodo() {
    carrito = {};
    localStorage.removeItem('carrito');
    actualizarCarrito();
}

// Función de checkout
function checkout() {
    alert('¡Gracias por tu compra!');
    eliminarTodo();
}