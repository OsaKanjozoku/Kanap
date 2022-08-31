//On se connecte à l'API pour afficher le panier
fetch("http://localhost:3000/api/products")

  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function (product) {
    affichageKanaps(product);
  }
  )
  .catch(function (err) {
    console.log(err);
  })

//On déclare une variable panier pour accéder au localStorage
let panier = JSON.parse(localStorage.getItem("allKanaps"));
//Création d'un message lorsque le panier est vide, avec redirection sur la page d'accueil
let message = `Vous n'avez pas encore ajouté d'articles,<br>
<a href='index.html'>Cliquez ici</a> pour parcourir nos produits!`;

//fonction pour récupérer toutes les informations nécéssaires de chaque élément du panier dans localStorage
function affichageKanaps(index) {



  if (panier && panier.length != 0) {

    for (let choix of panier) {
      for (let i = 0, il = index.length; i < il; i++) {
        if (choix._id === index[i]._id) {

          choix.name = index[i].name;
          choix.prix = index[i].price;
          choix.image = index[i].imageUrl;
          choix.description = index[i].description;
          choix.alt = index[i].altTxt;
        }
      }
    }

    affiche(panier);

  } else {
    document.getElementById("totalQuantity").innerHTML = "0";
    document.getElementById("totalPrice").innerHTML = "0";
    document.querySelector("h1").style.fontSize = "x-large";
    document.querySelector("h1").innerHTML = message;

  }
  modifier();
  Total();
};

//Fonction pour afficher les canapés, en crééant un article pour chaque canapé indexé en incluant ses valeurs respectives
function affiche(panier) {

  let zonePanier = document.getElementById("cart__items");

  zonePanier.innerHTML += panier.map((choix, key) =>
    `<article class="cart__item" data-id="${choix._id}" data-key="${key}" data-couleur="${choix.color}" data-quantité="${choix.quantity}" data-prix="${choix.prix}"> 
      <div class="cart__item__img">
        <img src="${choix.image}" alt="${choix.alt}">
      </div>
      <div class="cart__item__content">
        <div class="cart__item__content__titlePrice">
          <h2>${choix.name}</h2>
          <span>couleur : ${choix.color}</span>
          <p id="prix-${key}" class="prix-addition" data-prix="${choix.prix}">${choix.prix * choix.quantity}€</p>
        </div>
        <div class="cart__item__content__settings">
          <div class="cart__item__content__settings__quantity">
            <p>Qté : </p>
            <input type="number" class="itemQuantity" name="${choix._id}" min="1" max="100" value="${choix.quantity}">
          </div>
          <div class="cart__item__content__settings__delete">
            <p class="deleteItem" data-id="${choix._id}" data-couleur="${choix.couleur}">Supprimer</p>
          </div>
        </div>
      </div>
    </article>`
  )
};

//Modification du panier directement dans la page panier
//On écoute l'input de la quantité et on restocke celle ci dans le panier
function modifier() {
  let Articles = document.getElementsByClassName("cart__item");
  if (Array.from(Articles).length != 0) {
    Array.from(Articles).forEach((article) => {
      let dataKey = article.getAttribute("data-key");
      let deleteItem = article.getElementsByClassName("deleteItem");
      article.addEventListener("input", (quantity) => {
        let nouvelleQuantité = quantity.target.value;
        panier[dataKey].quantity = nouvelleQuantité;
        localStorage.setItem("allKanaps", JSON.stringify(panier));
        let dataPrix = article.getAttribute("data-prix");
        let nouveauPrix = nouvelleQuantité * dataPrix;
        let prix = document.getElementById("prix-" + dataKey);
        prix.innerHTML = nouveauPrix + '€'; //Modification du prix instantanément sans recharger la page 
        //On rappelle la fonction Total pour mettre à jour les quantités et prix totaux en bas du panier
        Total();
      })
      //On écoute le click du texte "Supprimer" et on supprime toutes les quantités du canapé sélectionné
      deleteItem[0].addEventListener("click", () => {
        panier.splice(dataKey, 1);
        localStorage.setItem("allKanaps", JSON.stringify(panier));
        article.remove();
        Total();
        //Si panier vide alors on remet le message comme quoi le panier est vide avec le lien vers la page d'accueil
        if (Array.from(Articles).length === 0) {
          document.querySelector("h1").style.fontSize = "x-large";
          document.querySelector("h1").innerHTML = message;
        }
      })
    })
  }
};

//Fonction qui récupère la quantité séléctionnée et le prix de chaque canapé
//Pour afficher le prix total, on recupère chaque prix de chaque article
//Puis on additionne toutes ces valeurs ensemble
//Exactement pareil pour les quantités, on récupère chacune des quantités indiqués 
//dans l'input (donc celles du localStorage grâce à la focntion modifier) et on les addtionnent toutes
function Total() {
  let totalPrice = 0;
  let totalQuantity = 0;
  panier.forEach((element) => {
    totalQuantity += JSON.parse(element.quantity);
    let quantity = document.getElementById("totalQuantity");
    quantity.innerHTML = totalQuantity;
  })
  let prixElements = document.getElementsByClassName("cart__item");
  if (Array.from(prixElements).length != 0) {
    Array.from(prixElements).forEach((prixElement) => {
      let dataKey = prixElement.getAttribute("data-key");
      let prix = document.getElementById("prix-" + dataKey).textContent;
      totalPrice += parseInt(prix);
      let price = document.getElementById("totalPrice");
      price.innerHTML = totalPrice;
    })
  } else {
    document.querySelector("#totalQuantity").innerHTML = "0";
    document.querySelector("#totalPrice").innerHTML = "0";
  }
};

//Variable permettant de stocker l'id de tous les canapés stockés dans le panier sous forme de tableau 
let IdKanap = [];
//Fonction qui récupère uniquement l'id des canapés stockés et les ajoutent au tableau IdKanap juste au dessus
function getIdKAnaps() {
  if (panier && panier.length > 0) {
    for (let article of panier) {
      IdKanap.push(article._id);
    }
  }
};

//Fonction qui valide ou non le formulaire de commande
//Si le premier input est vide, il ne vérifie pas les autres tant que celui-ci n'est pas validé
//Ensuite, il vérifie le second, le troisième, etc jusquau dernier input, comme ça on ne peut valider que si 
//tous les inputs sont remplis ET valide via les regex
function validationFormulaire() {
  //on cible chaque élément qui va être modifié
  var firstName = document.getElementById("firstName");
  var lastName = document.getElementById("lastName");
  var address = document.getElementById("address");
  var city = document.getElementById("city");
  var email = document.getElementById("email");
  let order = document.getElementById("order");

  //création de regex pour permettre la validation de chaque élément du formulaire suivant l'input séléctionné
  //pour les inputs prénoms, noms, addresse et ville, tous sont limités entre 1 et 30 caractères

  //interdictions de chiffres pour les prénoms, noms et ville
  const verifTexte = /^[a-z-A-Z-áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ-\s-]{1,30}$/;
  //pour les addresses les espace et tiret sont autorisés
  const verifAdress = /^[a-z-A-Z-0-9-áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ-\s-]{1,30}$/;
  //pour le mail il faut respecter le format d'une adresse mail
  //soit des chiffres/lettres suivis d'un @, uniquement des lettres suivies d'un point et uniquement 2 ou 3 lettres
  const verifEMail = /^[a-z0-9-\.-]+@[a-z]+\.[a-z]{2,3}$/;

  //On cible les messages d'erreurs si les regex ne sont pas valides
  let firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
  let lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
  let addressErrorMsg = document.getElementById("addressErrorMsg");
  let cityErrorMsg = document.getElementById("cityErrorMsg");
  let emailErrorMsg = document.getElementById("emailErrorMsg");
  let globalErrorMsg = "* Champ obligatoire."; //création message d'erreur global, si l'input est non rempli


  order.addEventListener("click", (eq) => {
    eq.preventDefault();

    //si firstName est vide ou non définit, alors on empêche de passer à l'input suivant et on affiche le message d'erreur global
    if (firstName.value === "" || firstName.value === null || firstName.value === undefined) {
      firstNameErrorMsg.innerHTML = globalErrorMsg;
    } else {
      //firstName est donc défini, on procède à la vérification par regex de la valeur renseignée
      if (verifTexte.exec(firstName.value) === null) {
        //si la vérification est un échec (par exemple il y a un chiffre) alors on affiche le message d'erreur qui correspond
        //ensuite on passe à l'input lastName, ensuite address, city et enfain on termine par email
        firstNameErrorMsg.innerHTML = "Veuillez renseigner un prénom.";
        return false;
      } else {
        firstNameErrorMsg.innerHTML = "";
        if (lastName.value === "" || lastName.value === null || lastName.value === undefined) {
          lastNameErrorMsg.innerHTML = globalErrorMsg;
        } else {
          if (verifTexte.exec(lastName.value) === null) {
            lastNameErrorMsg.innerHTML = "Veuillez renseigner un nom de famille.";
            return false;
          } else {
            lastNameErrorMsg.innerHTML = "";
            if (address.value === "" || address.value === null || address.value === undefined) {
              addressErrorMsg.innerHTML = globalErrorMsg;
            } else {
              if (verifAdress.exec(address.value) === null) {
                addressErrorMsg.innerHTML = "Veuillez renseigner une adresse.";
                return false;
              } else {
                addressErrorMsg.innerHTML = "";
                if (city.value === "" || city.value === null || city.value === undefined) {
                  cityErrorMsg.innerHTML = globalErrorMsg;
                } else {
                  if (verifTexte.exec(city.value) === null) {
                    cityErrorMsg.innerHTML = "Veuillez renseigner une ville.";
                    return false;
                  } else {
                    cityErrorMsg.innerHTML = "";
                    if (email.value === "" || email.value === null || email.value === undefined) {
                      emailErrorMsg.innerHTML = globalErrorMsg;
                    } else {
                      if (verifEMail.exec(email.value) === null) {
                        emailErrorMsg.innerHTML = "Le format de l'adresse mail est incorrect.";
                        return false;
                      } else {
                        emailErrorMsg.innerHTML = "";
                        //une fois toutes ces vérifications effectuées, on peut valider le formulaire
                        //on peut donc récupérer les id des canapés stockés et créer l'objet contact
                        //suivi du tableau d'id products

                        getIdKAnaps()

                        let commande = {
                          contact: {
                            firstName: firstName.value,
                            lastName: lastName.value,
                            address: address.value,
                            city: city.value,
                            email: email.value,
                          },
                          products: IdKanap,
                        };

                        //le formulaire est valide, l'objet contact est crée, on peut donc se connecter à l'API
                        //afin de rentrer le numéro de commande dans le lien pour le récupérer sur la page confirmation
                        //formulaireValide();
                        fetch("http://localhost:3000/api/products/order", {
                          method: "POST",
                          headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json"
                          },
                          body: JSON.stringify(commande),
                        })

                          .then(function (res) {
                            if (res.ok) {
                              return res.json();
                            }
                          })
                          .then((data) => {
                            // redirection sur la page confirmation, ajout de la valeur data.orderId
                            window.location.href = `/front/html/confirmation.html?commande=${data.orderId}`;
                          })
                          .catch(function (err) {
                            console.log(err);
                          })
                        return true;
                      }
                    };
                  }
                };
              }
            };
          };
        };
      };
    };
  })





};

//on appelle la fonction de validation du formulaire
validationFormulaire();


