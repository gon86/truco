import { UI } from "./ui.js";

export const Truco = iniciarTruco();

/**
 * Inicia el manejador de truco del NPC
 * @returns {Object} Contiene los métodos que permiten controlar el truco
 */
function iniciarTruco(){          
    let persona;
    let npc;
    let eventoAccion;
    let trucoAcumulado;
    let juegaNPC;
    let estadoJuego;
    let manejadorReparto;

    return {
        /**
         * Establece si juega el NPC
         * @param {Object} juega Contiene el estado que determina si juega
         */
        establecerJuegaNPC: function(juega){
            juegaNPC = juega;
        },

        /**
         * Establece ambos jugadores
         * @param {Persona} jugadorPersona La persona
         * @param {NPC} jugadorNPC El NPC
         */
        establecerJugadores: function(jugadorPersona, jugadorNPC){
            persona = jugadorPersona;
            npc = jugadorNPC;
        },

        /**
         * Establece el evento personalizado de accion realizada
         * @param {Event} evento El evento
         */
        establecerEventoAccion: function(evento){
            eventoAccion = evento;
        },

        /**
         * Establece el estado del juego
         * @param {Object} estado El estado
         */
        establecerEstadoJuego: function(estado){
            estadoJuego = estado;
        },

        /**
         * Establece los puntos de truco acumulados
         * @param {Object} pTrucoAcumulado Los puntos acumulados
         */
        establecerTrucoAcumulado: function(pTrucoAcumulado){
            trucoAcumulado = pTrucoAcumulado;
        },

        /**
         * Establece el manejador con sus métodos que permiten gestionar el reparto
         * @param {Object} manejador El manejador
         */
        establecerManejadorReparto: function(manejador){
            manejadorReparto = manejador;
        },

        /**
         * Agrega los puntos al jugador
         * @param {Number} puntos Los puntos obtenidos
         * @param {Jugador} jugador El jugador que recibe los puntos
         */
        agregarPuntos: function(puntos, jugador){
            const puntosGanados = jugador.obtenerPuntos() + puntos;
            jugador.establecerPuntos(puntosGanados);
        },

        /**
         * Muestra la acciones correspondientes al canto
         * @param {String} idAcciones El identificador del elemento HTML
         */
        mostrarAcciones: function(idAcciones){
            setTimeout(function(){
                UI.cerrarPopup();
                UI.mostrarBotoneraAccion(idAcciones);
                UI.habilitar();
            }, 1000);
        },

        /**
         * Verifica una respuesta de negación
         */
        verificarNo: function(){
            const self = this;
            UI.abrirPopup("popup-respuesta", "No quiero...");
    
            setTimeout(function(){
                UI.cerrarPopup();
                self.agregarPuntos(trucoAcumulado.no, persona);
                UI.tableroPer.textContent = persona.obtenerPuntos();
                manejadorReparto.repartir(false);
            }, 1000);
        },

        /**
         * Verifica una respuesta de aceptación
         */
        verificarSi: function(){
            UI.abrirPopup("popup-respuesta", "Quiero...");
            
            setTimeout(function(){
                UI.cerrarPopup();
                UI.habilitar();
                if(!persona.esTurno()){
                    juegaNPC.estado = true;
                    document.dispatchEvent(eventoAccion);
                }
            }, 1000);
        },

        /**
         * Canta truco
         */
        verificarTruco: function(){
            trucoAcumulado.cantado = true;
            trucoAcumulado.si += 2;
            trucoAcumulado.no += 1; 
            npc.incrementarCantoActual();
            UI.abrirPopup("popup-respuesta", "¡Truco!");
            UI.desactivarBotonTruco("b-truco");
            UI.activarBotonTruco("b-retruco");
            UI.activarBotonQuieroTruco("b-quiero-truco");
            UI.activarBotonQuieroTruco("b-noquiero-truco");
            this.mostrarAcciones("contestar-truco");
        },

        /**
         * Canta retruco
         */
        verificarRetruco: function(){
            trucoAcumulado.si += 1;
            trucoAcumulado.no += 1;
            npc.establecerTrucoCantado(true); 
            npc.incrementarCantoActual();
            UI.abrirPopup("popup-respuesta", "¡Quiero retruco!");
            UI.desactivarBotonTruco("b-truco");
            UI.desactivarBotonTruco("b-retruco");
            UI.activarBotonTruco("b-valecuatro");
            UI.activarBotonQuieroTruco("b-quiero-truco");
            UI.activarBotonQuieroTruco("b-noquiero-truco");
            this.mostrarAcciones("contestar-truco");
        },

        /**
         * Canta vale cuatro
         */
        verificarValeCuatro: function(){
            trucoAcumulado.si += 1;
            trucoAcumulado.no += 1; 
            UI.abrirPopup("popup-respuesta", "¡Quiero vale cuatro!");
            UI.desactivarBotonTruco("b-truco");
            UI.desactivarBotonTruco("b-retruco");
            UI.desactivarBotonTruco("b-valecuatro");
            UI.activarBotonQuieroTruco("b-quiero-truco");
            UI.activarBotonQuieroTruco("b-noquiero-truco");
            this.mostrarAcciones("contestar-truco");
        },

        /**
         * Responde al truco
         */
        responder: function(){
            const self = this;
            UI.deshabilitar();

            setTimeout(function(){
                const respuesta = npc.responderTruco();
    
                switch(respuesta){
                    case "no": self.verificarNo();
                        break;
                    case "si": self.verificarSi();
                        break;
                    case "retruco": self.verificarRetruco();
                        break;
                    case "valecuatro": self.verificarValeCuatro();
                        break;
                }
            }, 1000);
        },
        
        /**
         * Canta truco
         * @param {String} canto El canto
         */
        cantar: function(canto){
            const self = this;
            UI.deshabilitar();

            setTimeout(function(){    
                switch(canto){
                    case "truco": self.verificarTruco();
                        break;
                    case "retruco": self.verificarRetruco();
                        break;
                    case "valecuatro": self.verificarValeCuatro();
                        break;
                }
            }, 1000);
        }
    }
}
