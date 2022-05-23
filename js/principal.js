import { Mazo } from "./clases/Mazo.js";
import { Persona } from "./clases/Persona.js";
import { NPC } from "./clases/NPC.js";
import { UI } from "./comun/ui.js";
import { GestorRecursos } from "./comun/gestorRecursos.js";
import { Envido } from "./comun/envido.js";
import { Truco } from "./comun/truco.js";

/**
 * Una vez ejecutado el evento load, se cargan los recursos
 */
window.addEventListener("load", function(e){ 
    UI.cargandoRecursos.style.display = "block";
    GestorRecursos.cargar(iniciar);
});

/**
 * Inicia la aplicación
 */
function iniciar(){
    const mazo = new Mazo();
    const persona = new Persona();
    const npc = new NPC();
    const eventoAccion = new Event("accionRealizada");
    const audioBoton = GestorRecursos.obtenerAudio("boton.mp3");
    const audioCarta = GestorRecursos.obtenerAudio("carta.mp3");
    let envidoAcumulado = { si: 0, no: 0 };
    let trucoAcumulado = { si: 0, no: 0, cantado: false };
    let resultadoParcial = { per: 0, npc: 0 };
    let trucoHabilitado = false;
    let cantosRealizados = [];
    let juegaNPC = { estado: false };
    let estadoJuego = { finRonda: false, fin: false };
    let manejadorReparto = {};
    let repartePer = false;
    let cantoTrucoInicial = false;
    let audioActivado = true;
    let totalPuntos;

    persona.establecerOponente(npc);
    npc.establecerOponente(persona);
    npc.establecerEventoAccion(eventoAccion);
    npc.establecerResultadoParcial(resultadoParcial, trucoAcumulado);
    npc.establecerEstadoJuego(estadoJuego);
    npc.establecerAudioActivado(audioActivado);
    npc.establecerAudioCarta(audioCarta);
    UI.establecerJugadores(persona, npc);
    UI.establecerEventoAccion(eventoAccion);
    Envido.establecerJugadores(persona, npc);
    Envido.establecerEventoAccion(eventoAccion);
    Envido.establecerEstadoJuego(estadoJuego);
    Envido.establecerEnvidoAcumulado(envidoAcumulado);
    Truco.establecerJugadores(persona, npc);
    Truco.establecerEventoAccion(eventoAccion);
    Truco.establecerEstadoJuego(estadoJuego);
    Truco.establecerTrucoAcumulado(trucoAcumulado);
    Truco.establecerJuegaNPC(juegaNPC);
    Truco.establecerManejadorReparto(manejadorReparto);

    UI.cargandoRecursos.style.display = "none";
    UI.mostrarPantalla("menu");

    /**
     * Agrega evento click al botón de sonido
     */
    UI.botonSonido.addEventListener("click", function(e){
        if(audioActivado){
            audioActivado = false;
            UI.botonSonido.textContent = "Activar sonido";
        } else {
            audioActivado = true;
            UI.botonSonido.textContent = "Desactivar sonido";
        }
        npc.establecerAudioActivado(audioActivado);
    });

    /**
     * Agrega evento click al botón continuar
     */
    UI.botonContinuar.addEventListener("click", function(e){
        reproducirAudioBoton();
        UI.mostrarPantalla("juego");
    });

    /**
     * Agrega evento click al botón de a 15
     */
    UI.botonA15.addEventListener("click", function(e){
        reproducirAudioBoton();
        UI.mostrarPantalla("juego");
        comenzarJuego(15);
    });

    /**
     * Agrega evento click al botón a 30
     */
    UI.botonA30.addEventListener("click", function(e){
        reproducirAudioBoton();
        UI.mostrarPantalla("juego");
        comenzarJuego(30);
    });

    /**
     * Agrega evento click al botón cerrar puntos
     */
    UI.botonCerrarPuntos.addEventListener("click", function(e){
        reproducirAudioBoton();
        UI.cerrarPopup();
        UI.mostrarBotoneraAccion("cantar-truco");
        
        if(Envido.obtenerGanador().constructor.name === "Persona"){
            Envido.agregarPuntos(envidoAcumulado.si, persona);
            UI.tableroPer.textContent = persona.obtenerPuntos();
        } else {
            Envido.agregarPuntos(envidoAcumulado.si, npc);
            UI.tableroNPC.textContent = npc.obtenerPuntos();
        }

        npc.verificarFinJuego();
        UI.habilitar();
        document.dispatchEvent(eventoAccion);
    });

    /**
     * Agrega evento click al botón del popup final
     */
    UI.botonCerrarFin.addEventListener("click", function(e){
        reproducirAudioBoton();
        if(UI.botonContinuar.classList.contains("visible")){
            UI.botonContinuar.classList.remove("visible");
        }
        UI.cerrarPopup();
        UI.mostrarPantalla("menu");
    });

    /**
     * Agrega evento click al contenedor juego
     */
    UI.juego.addEventListener("click", function(e){
        if(e.target.classList.contains("b-menu")){ // Muestra el menú inicial
            reproducirAudioBoton();
            UI.mostrarPantalla("menu");
            if(!UI.botonContinuar.classList.contains("visible")){
                UI.botonContinuar.classList.add("visible");
            }
        }
    });

    /**
     * Agrega evento click al contenedor de acciones
     */
    UI.acciones.addEventListener("click", function(e){
        if(e.target.classList.contains("b-quiero") && UI.habilitada()){
            reproducirAudioBoton();
            UI.bloquearBotonesAccion();
            Envido.verificarGanador();
        }
        
        if(e.target.classList.contains("b-noquiero") && UI.habilitada()){
            reproducirAudioBoton();
            Envido.agregarPuntos(envidoAcumulado.no, npc);
            UI.tableroNPC.textContent = npc.obtenerPuntos();
            UI.bloquearBotonesAccion();
            UI.mostrarBotoneraAccion("cantar-truco");
            npc.verificarFinJuego();
            document.dispatchEvent(eventoAccion);
        }

        if(e.target.classList.contains("b-envido") && UI.habilitada()){
            reproducirAudioBoton();
            UI.bloquearBotonesAccion();
            envidoAcumulado.si += 2;
            envidoAcumulado.no += 1; 
            cantosRealizados.push("envido");
            npc.establecerEnvidoCantado(true);
            Envido.responder(false, cantosRealizados, totalPuntos);
        }

        if(e.target.classList.contains("b-real") && UI.habilitada()){
            reproducirAudioBoton();
            UI.bloquearBotonesAccion();
            envidoAcumulado.si += 3;
            envidoAcumulado.no += 1; 
            cantosRealizados.push("real");
            Envido.responder(false, cantosRealizados, totalPuntos);
        }

        if(e.target.classList.contains("b-falta") && UI.habilitada()){
            reproducirAudioBoton();
            UI.bloquearBotonesAccion();
            envidoAcumulado.no += 1;
            cantosRealizados.push("falta");
            Envido.responder(true, cantosRealizados, totalPuntos);
        }

        if(e.target.classList.contains("b-truco") && UI.habilitada()){
            reproducirAudioBoton();
            UI.bloquearBotonesAccion();
            cantoTrucoInicial = true;
            trucoAcumulado.cantado = true;
            trucoAcumulado.si += 2;
            trucoAcumulado.no += 1; 
            npc.establecerTrucoCantado(true);
            npc.incrementarCantoActual();
            Truco.responder();
        }

        if(e.target.classList.contains("b-retruco") && UI.habilitada()){
            reproducirAudioBoton();
            UI.bloquearBotonesAccion();
            trucoAcumulado.si += 1;
            trucoAcumulado.no += 1; 
            npc.establecerTrucoCantado(true);
            npc.incrementarCantoActual();
            Truco.responder();
        }

        if(e.target.classList.contains("b-valecuatro") && UI.habilitada()){
            reproducirAudioBoton();
            UI.bloquearBotonesAccion();
            trucoAcumulado.si += 1;
            trucoAcumulado.no += 1; 
            npc.incrementarCantoActual();
            Truco.responder();
        }

        if(e.target.classList.contains("b-quiero-truco") && UI.habilitada()){
            reproducirAudioBoton();
            UI.bloquearBotonesAccion();

            if(!persona.esTurno()){
                juegaNPC.estado = true;
                document.dispatchEvent(eventoAccion);
            }
        }
        
        if(e.target.classList.contains("b-noquiero-truco") && UI.habilitada()){
            reproducirAudioBoton();
            UI.bloquearBotonesAccion();
            Truco.agregarPuntos(trucoAcumulado.no, npc);
            UI.tableroNPC.textContent = npc.obtenerPuntos();
            manejadorReparto.repartir(false);
        }

        if(e.target.classList.contains("b-irmazo") && UI.habilitada()){
            reproducirAudioBoton();
            UI.bloquearBotonesAccion();
            UI.desactivarBotonMazo();
            if(!npc.obtenerEnvidoCantado() && persona.obtenerJugadaActual() === 0){
                Envido.agregarPuntos(1, npc);
            }
            Truco.agregarPuntos(1, npc);
            UI.tableroNPC.textContent = npc.obtenerPuntos();
            manejadorReparto.repartir(false);
        }
    });

    /**
     * Agrega evento click a las cartas
     */
    UI.cartasPer.addEventListener("click", function(e){
        if(e.target.parentElement.classList.contains("carta") && persona.esTurno() && UI.habilitada()){
            for(let i=0; i< UI.mesaPer.length; i++){
                if(UI.mesaPer[i].children.length === 0){
                    reproducirAudioCarta();
                    const elemento = e.target.parentElement;
                    const idElemento = elemento.dataset.id;
                    UI.mesaPer[i].appendChild(elemento);
                    persona.establecerCartaJugada(persona.obtenerJugadaActual(), persona.obtenerCartaRecibida(idElemento));
                    persona.establecerJugadaActual(persona.obtenerJugadaActual() + 1);
                    persona.eliminarCartaRecibida(idElemento);
                    persona.establecerCartaDOM(elemento);
                    npc.verificarResultado(resultadoParcial, trucoAcumulado);
                    document.dispatchEvent(eventoAccion);
                    break;
                }
            }
        }
    });

    /**
     * Evento personalizado que se dispara cuando se realiza alguna acción
     */
    document.addEventListener("accionRealizada", function(e){
        if(estadoJuego.fin){
            let mensaje;
            UI.deshabilitar();

            if(npc.obtenerPuntos() > persona.obtenerPuntos()){
                mensaje = `<p class="perdedor">Perdiste el partido...</p>
                                Tus puntos: ${persona.obtenerPuntos()}
                                <br>Sus puntos: ${npc.obtenerPuntos()}`;
            } else {
                mensaje = `<p class="ganador">¡Ganaste el partido!</p>
                                Tus puntos: ${persona.obtenerPuntos()}
                                <br>Sus puntos: ${npc.obtenerPuntos()}`;
            }
            
            setTimeout(function(){
                UI.abrirPopup("popup-fin", mensaje);
            }, 1000);
        } else {
            asignarTurno();
        
            if(estadoJuego.finRonda){
                manejadorReparto.repartir(false);
            } else {
                if(persona.esTurno()){
                    activarBotones();
                } else {
                    UI.bloquearBotonesAccion();
                    if(npc.obtenerJugadaActual() === 0){
                        jugarTurnoNPC();
                    } else {
                        npc.jugar(juegaNPC);
                    }
                }
            }
        }
    });

    /**
     * Reproduce el audio de un botón
     */
    function reproducirAudioBoton(){
        if(audioActivado){
            audioBoton.stop();
            audioBoton.play();
        }
    }

    /**
     * Reproduce el audio al arrojar una carta
     */
    function reproducirAudioCarta(){
        if(audioActivado){
            audioCarta.stop();
            audioCarta.play();
        }
    }

    /**
     * Gestiona la activación de los botones
     */
    function activarBotones(){
        if(persona.obtenerJugadaActual() === 0 && (npc.obtenerJugadaActual() === 0 || npc.obtenerJugadaActual() === 1) &&
          !npc.obtenerEnvidoCantado()){
            UI.mostrarBotoneraAccion("cantar-envido");
            UI.desbloquearBotonesAccion();
        }
        else if(trucoHabilitado && npc.obtenerCantoActual() === "si" && !npc.obtenerValeCuatro() && !cantoTrucoInicial){
            UI.mostrarBotoneraAccion("cantar-truco");
            UI.activarBotonTruco("b-truco");
        }
        else if(npc.obtenerCantosTruco() === "retruco"){
            UI.activarBotonTruco("b-retruco");
        }
        else if(npc.obtenerCantosTruco() === "valecuatro" && !npc.obtenerValeCuatro()){
            UI.activarBotonTruco("b-valecuatro");
        } 
    }

    /**
     * Permite que el NPC juegue o cante
     */
    function jugarTurnoNPC(){
        const canto = npc.cantarEnvido();
        
        if(canto === null){
            npc.jugar(juegaNPC);
        } else {
            Envido.cantar(canto, cantosRealizados, totalPuntos);
        }
    }

    /**
     * Gestiona los turnos correspondientes
     */
    function asignarTurno(){
        if(persona.obtenerJugadaActual() > npc.obtenerJugadaActual()){ // Persona ha jugado una carta mas
            persona.establecerTurno(false);
        } else if(persona.obtenerJugadaActual() < npc.obtenerJugadaActual()){ // NPC ha jugado una carta mas
            trucoHabilitado = true;
            persona.establecerTurno(true);
        } else if(persona.obtenerJugadaActual() > 0 && npc.obtenerJugadaActual() > 0) { // Los dos han jugado la misma cantidad de cartas
            trucoHabilitado = true;
            if(persona.obtenerUltimaCartaJugada().obtenerValor() > npc.obtenerUltimaCartaJugada().obtenerValor()){
                persona.establecerTurno(true);
                persona.establecerUltimaJugada(true);
                persona.obtenerCartaDOM().style.zIndex = 1;
                npc.obtenerCartaDOM().style.zIndex = 0;
            } else if(persona.obtenerUltimaCartaJugada().obtenerValor() < npc.obtenerUltimaCartaJugada().obtenerValor()){
                persona.establecerTurno(false);
                persona.establecerUltimaJugada(false);
                persona.obtenerCartaDOM().style.zIndex = 0;
                npc.obtenerCartaDOM().style.zIndex = 1;
            } else if(persona.obtenerUltimaCartaJugada().obtenerValor() === npc.obtenerUltimaCartaJugada().obtenerValor()) { // Si son iguales ver mano
                if(persona.obtenerMano()){
                    persona.establecerTurno(true);
                    persona.establecerUltimaJugada(true);
                    persona.obtenerCartaDOM().style.zIndex = 1;
                    npc.obtenerCartaDOM().style.zIndex = 0;
                } else {
                    persona.establecerTurno(false);
                    persona.establecerUltimaJugada(false);
                    persona.obtenerCartaDOM().style.zIndex = 0;
                    npc.obtenerCartaDOM().style.zIndex = 1;
                }
            }
        }
    }

    /**
     * Inicia el juego
     * @param {Number} puntos El total de puntos del partido
     */
    function comenzarJuego(puntos){
        totalPuntos = puntos;
        repartePer = false;
        UI.totalPuntos.textContent = totalPuntos;
        npc.establecerTotalPuntos(puntos);
        persona.establecerTotalPuntos(puntos);
        npc.establecerPuntos(0);
        persona.establecerPuntos(0);
        UI.tableroPer.textContent = persona.obtenerPuntos();
        UI.tableroNPC.textContent = npc.obtenerPuntos();
        manejadorReparto.repartir(true);
    }

    /**
     * Reestablece el estado de una ronda para comenzar otra
     */
    manejadorReparto.restablecerEstadoRonda = function(){
        UI.activarBotonEnvido("b-envido");
        UI.activarBotonEnvido("b-real");
        UI.activarBotonEnvido("b-falta");
        UI.activarBotonTruco("b-truco");
        UI.desactivarBotonTruco("b-retruco");
        UI.desactivarBotonTruco("b-valecuatro");

        estadoJuego.finRonda = false;
        estadoJuego.fin = false;
        juegaNPC.estado = false;
        cantosRealizados = [];
        envidoAcumulado.si = 0;
        envidoAcumulado.no = 0;
        trucoAcumulado.si = 0;
        trucoAcumulado.no = 0;
        trucoAcumulado.cantado = false;
        resultadoParcial.per = 0;
        resultadoParcial.npc = 0;

        persona.quitarCartasRecibidas();
        npc.quitarCartasRecibidas();
        mazo.iniciar();
        npc.iniciarCantos();
        npc.reiniciarCartasJugadas();
        npc.establecerEnvidoCantado(false);
        npc.reiniciarTrucoCantado();
        npc.reiniciarValeCuatro();
        persona.reiniciarCartasJugadas();
        npc.establecerJugadaActual(0);
        persona.establecerJugadaActual(0);
        npc.reiniciarCantoActual();
    }

    /**
     * Quita las cartas de los jugadores y de la mesa
     */
    manejadorReparto.limpiarMesa = function(){
        // Limpia cartas en mano
        while(UI.cartasPer.children.length > 0){
            UI.cartasPer.removeChild(UI.cartasPer.children[0]);
        }
        while(UI.cartasNPC.children.length > 0){
            UI.cartasNPC.removeChild(UI.cartasNPC.children[0]);
        }

        // Limpia mesa
        for(let i=0; i<UI.mesaPer.length; i++){
            if(UI.mesaPer[i].children.length === 1){
                UI.mesaPer[i].removeChild(UI.mesaPer[i].children[0]);
            }
        }
        for(let i=0; i<UI.mesaNPC.length; i++){
            if(UI.mesaNPC[i].children.length === 1){
                UI.mesaNPC[i].removeChild(UI.mesaNPC[i].children[0]);
            }
        }
    }

    /**
     * Entraga las cartas a los jugadores y las muestra en pantalla
     */
    manejadorReparto.entregarCartas = function(){
        const cartasPer = persona.obtenerCartasRecibidas();
        const cartasNPC = npc.obtenerCartasRecibidas();

        for(let i=0; i<cartasPer.length; i++){
            cartasPer[i].obtenerImagen().dataset.id = cartasPer[i].obtenerId();
            UI.cartasPer.appendChild(cartasPer[i].obtenerImagen());
        }
        for(let i=0; i<cartasNPC.length; i++){
            cartasNPC[i].obtenerImagen().dataset.id = cartasNPC[i].obtenerId();
            UI.cartasNPC.appendChild(mazo.crearImagenDorso());
        }
    }

    /**
     * Permite repartir las cartas
     * @param {Boolean} inicio Indica si es el inicio del partido
     */
    manejadorReparto.repartir = function(inicio){
        const self = this;
        trucoHabilitado = false;
        cantoTrucoInicial = false;
        UI.deshabilitar();

        if(inicio){
            comienzaReparto();
        } else {
            setTimeout(function(){
                comienzaReparto();
            }, 1000);
        }

        /**
         * Inicia el reparto
         */
        function comienzaReparto(){
            UI.abrirPopup("popup-repartiendo", "Repartiendo");
            self.limpiarMesa();
            quitarMazo();

            setTimeout(function(){
                self.restablecerEstadoRonda();        
    
                if(repartePer){
                    persona.repartir(mazo, npc);
                    persona.establecerMano(false);
                    persona.establecerTurno(false);
                    UI.contenedorMazo[1].appendChild(mazo.obtenerImagenMazo());
                } else {
                    npc.repartir(mazo, persona);
                    persona.establecerMano(true);
                    persona.establecerTurno(true);
                    UI.contenedorMazo[0].appendChild(mazo.obtenerImagenMazo());
                }
    
                self.entregarCartas();
                repartePer = !repartePer;
                UI.cerrarPopup();
                UI.habilitar();
                UI.activarBotonMazo();
                UI.mostrarBotoneraAccion("cantar-envido");
                document.dispatchEvent(eventoAccion);
            }, 2500);
        }

        /**
         * Quita el mazo de la mesa
         */
        function quitarMazo(){
            for(let i=0; i<UI.contenedorMazo.length; i++){
                if(UI.contenedorMazo[i].children.length === 1){
                    UI.contenedorMazo[i].removeChild(UI.contenedorMazo[i].children[0]);
                    break;
                }
            }
        }
    }
}
