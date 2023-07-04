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

//////////////////PARTIE MODAL///////////////////// 
const modalLink = document.querySelector(".modal-link")

const divGallery = document.querySelector(".gallery")
const modal = document.querySelector(".modal")
const modalWrapper = document.querySelector(".modal-wrapper")
const modalWrapperGallery = document.querySelector(".modal-wrapper-gallery")
const galleryModalClose = document.querySelector(".gallery-modal-close")
const addModalClose = document.querySelector(".add-modal-close")
const modalGallery = document.querySelector(".modal-gallery")
const galleryBtn = document.querySelector(".modal-gallery-btn")
const trashDelete = document.querySelector(".trash") //icon trash pour supprimer un élément
const deleteGallery = document.querySelector(".delete-gallery")

const modalAddPhoto = document.querySelector(".modal-add-project")
const previousArrow = document.getElementById("previous-arrow")
const divAddImage = document.querySelector(".add-project-image")
const addImageButton = document.querySelector(".add-image-btn")
const uploadForm = document.getElementById("upload-form")
const divProjectImage = modal.querySelector(".add-image");
const modalAddBtn = document.querySelector(".modal-add-btn");


// function qui créer les elements de la modalgallery 
// en appelant les travaux API 
// intègre le trashicon avec la function deleteproject
async function modalGalleryElement() {
    
    const works = await appelTravaux();
    works.forEach(work => {
        const modalFigure = document.createElement("div");
        modalFigure.classList.add("modal-figure");
        modalGallery.appendChild(modalFigure);

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

      // Fonction SUPPRESSION AU CLICK SUR LE TRASHICON
        trashIcon.addEventListener("click", async (e) => {
        // Appel de la fonction de suppression
        deleteProject(work.id, modalFigure);
      });
    });
}

// Function qui supprime les élément en récuperant l'id
function deleteProject(workId, modalFigure) {
    fetch(`http://localhost:5678/api/works/${workId}`, {
        method: "DELETE",
        headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
    })
    .then(response => {
        if (response.ok) {
            // Supprimer l'élément de la modal
            modalFigure.remove();
            // Vider la galerie principale
            divGallery.innerHTML = "";
            // Récupérer les travaux mis à jour depuis l'API
            appelTravaux()
            .then(updatedWorks => {
                affichageTravaux(updatedWorks);
            })
            .catch(error => {
                console.log("Erreur lors de la récupération des travaux :", error);
            });
            console.log("Suppression réussie");
        } else {
            console.log("Échec de la suppression");
        }
    });
}

// function qui reset le formulaire (utlisé après requêtepost)
function resetForm() {
    // on remet les valeur du form par défaut 
    // document.querySelector(".input-file").value = ""
    document.getElementById("title").value = "";
    document.getElementById("category").value = "default";
    divAddImage.innerHTML = ""
    divAddImage.style.display = "none"
    modalAddBtn.classList.remove("modal-add-btn-valide")
}

// Function requête post pour envoyé de nouveau travaux
function sendPictureToAPI() {
    const title = document.getElementById("title").value;
    const category = document.getElementById("category").value;
    const file = document.querySelector(".input-file").files[0]        
    console.log(title, category, file)

    if (title.trim() === "" || category === "default") {
        alert("Veuillez remplir tous les champs et ajouter une image.");
        return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", title);
    formData.append("category", category);

    // Envoi de la requête POST à l'API
    fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,      
        },
        body: formData,
    })
    .then(response => {
        if (response.ok) {
            console.log("Travail envoyé avec succès :");
            resetForm()
        }
    })
}

// affichage de la modale quand on click sur l'élément' qui a la classe modal-link
modalLink.addEventListener("click", async (e) => {
    e.preventDefault()
    // e.stopPropagation()
    modal.style.display = "flex"
    // lors de l'ouverture de la modal on récupère les travaux et on affichera dans modalGallery
    modalGallery.innerHTML = ""
    await modalGalleryElement();

})

// function pour la fermeture des la modal
async function hideModal(){
    modal.style.display = "none";
    modalWrapperGallery.style.display = "block";
    modalAddPhoto.style.display = "none"; 

    divGallery.innerHTML = ""
    const works = await appelTravaux()
    affichageTravaux(works);
}

galleryModalClose.addEventListener("click", hideModal)
addModalClose.addEventListener("click", hideModal)
modal.addEventListener("click", hideModal)

modalWrapperGallery.addEventListener("click", (e) => {
    e.stopPropagation()
  });

modalAddPhoto.addEventListener("click", (e)=>{
    e.stopPropagation()
})

////////////////////////Debut MODAL ADDPHOTO//////////////////////////

// Affichage de la modalAddphoto au click sur le galleryBTN
galleryBtn.addEventListener("click", (e) =>{
    e.preventDefault();
    // e.stopPropagation();
    modalWrapperGallery.style.display = "none";
    modalAddPhoto.style.display = "block";
})

// ajout d'une image au click sur le addImageButton
addImageButton.addEventListener("click", (e) =>{
    e.preventDefault();

    // Supprimer tout les input existant
    const inputFiles = document.querySelectorAll(".input-file");
    inputFiles.forEach((inputFile) => {
        inputFile.parentNode.removeChild(inputFile);
    });

    // création d'un input pour importer une image
    const input = document.createElement("input");
    input.classList.add("input-file")
    input.style.display = "none"
    input.type = "file";
    input.name = "image";
    input.accept = ".jpg, .png";
    uploadForm.appendChild(input)
    input.click();
    // on affiche l'image importer via l'input
    input.addEventListener("change", () => {
        const file = input.files[0];
        console.log(file)

        if (file) {
            const imageFile = document.createElement("img");
            imageFile.src = URL.createObjectURL(file);
            divAddImage.appendChild(imageFile);
            divAddImage.style.display = "block"
        }

        // ecouteru d'evenement sur les input si ils sont remplis le btnaddphoto à une nouvelle class
        const inputTitle = document.getElementById("title");
        const inputCategory = document.getElementById("category");
        const modalAddBtn = document.querySelector(".modal-add-btn");
        
        [inputTitle, inputCategory].forEach((inputchamp) =>{
            inputchamp.addEventListener("input", () => {
                // on vérifie si les champs des input sont remplis
                // on ajoute la class modal-add-btn-valide si les champs sont remplis
                const champsRemplis = inputTitle.value.trim() !== "" && inputCategory.value !== "default";
                if (champsRemplis) {
                    modalAddBtn.classList.add("modal-add-btn-valide");
                } else {
                modalAddBtn.classList.remove("modal-add-btn-valide");
                }
            })
        })
    })
});

// requête post au click sur le modalAddBtn pour envoyé les nouveaux projets
modalAddBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    // e.stopPropagation()
    await sendPictureToAPI()
})

// au click sur previousarrow en revient sur la modal wrapper gallery
previousArrow.addEventListener("click", async (e) =>{
    e.preventDefault();
    modalAddPhoto.style.display = "none";
    modalWrapperGallery.style.display = "";
    // On vide la modalGallery
    modalGallery.innerHTML = "";

    // On récupère les travaux mis à jour depuis l'API
    await modalGalleryElement()

    // On affiche les travaux mis à jour
    affichageTravaux(modalGalleryElement);  
})
////////////////////FIN MODAL ADDPHOTO////////////////////////////


// Affichage final 

async function AffichageFinal() {
    // on veut récupérer la liste des works
    const works = await appelTravaux()
    // on veut afficher la liste des works dans la page
    affichageTravaux(works)
    filters(works)
    affichageEditeurMode()
}

AffichageFinal()
