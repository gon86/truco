import { UI } from "./ui.js";

export const Envido = iniciarEnvido();

/**
 * Inicia el manejador de envido del NPC
 * @returns {Object} Contiene los métodos que permiten controlar el envido
 */
function iniciarEnvido(){          
    let persona;
    let npc;
    let eventoAccion;
    let envidoAcumulado;
    let estadoJuego;

    return {
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
         * Establece el envido acumulado
         * @param {Object} pEnvidoAcumulado Los puntos acumulados
         */
        establecerEnvidoAcumulado: function(pEnvidoAcumulado){
            envidoAcumulado = pEnvidoAcumulado;
        },

        /**
         * Agrega los punto al jugador
         * @param {Number} puntos Los puntos conseguidos
         * @param {Jugador} jugador El jugador
         */
        agregarPuntos: function(puntos, jugador){
            const puntosGanados = jugador.obtenerPuntos() + puntos;
            jugador.establecerPuntos(puntosGanados);
        },

        /**
         * Obtiene el ganador del envido
         * @returns {Jugador} El ganador
         */
        obtenerGanador: function(){
            let ganador;
    
            if(persona.obtenerPuntosEnvido() > npc.obtenerPuntosEnvido()){
                ganador = persona;
            } else if(persona.obtenerPuntosEnvido() < npc.obtenerPuntosEnvido()){
                ganador = npc;
            } else if(persona.obtenerMano()){
                ganador = persona;
            } else {
                ganador = npc;
            }
    
            return ganador;
        },

        /**
         * Verifica el ganador del envido
         * @param {Boolean} esFalta Indica si es falta
         * @param {Number} totalPuntos El total de puntos del partido
         */
        verificarGanador: function(esFalta, totalPuntos){
            let mensaje;

            if(this.obtenerGanador().constructor.name === "Persona"){
                if(esFalta){
                    envidoAcumulado.si = totalPuntos - npc.obtenerPuntos();
                }
                if(persona.obtenerMano()){
                    mensaje = `<p class="ganador">¡Ganaste!</p>
                                Tus puntos: ${persona.obtenerPuntosEnvido()}
                                <br>Él dice: "Son buenas"`;
                } else {
                    mensaje = `<p class="ganador">¡Ganaste!</p>
                                Tus puntos: ${persona.obtenerPuntosEnvido()}
                                <br>Él tiene: ${npc.obtenerPuntosEnvido()}`;
                }
            } else {
                if(esFalta){
                    envidoAcumulado.si = totalPuntos - persona.obtenerPuntos();
                }
                mensaje = `<p class="perdedor">Perdiste...</p>
                            Tus puntos: ${persona.obtenerPuntosEnvido()}
                            <br>Él tiene: ${npc.obtenerPuntosEnvido()}`;
            }
    
            UI.abrirPopup("popup-puntos", mensaje);
        },

        /**
         * Verifica una respuesta de aceptación
         * @param {Boolean} esFalta Indica si es falta envido
         * @param {Number} totalPuntos El total de puntos del partido
         */
        verificarSi: function(esFalta, totalPuntos){
            const self = this;
            UI.abrirPopup("popup-respuesta", "Quiero...");
    
            setTimeout(function(){
                UI.cerrarPopup();
                self.verificarGanador(esFalta, totalPuntos);
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
                self.agregarPuntos(envidoAcumulado.no, persona);
                UI.tableroPer.textContent = persona.obtenerPuntos();
                UI.mostrarBotoneraAccion("cantar-truco");
                npc.verificarFinJuego();
                UI.habilitar();
                document.dispatchEvent(eventoAccion);
            }, 1000);
        },

        /**
         * Muestra la acciones correspondientes al canto
         * @param {String} idAcciones El identificador del elemento HTML
         */
        mostrarAcciones: function(idAcciones){
            setTimeout(function(){
                npc.establecerEnvidoCantado(true);
                UI.cerrarPopup();
                UI.mostrarBotoneraAccion(idAcciones);
                UI.habilitar();
            }, 1000);
        },

        /**
         * Canta envido
         * @param {Boolean} envidoCantado Indica si el envido ha sido cantado
         * @param {Array} cantosRealizados Los cantos realizados hasta el momento
         */
        verificarEnvido: function(envidoCantado, cantosRealizados){
            envidoAcumulado.si += 2;
            envidoAcumulado.no += 1;
            cantosRealizados.push("envido");
            UI.abrirPopup("popup-respuesta", "¡Envido!");
            if(envidoCantado){
                UI.desactivarBotonEnvido("b-envido");
            }
            UI.activarBotonQuiero("b-quiero");
            UI.activarBotonQuiero("b-noquiero");
            this.mostrarAcciones("contestar-envido");
        },

        /**
         * Canta real envido
         */
        verificarReal: function(){
            envidoAcumulado.si += 3;
            envidoAcumulado.no += 1; 
            UI.abrirPopup("popup-respuesta", "¡Real envido!");
            UI.desactivarBotonEnvido("b-envido");
            UI.desactivarBotonEnvido("b-real");
            UI.activarBotonFaltaEnvido("b-falta");
            UI.activarBotonQuiero("b-quiero");
            UI.activarBotonQuiero("b-noquiero");
            this.mostrarAcciones("contestar-envido");
        },

        /**
         * Canta falta envido
         * @param {Number} totalPuntos El total de puntos del partido
         */
        verificarFalta: function(totalPuntos){
            envidoAcumulado.si = totalPuntos - persona.obtenerPuntos();
            envidoAcumulado.no += 1; 
            UI.abrirPopup("popup-respuesta", "¡Falta envido!");
            UI.desactivarBotonEnvido("b-envido");
            UI.desactivarBotonEnvido("b-real");
            UI.desactivarBotonEnvido("b-falta");
            UI.activarBotonQuiero("b-quiero");
            UI.activarBotonQuiero("b-noquiero");
            this.mostrarAcciones("contestar-envido");
        },

        /**
         * Responde al envido
         * @param {Boolean} esFalta Indica si es falta envido
         * @param {Array} cantosRealizados Contiene los cantos realizados
         * @param {Number} totalPuntos El total de puntos del partido
         */
        responder: function(esFalta, cantosRealizados, totalPuntos){
            const self = this;
            UI.deshabilitar();

            setTimeout(function(){
                const respuesta = npc.responderEnvido(esFalta, cantosRealizados);
    
                switch(respuesta){
                    case "no": self.verificarNo();
                        break;
                    case "si": self.verificarSi(esFalta, totalPuntos);
                        break;
                    case "envido": self.verificarEnvido(true, cantosRealizados);
                        break;
                    case "real": self.verificarReal();
                        break;
                    case "falta": self.verificarFalta(totalPuntos);
                        break;
                }
                
                npc.establecerEnvidoCantado(true);
            }, 1000);
        },
        
        /**
         * Canta envido
         * @param {String} canto El canto
         * @param {Array} cantosRealizados Contiene los cantos realizados
         * @param {Number} totalPuntos El total de puntos del partido
         */
        cantar: function(canto, cantosRealizados, totalPuntos){
            const self = this;
            UI.deshabilitar();

            setTimeout(function(){    
                switch(canto){
                    case "envido": self.verificarEnvido(false, cantosRealizados);
                        break;
                    case "real": self.verificarReal();
                        break;
                    case "falta": self.verificarFalta(totalPuntos);
                        break;
                }
                
                npc.establecerEnvidoCantado(true);
            }, 1000);
        }
    }
}
