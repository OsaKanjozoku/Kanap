//création variable permettant l'accès a la récupération de données via le lien
let params = (new URL(document.location)).searchParams;
//on recupère le numléro de commande dans le lien
let numeroCommande = params.get("commande");

//on affiche le numéro de comande pour l'utilisateur dans son encart prévu
let orderId = document.getElementById("orderId");
orderId.innerHTML = "<br><br>" + numeroCommande + "<br><br> Merci et à bientôt sur Kanap !<br><br> <a href='/front/html/index.html'> >>> Retour à l'accueil <<< </a>";
//une fois le numéro de commande affiché, on clear le localStorage afin de repartir sur une nouvelle commande
//si l'utilisateur revient sur la page d'accueil
localStorage.clear();
