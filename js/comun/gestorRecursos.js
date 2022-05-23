import { Audio } from "../clases/Audio.js";

export const GestorRecursos = iniciarRecursos();

/**
 * Inicia el manejador de recursos
 * @returns {Object} Objeto literal que permite gestionar los recursos
 */
function iniciarRecursos(){
    const imagenes = ["baraja.png", "dorso.png", "decorador.png", "decorador-boton.png", "logo.png", "menu.png", "madera.jpg"];
    const sonidos = ["boton.mp3", "carta.mp3"];
    const imagenesCargadas = [];
    const sonidosCargados = [];
    let cantidadImagenesCargadas = 0;
    let cantidadSonidosCargados = 0;

    return {
        /**
         * Permite precargar los recursos de imagenes y audio
         * @param {Function} callback Se ejecuta una vez finalizada la carga
         */
        cargar: function(callback){
            for(let i=0; i<imagenes.length; i++){
                const imagen = new Image();
                imagen.src = "imagenes/" + imagenes[i];
                imagenesCargadas.push(imagen);
        
                imagenesCargadas[i].addEventListener("load", function(e){
                    cantidadImagenesCargadas++;
                    if(cantidadImagenesCargadas === imagenes.length){
                        cargarSonidos();
                    }
                });
            }

            /**
             * Permite precargar los sonidos
             */
            function cargarSonidos(){
                for(let i=0; i<sonidos.length; i++){
                    const audio = new Audio(sonidos[i]);

                    sonidosCargados.push({
                        audio: audio,
                        nombre: audio.obtenerNombre()
                    });
            
                    sonidosCargados[i].audio.obtenerSonido().addEventListener("canplaythrough", function(e){
                        cantidadSonidosCargados++;
                        if(cantidadSonidosCargados === sonidos.length){
                            callback();
                        }
                    });
                }
            }
        },

        /**
         * Obtiene el audio específico
         * @param {String} nombre El nombre con extensión del sonido
         * @returns {Audio} El audio previamente cargado
         */
        obtenerAudio: function(nombre){
            for(let i=0; i<sonidosCargados.length; i++){
                if(sonidosCargados[i].nombre === nombre){
                    return sonidosCargados[i].audio;
                }
            }
            return null;
        }
    }
}
