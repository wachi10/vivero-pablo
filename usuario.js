const token = localStorage.getItem('token')
const rol = localStorage.getItem('rol')

if (!token || rol !== 'usuario') {
    window.location.href = 'login.html'
}

const API_URL = 'https://vivero-backend-adsr.onrender.com/api/plantas'
const MSJ_URL = 'https://vivero-backend-adsr.onrender.com/api/mensajes'

const obtenerPlantas = async () => {
    try {
        const res = await axios.get(API_URL)
        renderizarPlantas(res.data)
    } catch (error) {
        console.error("Error al obtener plantas:", error)
    }
}

const renderizarPlantas = (plantas) => {
    const contCactus = document.getElementById('contenedor-cactus')
    const contInterior = document.getElementById('contenedor-interior')
    const contExterior = document.getElementById('contenedor-exterior')

    contCactus.innerHTML = ''
    contInterior.innerHTML = ''
    contExterior.innerHTML = ''

    plantas.forEach(planta => {
        const cardHTML = `
            <div class="tarjeta-plantas">
                <div class="card h-100">
                    <img src="${planta.url}" class="card-img-top" alt="${planta.nombre}">
                    <div class="card-body">
                        <p class="card-text mb-0">${planta.nombre}</p>
                        <div class="d-flex justify-content-between align-items-center">
                             <span class="text-success fw-bold">$${planta.precio || '0'}</span>
                        </div>
                    </div>
                </div>
            </div>
        `

        if (planta.categoria === 'Cactus') {
            contCactus.innerHTML += cardHTML
        } else if (planta.categoria === 'Interior') {
            contInterior.innerHTML += cardHTML
        } else if (planta.categoria === 'Exterior') {
            contExterior.innerHTML += cardHTML
        }
    })
}


const formContacto = document.getElementById('form-contacto')

if (formContacto) {
    formContacto.addEventListener('submit', async (e) => {
        e.preventDefault()

        const nuevoMensaje = {
            nombre: document.getElementById('nombre').value,
            correo: document.getElementById('email').value,
            telefono: document.getElementById('telefono').value,
            mensaje: document.getElementById('mensaje').value
        }

        try {
            const respuesta = await axios.post(MSJ_URL, nuevoMensaje)
            if (respuesta.status === 201 || respuesta.status === 200) {
                alert('¡Mensaje enviado con éxito!')
                formContacto.reset()
            }
        } catch (error) {
            console.error('Error al enviar:', error)
            alert('No se pudo enviar el mensaje.')
        }
    })
}


obtenerPlantas()

function cerrarSesion() {
    localStorage.removeItem('token')
    localStorage.removeItem('rol')
    localStorage.removeItem('nombre')

    window.location.href = 'index.html'
}