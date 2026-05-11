const rol = localStorage.getItem('rol')
const token = localStorage.getItem('token')

if (rol !== 'admin') {
    alert('Acceso denegado')
    window.location.href = 'login.html'
}

const API_URL = 'https://vivero-backend-adsr.onrender.com/api/plantas'
const MSJ_URL = 'https://vivero-backend-adsr.onrender.com/api/mensajes'
const form = document.getElementById('form-planta')
let editandoId = null


const obtenerPlantas = async () => {
    try {
        const res = await axios.get(API_URL)
        renderizarPlantas(res.data)
    } catch (error) {
        console.error("Error al obtener plantas:", error)
    }
}

const renderizarPlantas = (plantas) => {
    const contenedores = {
        'Cactus': document.getElementById('contenedor-cactus'),
        'Interior': document.getElementById('contenedor-interior'),
        'Exterior': document.getElementById('contenedor-exterior')
    }

    Object.values(contenedores).forEach(c => c.innerHTML = '')

    plantas.forEach(planta => {
        const cardHTML = `
            <div class="tarjeta-plantas">
                <div class="card h-100">
                    <img src="${planta.url}" class="card-img-top" alt="${planta.nombre}">
                    <div class="card-body">
                        <p class="card-text mb-0">${planta.nombre}</p>
                        <div class="d-flex justify-content-between align-items-center mt-2">
                            <span class="text-success fw-bold">$${planta.precio || '0'}</span>
                            <div>
                                <button class="btn btn-sm btn-outline-primary me-1" onclick="prepararEdicion('${planta._id}', '${planta.nombre}', '${planta.precio}', '${planta.categoria}', '${planta.url}')">
                                    <i class="fa-solid fa-pen"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-danger" onclick="eliminarPlanta('${planta._id}')">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `

        if (contenedores[planta.categoria]) {
            contenedores[planta.categoria].innerHTML += cardHTML
        }
    })
}


window.prepararEdicion = (id, nombre, precio, categoria, url) => {
    document.getElementById('p-nombre').value = nombre
    document.getElementById('p-precio').value = precio
    document.getElementById('p-categoria').value = categoria
    document.getElementById('p-url').value = url

    editandoId = id

    form.querySelector('button').classList.replace('btn-success', 'btn-warning')
    form.querySelector('button').innerHTML = '<i class="fa-solid fa-sync"></i> Actualizar Planta'

    window.scrollTo(0, 0)
}


form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const datosPlanta = {
        nombre: document.getElementById('p-nombre').value,
        precio: document.getElementById('p-precio').value,
        categoria: document.getElementById('p-categoria').value,
        url: document.getElementById('p-url').value
    }

    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    try {
        if (editandoId) {
            await axios.put(`${API_URL}/${editandoId}`, datosPlanta, config);

            alert('¡Planta actualizada!')

            editandoId = null;
            form.querySelector('button').classList.replace('btn-warning', 'btn-success')
            form.querySelector('button').innerHTML = '<i class="fa-solid fa-check"></i> Guardar en Inventario'
        } else {
            await axios.post(API_URL, datosPlanta, config)

            alert('¡Planta guardada!')
        }

        form.reset()
        obtenerPlantas()

    } catch (error) {
        console.error(error)
        alert('Error en la operación')
    }
})


const eliminarPlanta = async (id) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    if (confirm('¿Eliminar esta planta?')) {
        try {
            await axios.delete(`${API_URL}/${id}`, config)
            obtenerPlantas()
        } catch (error) {
            console.error(error)
            alert('Error al eliminar la planta')
        }
    }
}

const obtenerMensajes = async () => {
    try {
        const res = await axios.get(MSJ_URL, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        renderizarMensajes(res.data)

    } catch (error) {
        console.error('Error al obtener mensajes:', error)
    }
}

const renderizarMensajes = (mensajes) => {
    const contenedor = document.getElementById('contenedor-mensajes')

    if (!contenedor) return

    contenedor.innerHTML = ''

    mensajes.forEach(mensaje => {
        const mensajeHTML = `
            <div class="col-12 col-md-6 col-lg-4">
                <div class="card shadow-sm h-100">
                    <div class="card-body">
                        <h5 class="card-title">${mensaje.nombre}</h5>
                        <p class="mb-1"><strong>Correo:</strong> ${mensaje.correo}</p>
                        <p class="mb-1"><strong>Teléfono:</strong> ${mensaje.telefono}</p>
                        <p class="mt-3">${mensaje.mensaje}</p>
                    </div>
                </div>
            </div>
        `

        contenedor.innerHTML += mensajeHTML
    })
}

obtenerPlantas()
obtenerMensajes()

function cerrarSesion() {
    localStorage.removeItem('token')
    localStorage.removeItem('rol')
    localStorage.removeItem('nombre')

    window.location.href = 'index.html'
}