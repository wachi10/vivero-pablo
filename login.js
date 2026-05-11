const LOGIN_URL = 'https://vivero-backend-adsr.onrender.com/api/usuarios/login'
const formLogin = document.getElementById('form-login')

formLogin.addEventListener('submit', async (e) => {
    e.preventDefault()

    const correo = document.getElementById('correo').value
    const password = document.getElementById('password').value

    try {
        const respuesta = await axios.post(LOGIN_URL, {
            correo,
            password
        })

        const token = respuesta.data.token
        const usuario = respuesta.data.usuario

        localStorage.setItem('token', token)
        localStorage.setItem('rol', usuario.rol)
        localStorage.setItem('nombre', usuario.nombre)

        if (usuario.rol === 'admin') {
            window.location.href = 'admin.html'
        } else {
            window.location.href = 'usuario.html'
        }

    } catch (error) {
        alert('Correo o contraseña incorrectos')
        console.error(error)
    }
})