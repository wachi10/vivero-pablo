const REGISTRO_URL = 'https://vivero-backend-adsr.onrender.com/api/usuarios/registro'

const formRegistro = document.getElementById('form-registro')

formRegistro.addEventListener('submit', async (e) => {
    e.preventDefault()

    const nuevoUsuario = {
        nombre: document.getElementById('nombre').value,
        correo: document.getElementById('correo').value,
        password: document.getElementById('password').value
    }

    try {
        await axios.post(REGISTRO_URL, nuevoUsuario)

        alert('Usuario registrado correctamente. Ahora inicia sesión.')
        window.location.href = 'login.html'

    } catch (error) {
        console.error(error)
        alert('No se pudo registrar el usuario. Puede que el correo ya exista.')
    }
})