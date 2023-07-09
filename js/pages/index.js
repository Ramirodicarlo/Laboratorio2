const apiKey = 'c5cf220c3980a9c45b681058e8e0c55f';
let currentPage = 1;
let totalPages = 1;

function displayMovies(page){
  const contenedorPeliculas = document.getElementById('contenedorPeliculas');
  contenedorPeliculas.innerHTML = ''; // Limpiar el contenido anterior

  fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=popularity.desc&page=${page}`)
    .then(response => response.json())
    .then(data => {
      const movies = data.results;
      totalPages = data.total_pages;

      movies.forEach(movie => {
        const seccionCartelera = document.createElement('div');
        seccionCartelera.className = 'seccion_cartelera';

        const img = document.createElement('img');
        img.className = 'cartelera';
        img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        img.alt = '';

        const title = document.createElement('h3');
        title.textContent = movie.title;

        const detalles = document.createElement('p');
        detalles.innerHTML = `Código: ${movie.id}<br>
                              Título original: ${movie.original_title}<br>
                              Idioma original: ${movie.original_language}<br>
                              Año: ${movie.release_date}`;

        const button = document.createElement('button');
        button.className = 'agregar_favoritos';
        button.textContent = 'Agregar a favoritos';
        button.id = movie.id
        button.onclick = () => agregarFavorito(movie.id);;

        seccionCartelera.appendChild(img);
        seccionCartelera.appendChild(title);
        seccionCartelera.appendChild(detalles);
        seccionCartelera.appendChild(button);
        contenedorPeliculas.appendChild(seccionCartelera);
        
        });
    })
    .catch(error => {
      console.error('Error:', error);
    });
    function agregarFavorito(id) {
      let local = [];
      let localData = localStorage.getItem("Favoritos");

      if (localData !== null) {
          local = JSON.parse(localData);
      }
  
      let nuevo = id;
      let control = true;
  
      if (!Array.isArray(local)) {
          local = [];
      }
  
      for (let i = 0; i < local.length; i++) {
        if (local[i] == nuevo) {
            control = false;
            break;
        }
      }
  
      if (control) {
        try {
            local.push(nuevo);
            let msj = document.getElementById("sec-messages");
            localStorage.setItem("Favoritos", JSON.stringify(local));
            msj.innerHTML = '<p class="verde">¡Película agregada con éxito!</p>';

        } catch (error) {
            let msj = document.getElementById("sec-messages");
            msj.innerHTML = '<p class="rojo">Hubo un error al agregar la película a favoritos. Por favor, inténtalo nuevamente más tarde.</p>';
            console.error('Error al agregar a favoritos:', error);
        }
      } 
      else {
        let msj = document.getElementById("sec-messages");
        msj.innerHTML = '<p class="amarillo">La película ingresada ya se encuentra almacenada</p>';
      }
    }      
  };
function agregarCodigo(){
  let local = [];
  let localData = localStorage.getItem("Favoritos");

  if (localData !== null) {
      local = JSON.parse(localData);
  }

  let nuevo = Number(document.getElementById("codigo").value);
  let control = true;

  if (!Array.isArray(local)) {
      local = [];
  }

  for (let i = 0; i < local.length; i++) {
    if (local[i] == nuevo) {
        control = false;
        break;
    }
  }

  if (control && nuevo!= 0) {
    try {
        local.push(nuevo);
        let msj = document.getElementById("sec-messages");
        localStorage.setItem("Favoritos", JSON.stringify(local));
        msj.innerHTML = '<p class="verde">¡Película agregada con éxito!</p>';

    } catch (error) {
        let msj = document.getElementById("sec-messages");
        msj.innerHTML = '<p class="rojo">Hubo un error al agregar la película a favoritos. Por favor, inténtalo nuevamente más tarde.</p>';
        console.error('Error al agregar a favoritos:', error);
    }
  } 
  else {
    let msj = document.getElementById("sec-messages");
    msj.innerHTML = '<p class="amarillo">La película ingresada ya se encuentra almacenada o no es valida</p>';
  }

}

function updatePagination() {
  const paginacionElement = document.getElementById('paginacion');
  paginacionElement.innerHTML = '';

  const btnAnterior = document.createElement('button');
  btnAnterior.className = 'btnpaginacion';
  btnAnterior.id = 'btnAnterior';
  btnAnterior.textContent = 'Anterior';
  btnAnterior.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      displayMovies(currentPage);
      updatePagination();
    }
  });
  paginacionElement.appendChild(btnAnterior);

  const btnSiguiente = document.createElement('button');
  btnSiguiente.className = 'btnpaginacion';
  btnSiguiente.id = 'btnSiguiente';
  btnSiguiente.textContent = 'Siguiente';
  btnSiguiente.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      displayMovies(currentPage);
      updatePagination();
    }
  });
  paginacionElement.appendChild(btnSiguiente);
}

displayMovies(currentPage);
updatePagination();