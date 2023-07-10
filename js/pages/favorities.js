const API_KEY = '7065bc28cfacd8886e291178a580ce61';

document.addEventListener('DOMContentLoaded', mostrarPeliculasFavoritas);

// Función para mostrar las películas favoritas
async function mostrarPeliculasFavoritas() {
  const favoritesList = document.getElementById('sec-favorities-list');
  const template = document.getElementById('movie-card-template');

  // Obtener las películas favoritas almacenadas en localStorage
  let favoritos = localStorage.getItem('Favoritos');
  favoritos = JSON.parse(favoritos);
  // favoritesList.innerHTML = ''; // Limpiar la lista de películas favoritas
  if ( 0 == favoritos) {
    mostrarMensajeInfo('No tienes películas seleccionadas.');
  }
  // Recorrer las películas favoritas
  for (let i = 0; i < favoritos.length; i++) {
    const codigoPelicula = favoritos[i];

    try {
      // Consultar el detalle de la película desde la API
      const response = await fetch(`https://api.themoviedb.org/3/movie/${codigoPelicula}?api_key=${API_KEY}&language=es-MX`);
      if (!response.ok) {
        throw new Error('Error en la consulta a la API.');
      }

      const pelicula = await response.json();

      // Crear una copia de la plantilla de tarjeta de película
      const movieCard = template.content.cloneNode(true);

      // Rellenar los datos de la tarjeta de película con la información obtenida
      const contenedorPeliculas = movieCard.querySelector('.movie-card');
      contenedorPeliculas.id = pelicula.id;
      const posterElement = movieCard.querySelector('.poster');
      const tituloElement = movieCard.querySelector('.titulo');
      const codigoElement = movieCard.querySelector('.codigo');
      const tituloOriginalElement = movieCard.querySelector('.titulo-original');
      const idiomaOriginalElement = movieCard.querySelector('.idioma-original');
      const resumenElement = movieCard.querySelector('.resumen');
      const removeButton = movieCard.querySelector('.remove-favorite-button');
      posterElement.src = `https://image.tmdb.org/t/p/w500/${pelicula.poster_path}`;
      tituloElement.textContent = pelicula.title;
      codigoElement.textContent = pelicula.id;
      tituloOriginalElement.textContent = pelicula.original_title;
      idiomaOriginalElement.textContent = pelicula.original_language;
      resumenElement.textContent = pelicula.overview;
      
      const videoFavorito = await fetch(`https://api.themoviedb.org/3/movie/${pelicula.id}/videos?api_key=${API_KEY}`);
      if (videoFavorito.ok) {
        const videosData = await videoFavorito.json();
        if (videosData.results && videosData.results.length > 0) {
          const videoKey = videosData.results[0].key;
          const videoElement = movieCard.querySelector('.video');
          videoElement.src = `https://www.youtube.com/embed/${videoKey}`;
        }
      }
      // Agregar el evento click al botón de "Quitar de favoritos"
      removeButton.addEventListener('click', () => {
        quitarPeliculaDeFavoritos(codigoPelicula);
        document.getElementById(codigoPelicula).remove(); 
      });
      // Agregar la tarjeta de película a la lista de favoritos
      favoritesList.appendChild(movieCard);
    } catch (error) {
      mostrarMensajeError('Se produjo un error al cargar la información de las películas.');
      console.error(error);
    }
  }
}

// Función para quitar una película de la lista de favoritos
function quitarPeliculaDeFavoritos(codigoPelicula) {
  let favoritos = localStorage.getItem('Favoritos');
  if (!favoritos) {
    return;
  }

  favoritos = JSON.parse(favoritos);

  const index = favoritos.indexOf(codigoPelicula);
  if (index !== -1) {
    favoritos.splice(index, 1);
    localStorage.setItem('Favoritos', JSON.stringify(favoritos));
    mostrarMensajeExito('Película eliminada de favoritos.');
  }
  if ( 0 == favoritos) {
    mostrarMensajeInfo('No tienes películas seleccionadas.');
  }
}

function mostrarMensajeInfo(mensaje) {
  const messages = document.getElementById('sec-messages');
  messages.innerHTML = '<p class="amarillo">' + mensaje + '</p>';
}

function mostrarMensajeExito(mensaje) {
  const messages = document.getElementById('sec-messages');
  messages.innerHTML = '<p class="verde">' + mensaje + '</p>';
}

function mostrarMensajeError(mensaje) {
  const messages = document.getElementById('sec-messages');
  messages.innerHTML = '<p class="rojo">' + mensaje + '</p>';
}
