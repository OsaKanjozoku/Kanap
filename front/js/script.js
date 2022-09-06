  //on se connecte à l'API pour inclure les produits sur la page d'accueil
  fetch("http://localhost:3000/api/products")

  .then(function(res){
    if(res.ok){
      return res.json();
    }
  })
  .then(function(product){
    //appel de la focntion qui fait le lien entre l'API et l'utilisateur
    getKanaps(product);
    }
  )
  .catch(function(err){
    console.log(err);
  })

  //fonction qui créée un article pour chaque canapé existant dans l'API avec ses valeurs respectives
  function getKanaps(Kanaps){
    let affichageKanap = document.querySelector("#items");
    for (let article  of Kanaps){
      affichageKanap.insertAdjacentHTML('beforeend', `<a href="./product.html?id=${article._id}">
      <article>
        <img src="${article.imageUrl}" alt="${article.altTxt}">
        <h3 class="productName">${article.name}</h3>
        <p class="productDescription">${article.description}</p>
      </article>
    </a>`);
    }
  }
