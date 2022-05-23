export const UI = iniciarUI();

/**
 * Inicia la interfaz de usuario permitiendo acceder a los elementos HTML
 * @returns {Object} Objeto literal con sus propiedades y métodos
 */
function iniciarUI(){          
    const $pantallas = document.getElementsByClassName("pantalla"),
        $fondoPopups = document.getElementById("fondo-popups"),
        $fondoOscuro = document.getElementById("fondo-oscuro"),
        $popups = document.querySelectorAll("#fondo-popups .popup"),
        $botoneraAccion = document.querySelectorAll("#acciones .accion");
    let persona;
    let npc;
    let eventoAccion;
    let habilitada = false;

    return {
        cartasNPC: document.getElementById("cartas-npc"),
        cartasPer: document.getElementById("cartas-per"),
        contenedorMazo: document.getElementsByClassName("contenedor-mazo"),
        mesaNPC: document.querySelectorAll("#mesa .npc > div"),
        mesaPer: document.querySelectorAll("#mesa .per > div"),
        botonA15: document.getElementById("b-a15"),
        botonA30: document.getElementById("b-a30"),
        botonSonido: document.getElementById("b-sonido"),
        botonContinuar: document.getElementById("b-continuar"),
        juego: document.getElementById("juego"),
        acciones: document.getElementById("acciones"),
        totalPuntos: document.getElementById("total"),
        tableroPer: document.querySelector("#yo .tablero-puntos span"),
        tableroNPC: document.querySelector("#el .tablero-puntos span"),
        popupRespuesta: document.querySelector("#popup-respuesta .contenido-popup"),
        botonCerrarPuntos: document.querySelector("#popup-puntos .contenido-popup button"),
        botonCerrarFin: document.querySelector("#popup-fin .contenido-popup button"),
        botonSonido: document.getElementById("b-sonido"),
        cargandoRecursos: document.getElementById("cargando-recursos"),
        contenedorGeneral: document.getElementById("contenedor-general"),
        anchoContenedor: 358,
        altoContenedor: 530,

        /**
         * Permite saber si la UI está habilitada para interactuar
         * @returns {Boolean} true si está habilitada o false en caso contrario
         */
        habilitada(){
            return habilitada;
        },

        /**
         * Habilita la UI
         */
        habilitar(){
            habilitada = true;
        },

        /**
         * Deshabilita la UI
         */
        deshabilitar(){
            habilitada = false;
        },

        /**
         * Establece ambos jugadores
         * @param {Persona} jugadorPersona La persona
         * @param {NPC} jugadorNPC el NPC
         */
        establecerJugadores: function(jugadorPersona, jugadorNPC){
            persona = jugadorPersona;
            npc = jugadorNPC;
        },

        /**
         * Establece el evento personalizado de accion realizada
         * @param {Event} evento El evento
         */
        establecerEventoAccion(evento){
            eventoAccion = evento;
        },

        /**
         * Activa el botón para ir al mazo
         */
        activarBotonMazo: function(){
            const botones = document.querySelectorAll(`#acciones .b-irmazo`);

            for(let i=0; i<botones.length; i++){
                botones[i].removeAttribute("disabled");
            }
        },

        /**
         * Desactiva el botón para ir al mazo
         */
        desactivarBotonMazo: function(){
            const botones = document.querySelectorAll(`#acciones .b-irmazo`);

            for(let i=0; i<botones.length; i++){
                botones[i].setAttribute("disabled", "");
            }
        },

        /**
         * Activa el botón de envido específico
         * @param {String} nombre El nombre del botón
         */
        activarBotonEnvido: function(nombre){
            document.querySelector(`#cantar-envido .${nombre}`).removeAttribute("disabled");
            document.querySelector(`#contestar-envido .${nombre}`).removeAttribute("disabled");
        },

        /**
         * Activa el botón de falta envido
         * @param {String} nombre El nombre del botón
         */
        activarBotonFaltaEnvido: function(nombre){
            document.querySelector(`#contestar-envido .${nombre}`).removeAttribute("disabled");
        },

        /**
         * Desactiva el botón de envido específico
         * @param {String} nombre El nombre del botón
         */
        desactivarBotonEnvido: function(nombre){
            document.querySelector(`#cantar-envido .${nombre}`).setAttribute("disabled", "");
            document.querySelector(`#contestar-envido .${nombre}`).setAttribute("disabled", "");
        },

        /**
         * Activa el botón quiero del envido
         * @param {String} nombre El nombre del botón
         */
        activarBotonQuiero: function(nombre){
            document.querySelector(`#contestar-envido .${nombre}`).removeAttribute("disabled");
        },

        /**
         * Desactiva el botón quiero del envido
         * @param {String} nombre El nombre del botón
         */
        desactivarBotonQuiero: function(nombre){
            document.querySelector(`#contestar-envido .${nombre}`).setAttribute("disabled", "");
        },

        /**
         * Activa el botón truco
         * @param {String} nombre El nombre del botón
         */
        activarBotonTruco: function(nombre){
            document.querySelector(`#cantar-truco .${nombre}`).removeAttribute("disabled");
            document.querySelector(`#contestar-truco .${nombre}`).removeAttribute("disabled");
        },

        /**
         * Desactiva el botón truco
         * @param {String} nombre El nombre del botón
         */
        desactivarBotonTruco: function(nombre){
            document.querySelector(`#cantar-truco .${nombre}`).setAttribute("disabled", "");
            document.querySelector(`#contestar-truco .${nombre}`).setAttribute("disabled", "");
        },

        /**
         * Activa el botón quiero del truco
         * @param {String} nombre El nombre del botón
         */
        activarBotonQuieroTruco: function(nombre){
            document.querySelector(`#contestar-truco .${nombre}`).removeAttribute("disabled");
        },

        /**
         * Desactiva el botón quiero del truco
         * @param {String} nombre El nombre del botón
         */
        desactivarBotonQuieroTruco: function(nombre){
            document.querySelector(`#contestar-truco .${nombre}`).setAttribute("disabled", "");
        },

        /**
         * Bloquea la botonera visible
         */
        bloquearBotonesAccion: function(){
            const $botonesAccion = document.querySelectorAll(".accion.visible button:not(.b-irmazo)");

            for(let i=0; i<$botonesAccion.length; i++){
                $botonesAccion[i].setAttribute("disabled", "");
            }
        },

        /**
         * Desbloquea la botonera visible
         */
        desbloquearBotonesAccion(){
            const $botonesAccion = document.querySelectorAll(".accion.visible button");

            for(let i=0; i<$botonesAccion.length; i++){
                $botonesAccion[i].removeAttribute("disabled");
            }
        },

        /**
         * Muestra una pantalla específica
         * @param {String} id El atributo id de la etiqueta HTML
         */
        mostrarPantalla: function(id){
            for(let i=0; i<$pantallas.length; i++){
                if($pantallas[i].classList.contains("visible")){
                    $pantallas[i].classList.remove("visible");
                    break;
                }
            }

            document.getElementById(id).classList.add("visible");
        },

        /**
         * Muestra la botonera con sus acciones
         * @param {String} id El atributo id de la etiqueta HTML
         */
        mostrarBotoneraAccion: function(id){
            for(let i=0; i<$botoneraAccion.length; i++){
                if($botoneraAccion[i].classList.contains("visible")){
                    $botoneraAccion[i].classList.remove("visible");
                    break;
                }
            }

            document.getElementById(id).classList.add("visible");
        },

        /**
         * Abre un popup
         * @param {String} id El atributo id del elemento HTML
         * @param {String} mensaje El mensaje a mostrar
         */
        abrirPopup: function(id, mensaje){
            for(let i=0; i<$popups.length; i++){
                if($popups[i].classList.contains("visible")){
                    $popups[i].classList.remove("visible");
                    break;
                }
            }

            $fondoPopups.classList.add("visible");
            document.querySelector(`#${id} .contenido-popup > span`).innerHTML = mensaje;
            document.getElementById(id).classList.add("visible");
            $fondoOscuro.style.display = "block";
            this.cambiarOpacidad(0.2);
        },

        /**
         * Cierra el popup visible
         */
        cerrarPopup: function(){
            $fondoPopups.classList.remove("visible");
            $fondoOscuro.style.display = "none";
            this.cambiarOpacidad(1);
        },

        /**
         * Cambia la opacidad de los elementos cuando se abre o cierra un popup
         * @param {Number} opacidad El valor de opacidad
         */
        cambiarOpacidad: function(opacidad){
            const elementos = document.querySelectorAll("#contenedor-general > div:not(#fondo-popups)");

            for(let i=0; i<elementos.length; i++){
                elementos[i].style.opacity = opacidad;
            }
        }
    }
}
