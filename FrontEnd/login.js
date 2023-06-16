
async function login(){
    const loginForm = document.querySelector(".loginForm")

        loginForm.addEventListener("submit", async (event) =>{
        // on empeche le rechargement de la page avec preventdefault
        event.preventDefault();
        // on récupère les données du formulaire dans une constante
        const formData = {
            email: event.target.querySelector("[name=email]").value,
            password: event.target.querySelector("[name=password]").value,  
        }

        // convertir l'email et le password en objet JSON 
        const chargeUtile = JSON.stringify(formData)
        // envois requête post à l'API  
        fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {"Content-Type": 'application/json'},
            body: chargeUtile,
        })
        .then(response => response.json())
        .then(data => {
        // si la réponse contient un token donc l'authentification est réussi alors on stock les données dans le localStorage 
        // et on renvois l'utilisateur sur la page index.html
        if(data.token){
            localStorage.setItem("token", data.token)
            window.location.href = "index.html"
            }else{
                alert("les informations utilisateur / mot de passe ne sont pas correctes.")
                }
   
    })
})
}

login ()