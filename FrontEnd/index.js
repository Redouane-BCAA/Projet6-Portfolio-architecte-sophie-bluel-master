// Appel travaux depuis API et le return "works" représente les travaux
async function appelTravaux() {
    const response = await fetch("http://localhost:5678/api/works")
    const works = await response.json()
    console.log(works)
    return works
}


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
    filtersContainer.appendChild(allbtn)


    // création des buttons dans une boucle en fonction des catégorie 
    for (let i = 0; i < categories.length; i++) {
        let categoriesBtn = document.createElement("button")
        categoriesBtn.innerText = categories[i]
        categoriesBtn.classList.add("btn")
        filtersContainer.appendChild(categoriesBtn)
        // Fonction qui permet le filtrage lors des selection des buttons
        // categoriesBtn.addEventListener("click" , () => {
        //     if( category === "Tous"){
        //         affichageTravaux(works)
        //     }
        //     else {
        //         affichageTravaux(works.filter(works => works.category.name === category))
        //     }
        // })
    }
}


// Appel des travaux et affichage dans la gallery final 

async function AffichageFinal() {
    // on veut récupérer la liste des works
    const works = await appelTravaux()
    // on veut afficher la liste des works dans la page
    affichageTravaux(works)
    filters(works)
}

AffichageFinal()
