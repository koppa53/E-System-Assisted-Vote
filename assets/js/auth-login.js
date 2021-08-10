
async function login() {
    try {
        const usrnm = document.getElementById('username').value
        const pass = document.getElementById('password').value
        const response = await fetch('http://localhost:5000/vote_assist_user_login', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: usrnm,
                password: pass
            })
        });
        const data = await response.json();
        if (response.ok) {
            sessionStorage.setItem("First Name", data.name[0])
            sessionStorage.setItem("Last Name", data.name[1])
            sessionStorage.setItem("User ID", data.name[2])
            sessionStorage.setItem("College", data.name[3])
            sessionStorage.setItem("Token", data.token)
            window.location.href = "index.html";
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: data.message,
            })
        }
    } catch (error) {
        console.log(error)
    }
}