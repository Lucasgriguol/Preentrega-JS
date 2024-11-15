// Datos de los libros
const productos = [
    { nombre: "La iniquidad", descripcion: "¿Qué es iniquidad?", precio: 7400, imagen: "./recursos/la iniquidad.webp" },
    { nombre: "Sentados en lugares celestiales", descripcion: "Este es un libro de Reforma", precio: 7700, imagen: "./recursos/lugares celestiales.webp" },
    { nombre: "La llave maestra de Dios", descripcion: "Este libro está lleno de respuestas", precio: 7100, imagen: "./recursos/llave maestra.webp" },
    { nombre: "Hijos del trueno", descripcion: "El Espíritu Santo está despertando el espíritu", precio: 6500, imagen: "./recursos/trueno.webp" },
    { nombre: "Ayuno cuántico", descripcion: "Ayuno y cuántico combinados", precio: 6800, imagen: "./recursos/ayuno.webp" },
    { nombre: "Sansón, la historia se repite", descripcion: "Los tiempos finales muestran similitudes", precio: 7000, imagen: "./recursos/sanson.webp" }
];

let carrito = JSON.parse(localStorage.getItem('carrito')) || {};
let total = 0;
let formularioPagoVisible = false; // Para controlar la visibilidad del formulario de pago

// Barra de búsqueda
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

    // Evento para filtrar productos
    inputSearch.addEventListener('input', (event) => {
        const searchTerm = event.target.value.toLowerCase();
        localStorage.setItem('searchTerm', searchTerm);
        const productosFiltrados = productos.filter(producto =>
            producto.nombre.toLowerCase().includes(searchTerm)
        );
        mostrarProductos(productosFiltrados);
    });

    // Para cargar el término de busqueda guardado en localStorage
    const searchTerm = localStorage.getItem('searchTerm') || '';
    inputSearch.value = searchTerm;
    const productosFiltrados = productos.filter(producto =>
        producto.nombre.toLowerCase().includes(searchTerm)
    );
    mostrarProductos(productosFiltrados);
}

// Muestra los productos en la página
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

// Crear el carrito
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

    // Abrir el carrito si no está visible
    document.getElementById('cart').style.right = '0'; // Muestra el carrito
    document.getElementById('cart-background').classList.add('visible');
}

// Actualiza el carrito
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

    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Eliminar todo el carrito
function eliminarTodo() {
    carrito = {};
    localStorage.removeItem('carrito');
    actualizarCarrito();
}

// Eliminar producto del carrito
function eliminarProducto(producto, cantidad) {
    if (carrito[producto]) {
        carrito[producto].cantidad -= cantidad;
        if (carrito[producto].cantidad <= 0) {
            delete carrito[producto];
        }
    }
    actualizarCarrito();
}

// Cierra el carrito
function cerrarCarrito() {
    document.getElementById('cart').style.right = '-400px';
    document.getElementById('cart-background').classList.remove('visible');
}

function mostrarFormularioPago() {
    if (formularioPagoVisible) {
        return; // Si el formulario ya está visible, no hacemos nada
    }

    formularioPagoVisible = true;

    const cart = document.getElementById('cart');
    const cartContent = cart.querySelector('.cart-content');

    // Obtener el botón de checkout y ocultarlo
    const checkoutButton = cartContent.querySelector('.checkout');
    checkoutButton.style.display = 'none';  // Esto oculta el botón

    // Crear el formulario de pago
    const formulario = document.createElement('form');
    formulario.id = 'payment-form';

    // Nombre completo
    const nombreInput = document.createElement('input');
    nombreInput.type = 'text';
    nombreInput.name = 'nombre';
    nombreInput.placeholder = 'Nombre completo';
    formulario.appendChild(nombreInput);

    // Número de tarjeta
    const tarjetaInput = document.createElement('input');
    tarjetaInput.type = 'text';
    tarjetaInput.name = 'tarjeta';
    tarjetaInput.placeholder = 'Número de tarjeta';
    tarjetaInput.maxLength = '16'; // Limitar a 16 caracteres (para tarjetas típicas)
    formulario.appendChild(tarjetaInput);

    // Fecha de vencimiento
    const fechaInput = document.createElement('input');
    fechaInput.type = 'text';
    fechaInput.name = 'fecha';
    fechaInput.placeholder = 'MM/AA (Fecha de vencimiento)';
    formulario.appendChild(fechaInput);

    // Código de seguridad (CVV)
    const cvvInput = document.createElement('input');
    cvvInput.type = 'text';
    cvvInput.name = 'cvv';
    cvvInput.placeholder = 'Código de seguridad (CVV)';
    cvvInput.maxLength = '3'; // Limitar a 3 dígitos para el CVV
    formulario.appendChild(cvvInput);

    // Crear un botón para procesar el pago
    const pagoButton = document.createElement('button');
    pagoButton.type = 'submit';
    pagoButton.textContent = 'Pagar ahora';
    formulario.appendChild(pagoButton);

    // Añadir el formulario al carrito
    cartContent.appendChild(formulario);

    // Crear un div para los mensajes de validación (error o éxito)
    const mensajeDiv = document.createElement('div');
    mensajeDiv.id = 'mensaje-validacion';
    cartContent.appendChild(mensajeDiv);

    // Cargar datos previos desde localStorage (si existen)
    const datosGuardados = JSON.parse(localStorage.getItem('datosTarjeta')) || {};
    if (datosGuardados.nombre) {
        nombreInput.value = datosGuardados.nombre;
    }
    if (datosGuardados.fecha) {
        fechaInput.value = datosGuardados.fecha;
    }

    // Agregar un evento al enviar el formulario
    formulario.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevenir el envío del formulario para realizar validación

        // Limpiar mensaje de validación anterior
        mensajeDiv.innerHTML = '';

        const nombre = nombreInput.value.trim();
        const tarjeta = tarjetaInput.value.trim();
        const fecha = fechaInput.value.trim();
        const cvv = cvvInput.value.trim();

        // Validar el nombre
        if (!nombre) {
            mensajeDiv.textContent = 'Por favor, ingrese su nombre completo.';
            mensajeDiv.style.color = 'red'; // Mostrar el mensaje en rojo (error)
            return;
        }

        // Validar número de tarjeta (solo números y 16 dígitos)
        const tarjetaRegex = /^\d{16}$/;
        if (!tarjetaRegex.test(tarjeta)) {
            mensajeDiv.textContent = 'El número de tarjeta debe tener 16 dígitos.';
            mensajeDiv.style.color = 'red'; // Mostrar el mensaje en rojo (error)
            return;
        }

        // Validar fecha de vencimiento (MM/AA)
        const fechaRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
        if (!fechaRegex.test(fecha)) {
            mensajeDiv.textContent = 'La fecha de vencimiento debe tener el formato MM/AA.';
            mensajeDiv.style.color = 'red'; // Mostrar el mensaje en rojo (error)
            return;
        }

        // Validar el CVV (3 dígitos)
        const cvvRegex = /^\d{3}$/;
        if (!cvvRegex.test(cvv)) {
            mensajeDiv.textContent = 'El código de seguridad (CVV) debe tener 3 dígitos.';
            mensajeDiv.style.color = 'red'; // Mostrar el mensaje en rojo (error)
            return;
        }

        // Si todo es válido, mostrar mensaje de éxito y vaciar carrito
        mensajeDiv.textContent = 'Datos correctos. ¡Gracias por tu compra!';
        mensajeDiv.style.color = 'green'; // Mostrar el mensaje en verde (éxito)

        // Guardar los datos de la tarjeta (sin número ni CVV)
        const datosParaGuardar = {
            nombre: nombre,
            fecha: fecha
        };
        localStorage.setItem('datosTarjeta', JSON.stringify(datosParaGuardar)); // Guardamos los datos

        // Eliminar todos los productos del carrito
        carrito = {}; // Vaciar el carrito
        localStorage.removeItem('carrito'); // Eliminar el carrito del localStorage
        actualizarCarrito(); // Actualizar la vista del carrito para reflejar que está vacío

        // Opcionalmente, puedes esconder el formulario y mostrar un mensaje final de confirmación
        formulario.style.display = 'none'; // Ocultamos el formulario de pago
        checkoutButton.style.display = 'block'; // Mostramos el botón de checkout nuevamente
    });
}


// Iniciar la barra de búsqueda
crearBarraBusqueda();
