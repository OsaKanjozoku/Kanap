//on crée une variable pour pouvoir récupérer l'id de chaque canapé sur sa page spécifique
let params = (new URL(document.location)).searchParams;
let id = params.get("id");

//on se connecte à l'API pour pouvoir en récupérer les infos
fetch("http://localhost:3000/api/products/" + id)

  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function (product) {
    leKanap(product);
  }
  )
  .catch(function (err) {
    console.log(err);
  })

// Fonction affichage produit sur la page produits propre à chaque canapé
function leKanap(canape) {

  let imgAlt = document.querySelector("article div.item__img");
  let name = document.querySelector("#title");
  let price = document.querySelector("#price");
  let description = document.querySelector("#description");
  let colors = document.querySelector("#colors");


  imgAlt.insertAdjacentHTML('afterbegin', `<img src="${canape.imageUrl}" 
                            alt="${canape.altTxt}">`);
  name.insertAdjacentHTML('afterbegin', `${canape.name}`);
  price.insertAdjacentHTML('afterbegin', `${canape.price}`);
  description.insertAdjacentHTML('afterbegin', `${canape.description}`);
  for (let color of canape.colors) {
    colors.insertAdjacentHTML('beforeend', `<option value=${color}>${color}</option>`);
  }
};

//Déclaration objet canap pour ajout au panier
let canap = {
  _id: id,
  color: "",
  quantity: 0,
};

//EventListener sur les choix quantité et couleur pour pouvoir récupérer la bonne valeur à ajouter au localStorage
// et appel de la fonction d'ajout
let choixCouleur = document.getElementById("colors");
choixCouleur.addEventListener("input", (couleur) => {
  choixCouleur = couleur.target.value;
  canap.color = choixCouleur;
  document.querySelector("#addToCart").style.color = "white";
  document.querySelector("#addToCart").textContent = "Ajouter au panier";
});

let choixQuantite = document.getElementById("quantity");
choixQuantite.addEventListener('input', (quantite) => {
  choixQuantite = parseInt(quantite.target.value);
  canap.quantity = choixQuantite;
  document.querySelector("#addToCart").style.color = "white";
  document.querySelector("#addToCart").textContent = "Ajouter au panier";
});



let AddToCart = document.getElementById("addToCart");
AddToCart.addEventListener("click", () => {
  if (canap.color === "" || canap.color === undefined || canap.quantity < 1 || canap.quantity > 100 || canap.quantity === undefined) {
    alert("Veuillez choisir une quantité comprise entre 1 et 100 et une couleur pour ajouter votre produit");
  } else {
    AjoutProduitPanier();
  }
});




//Fonction pour ajouter un nouveau produit ou modifier un produit déjà ajouté
function AjoutProduitPanier() {
  var existingKanap = JSON.parse(localStorage.getItem("allKanaps"));
  if (existingKanap == null) {
    existingKanap = [];
  }
  //On vérifie si l'id existe déjà dans le localStorage
  const matchId = existingKanap.some(element => {
    if (element._id === id) {
      return true;
    }
    return false;
  });

  //On vérifie si la couleur existe déjà dans le localStorage
  const matchColor = existingKanap.some(element => {
    if (element.color === choixCouleur) {
      return true;
    }
    return false;
  });
  //On récupère l'index dans le localStorage qui nous permettra d'en modifer la valeur de quantité
  const searchMatching = existingKanap.findIndex(element => {
    if (element._id === id && element.color === choixCouleur) {
      return true;
    }

    return false;
  });



  //On vérifié si l'id et la couleur du canapé choisit est déjà stockée dans le localStorage
  //Si id et couleur sont déjà stocké, alors on modifie la quantité déjà existante
  if (matchId && matchColor) {
    if (searchMatching !== -1) {
      existingKanap[searchMatching].quantity = existingKanap[searchMatching].quantity + choixQuantite;
      localStorage.setItem("allKanaps", JSON.stringify(existingKanap));
      document.getElementById("addToCart").innerHTML = `Quantité modifée !`;
      document.getElementById("addToCart").style.color = "rgb(0, 205, 0)";
      document.getElementById("colors").value = "";
    }
  } else {
    //Si la couleur et l'id sont inconnus, alors on crée un nouvel élément dans le tableau de canapés
    if (existingKanap == null) existingKanap = [];
    existingKanap.push(canap);
    localStorage.setItem("allKanaps", JSON.stringify(existingKanap));
    document.querySelector("#addToCart").style.color = "rgb(0, 205, 0)";
    document.querySelector("#addToCart").textContent = "Produit ajouté !";
    document.getElementById("colors").value = "";
  }
};







