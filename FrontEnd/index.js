// Appel travaux depuis API et le return "works" représente les travaux
async function appelTravaux() {
    const response = await fetch("http://localhost:5678/api/works")
    const works = await response.json()
    console.log(works)
    return works
}
appelTravaux()

// Function qui affiche les travaux dans la gallery DOM 
function affichageTravaux(works) {
    for (let i = 0; i < works.length; i++) {
        const projet = works[i];
        const divGallery = document.querySelector(".gallery")

        // création balise figure qui represente un projet
        const projetElement = document.createElement("figure")

        // création des éléments des figure (img et le titre) et assignation des sources
        const projetImage = document.createElement("img")
        projetImage.src = projet.imageUrl

        const projetTitle = document.createElement("figcaption")
        projetTitle.innerText = projet.title

        // rattaché les éléments à leurs parents 
        divGallery.appendChild(projetElement)
        projetElement.appendChild(projetImage)
        projetElement.appendChild(projetTitle)
    }
}

function filters (works) { 
    // on récupère le nom des catégories depuis l'api dans la varible categoriesName
    let categoriesName = works.map(works => works.category.name)
    console.log(categoriesName)
    
    // on supprime les doublons avec set
    let categories = [...new Set(categoriesName)]
    console.log(categories)
    
    // Partie création des boutons filtres
    const filtersContainer = document.querySelector(".filters-container")

    // Button tous qui affichera tout les projets test + parent
    const allbtn = document.createElement("button")
    allbtn.innerText = "Tous"
    // ajout class btn pour css plus tard
    allbtn.classList.add("btn")
    allbtn.classList.add("active")
    filtersContainer.appendChild(allbtn)


    // création des buttons dans une boucle en fonction des catégorie 
    for (let i = 0; i < categories.length; i++) {

        let categoriesBtn = document.createElement("button")
        categoriesBtn.innerText = categories[i]
        categoriesBtn.classList.add("btn")
        filtersContainer.appendChild(categoriesBtn)
    }

    // partie qui permet le filtrage lors des selection des buttons
    // On selectionne tout les boutons qui on la classe btn
    const btns = document.querySelectorAll(".btn")
    // on ajoute un event listener sur les boutons
    btns.forEach(btn => {
        btn.addEventListener("click", () => {
            // VIDEr LA GALERIE avant
            const divGallery = document.querySelector(".gallery")
            divGallery.innerHTML = "";

            // test pour que le button reste en font vert une fois click
            btns.forEach(btn => btn.classList.remove("active"))
            btn.classList.add("active")
            ////////////////////////////////////////////////////////////////////

            // on récupère le nom de la catégorie sélectionnée
            let categorieFilter = btn.innerText
            console.log(categorieFilter)

            // on récupère les projets qui correspondent à la catégorie sélectionnée
            let filteredWorks = works.filter(works => works.category.name === categorieFilter)
            console.log(filteredWorks)

            if (categorieFilter === "Tous") {
                filteredWorks = works;
            }
            // on affiche les projets correspondant à la catégorie sélectionnée
            affichageTravaux(filteredWorks)
        })
    })
}

////////////////////Affichage mode editeur///////////////

async function affichageEditeurMode() {
    const loginLink = document.querySelector(".login-link");
    const token = localStorage.getItem("token");
    const editorMode = document.querySelector("#editor-mode");
    const filterBtns = document.querySelectorAll(".btn");
    const editorElements = document.querySelectorAll("#editor-element");

    // on affecte le style display none aux éléments
    editorMode.style.display = "none";
    editorElements.forEach((editorElement) => {
        editorElement.style.display = "none";
    });

    if (token) {
        // on passe en display none les boutons de filtre
        filterBtns.forEach((filterBtn) => {
            filterBtn.style.display = "none";
            
        });

        // on affiche les éléments du mode éditeur en flex
        editorElements.forEach((editorElement) => {
            editorElement.style.display = "flex";
        });

        editorMode.style.display = "flex";
        // si on click sur loginLink on est déconnecté donc on retire le token du local storage et on rechage la parge
        loginLink.textContent ="logout"
        loginLink.addEventListener("click", () => {
            localStorage.removeItem("token");
            window.location.reload();
        })
    }
}

//////////////////MODAL 1 VERSION OPTIMISE///////////////////// 
const modalLink = document.querySelector(".modal-link")

const modal = document.querySelector(".modal")
const modalWrapper = document.querySelector(".modal-wrapper")
const modalClose = document.querySelector(".modal-close")
const modalGallery = document.querySelector(".modal-gallery")
const modalBtn = document.querySelector(".modal-btn")
const trashDelete = document.querySelector(".trash") //icon trash pour supprimer un élément
const deleteGallery = document.querySelector(".delete-gallery")

// function pour afficher la modale quand on click sur le lien qui a la classe modal-link
modalLink.addEventListener("click", async (e) => {
    e.preventDefault()
    e.stopPropagation()
    modal.style.display = "flex"
    // lors de l'ouverture de la modal on récupère les travaux et on affichera dans modalGallery
    modalGallery.innerHTML = ""
    const works = await appelTravaux()
    works.forEach(work => {

        const modalFigure = document.createElement("div")
        modalFigure.classList.add("modal-figure")
        modalGallery.appendChild(modalFigure)

        const trashIcon = document.createElement("i");
        trashIcon.classList.add("fa-solid", "fa-trash-can", "trash", "modif-icon");
        modalFigure.appendChild(trashIcon);

        const arrowIcon = document.createElement("i");
        arrowIcon.classList.add("fa-solid", "fa-arrows-up-down-left-right", "modif-arrow", "modif-icon");
        modalFigure.appendChild(arrowIcon);

        const modalImg = document.createElement("img")
        modalImg.src = work.imageUrl
        modalImg.classList.add("modal-img")
        modalFigure.appendChild(modalImg)

        const modalfigcaption = document.createElement("figcaption")
        modalfigcaption.innerHTML = "éditer"
        modalFigure.appendChild(modalfigcaption)

        trashIcon.addEventListener("click", async (e) => {                   

            e.preventDefault()
            e.stopPropagation()
            const workId = work.id 
            // On fait la requête à l'API
            await fetch(`http://localhost:5678/api/works/${workId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
            })
            .then(response => {
                if (response.ok) {                                     
                    modalFigure.remove()
                     affichageTravaux()
                    console.log("suppression réussie")
                    
                } else {
                    console.log("suppression échouée")
                }
             })
        })
        
    })

})
function hideModal(){
    modal.style.display = "none";
}
modalClose.addEventListener("click", hideModal)
modal.addEventListener("click", hideModal)
modalWrapper.addEventListener("click", (e) => {
    e.stopPropagation();
});
//////////////////////FIN MODAL1 VERSION OPTIMISE/////////////////////////////





// Affichage final 

async function AffichageFinal() {
    console.log("coucou je suis la ")
    // on veut récupérer la liste des works
    const works = await appelTravaux()
    // on veut afficher la liste des works dans la page
    affichageTravaux(works)
    filters(works)
    affichageEditeurMode()
}

AffichageFinal()

