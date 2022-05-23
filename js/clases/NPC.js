import { Jugador } from "./Jugador.js";
import { Truco } from "../comun/truco.js";
import { UI } from "../comun/ui.js";

/**
 * Clase que representa al personaje no jugable
 */
export class NPC extends Jugador {
    /**
     * Crea el NPC
     */
    constructor(){
        super();
        this.envidoCantado = false;
        this.trucoCantado = false;
        this.cantosTruco = ["si", "retruco", "valecuatro"];
        this.cantoActual = 0;
        this.valecuatro = false;
        this.cantos;
        this.eventoAccion;
        this.resultadoParcial;
        this.trucoAcumulado;
        this.estadoJuego;
        this.audioActivado;
        this.audioCarta;
    }

    /**
     * Establece el sonido de la carta cuando es arrojada
     * @param {Audio} audioCarta El sonido de la carta
     */
    establecerAudioCarta(audioCarta){
        this.audioCarta = audioCarta;
    }

    /**
     * Establece si el audio está activado
     * @param {Boolean} audioActivado true cuando está activado o false en caso contrario
     */
    establecerAudioActivado(audioActivado){
        this.audioActivado = audioActivado;
    }

    /**
     * Reproduce el audio de la carta
     */
    reproducirAudioCarta(){
        if(this.audioActivado){
            this.audioCarta.stop();
            this.audioCarta.play();
        }
    }

    /**
     * Obtiene el canto actual del truco
     * @returns {String} El canto actual
     */
    obtenerCantosTruco(){
        return this.cantosTruco[this.cantoActual];
    }

    /**
     * Obtiene el estado de vale cuatro
     * @returns {Boolean} true si se ha cantado o false en caso contrario
     */
    obtenerValeCuatro(){
        return this.valecuatro;
    }

    /**
     * Establece el estado del juego
     * @param {Object} estado Indica si es el fin de una ronda o del juego
     */
    establecerEstadoJuego(estado){
        this.estadoJuego = estado;
    }

    /**
     * Reestablece el estado del canto vale cuatro
     */
    reiniciarValeCuatro(){
        this.valecuatro = false;
    }

    /**
     * Establece el resultado parcial del truco
     * @param {Object} resultadoParcial El resultado parcial
     * @param {Object} trucoAcumulado Los puntos acumulados hasta el momento
     */
    establecerResultadoParcial(resultadoParcial, trucoAcumulado){
        this.resultadoParcial = resultadoParcial;
        this.trucoAcumulado = trucoAcumulado;
    }

    /**
     * Establece si el truco ha sido cantado
     * @param {Boolean} trucoCantado true si ha sido cantado o false en caso contrario
     */
    establecerTrucoCantado(trucoCantado){
        this.trucoCantado = trucoCantado;
    }

    /**
     * Reestablece el estado del truco indicando que no se ha cantado
     */
    reiniciarTrucoCantado(){
        this.trucoCantado = false;
    }

    /**
     * Reinicia el número del canto actual
     */
    reiniciarCantoActual(){
        this.cantoActual = 0;
    }

    /**
     * Incrementa el número del canto actual
     */
    incrementarCantoActual(){
        if(this.cantoActual < this.cantosTruco.length-1){
            this.cantoActual++;
        }
    }

    /**
     * Asigna el evento personalizado que se dispara cuando se ha realizado alguna acción
     * @param {Event} evento El evento de acciones
     */
    establecerEventoAccion(evento){
        this.eventoAccion = evento;
    }

    /**
     * Permite saber si se ha cantado el envido
     * @returns {Boolean} true si se ha cantado o false en caso contrario
     */
    obtenerEnvidoCantado(){
        return this.envidoCantado;
    }

    /**
     * Establece si se ha cantado el envido
     * @param {Boolean} envidoCantado El estado del envido
     */
    establecerEnvidoCantado(envidoCantado){
        this.envidoCantado = envidoCantado;
    }

    /**
     * Obtiene un canto de envido aleatorio
     * @returns {String} El canto
     */
    obtenerCantoAleatorio(){
        const indice = Math.floor(Math.random() * this.cantos.length);
        return this.cantos[indice];
    }

    /**
     * Obtiene un canto de truco aleatorio
     * @returns {String} El canto
     */
    obtenerTrucoAleatorio(){
        const numero = this.obtenerNumeroAleatorio(2);

        if(numero === 0){
            return this.obtenerCantoActual();
        } else {
            return "no";
        }   
    }

    /**
     * Inicia los cantos de envido
     */
    iniciarCantos(){
        this.cantos = ["si", "envido", "real"];
    }

    /**
     * Obtiene el canto actual del truco
     * @returns {String} El canto
     */
    obtenerCantoActual(){
        if(this.cantoActual === this.cantosTruco.length-1){
            return "si";
        } else {
            return this.cantosTruco[this.cantoActual];
        }
    }

    /**
     * Establece los cantos de envido disponibles de acuerdo a la que se ha cantado previamente
     * @param {Array} cantosRealizados Los cantos que se realizaron con anterioridad
     */
    establecerCantosDisponibles(cantosRealizados){
        let envido = 0;
        let real = 0;
        let falta = 0;

        for(let i=0; i<cantosRealizados.length; i++){
            switch(cantosRealizados[i]){
                case "envido": envido++;
                    break;
                case "real": real++;
                    break;
                case "falta": falta++;
                    break;
            }
        }

        if(falta === 1){
            this.eliminarCantos(["envido", "real", "falta"]);
        } else if(real === 1){
            this.eliminarCantos(["envido", "real"]);
        } else if(envido === 2){
            this.eliminarCantos(["envido"]);
        }
    }

    /**
     * Elimina los cantos que ya no estarán disponibles
     * @param {Array} cantosAEliminar Los cantos a eliminar
     */
    eliminarCantos(cantosAEliminar){
        for(let i=0; i<cantosAEliminar.length; i++){
            const indice = this.cantos.indexOf(cantosAEliminar[i]);
            if(indice > -1){
                this.cantos.splice(indice, 1);
            }
        }
    }

    /**
     * Obtiene una repuesta a un canto de envido
     * @param {Number} puntosOp Los puntos del oponente
     * @returns {String} La respuesta
     */
    obtenerRespuestaNormal(puntosOp){
        let respuesta = "no";

        if(this.puntos === (this.totalPuntos - 1)){ // NPC a un punto
            respuesta = "falta";
        } else if(this.puntos <= puntosOp){ // Ventaja persona o iguales
            if(puntosOp >= Math.trunc(this.totalPuntos / 2)){ // Persona mas de la mitad
                if(this.puntosEnvido > 29){
                    respuesta = "falta";
                } else if(this.puntosEnvido > 26){
                    respuesta = this.obtenerCantoAleatorio();
                } else if(this.puntosEnvido > 24){
                    respuesta = "si";
                }
            } else if(this.puntosEnvido > 29){ // Persona menos de la mitad
                respuesta = "falta";
            } else if(this.puntosEnvido > 26){
                respuesta = this.obtenerCantoAleatorio();
            }
        } else if(puntosOp >= Math.trunc(this.totalPuntos / 2)){ // Ventaja NPC mas de la mitad
            if(this.puntosEnvido > 29){
                respuesta = "falta";
            } else if(this.puntosEnvido > 26){
                respuesta = "si";
            }
        } else if(this.puntosEnvido > 24){  // NPC menos de la mitad
            respuesta = this.obtenerCantoAleatorio();
        }

        return respuesta;
    }

    /**
     * Permite saber si tiene una carta mayor
     * @param {Number} valor El valor de la carta a comparar
     * @returns {Boolean} true si la supera o false en caso contrario
     */
    tieneCartaMayorQue(valor){
        for(let i=0; i<this.cartasRecibidas.length; i++){
            if(this.cartasRecibidas[i].obtenerValor() >= valor){
                return true;
            }
        }        
        return false;
    }

    /**
     * Obtiene una respuesta a un canto de truco
     * @param {Number} puntosOp Los puntos del oponente
     * @returns {String} La respuesta
     */
    obtenerRespuestaTruco(puntosOp){
        let respuesta = "no";

        if(this.oponente.obtenerCartasRecibidas().length === 2 && this.cartasRecibidas.length === 2){
            if(this.obtenerUltimaCartaJugada().obtenerValor() > this.oponente.obtenerUltimaCartaJugada().obtenerValor() && this.tieneCartaMayorQue(8)){
                respuesta = this.obtenerCantoActual();
            }
        } else if(this.oponente.obtenerCartasRecibidas().length === 1 && this.cartasRecibidas.length === 2){
            if(this.tieneCartaMayorQue(this.oponente.obtenerUltimaCartaJugada().obtenerValor())){
                respuesta = this.obtenerCantoActual();
            }
        } else if(this.oponente.obtenerCartasRecibidas().length === 1 && this.cartasRecibidas.length === 0){ // NPC jugo ultima carta
            if(this.obtenerUltimaCartaJugada().obtenerValor() >= 4 ){
                respuesta = "si";
            }
        } else if(this.oponente.obtenerCartasRecibidas().length === 0 && this.cartasRecibidas.length === 1){ // Persona jugo ultima carta
            if(this.cartasRecibidas[0].obtenerValor() > this.oponente.obtenerUltimaCartaJugada().obtenerValor()){
                respuesta = this.obtenerCantoActual();
            }
        } else if(this.trucoCantado){
            respuesta = this.obtenerCantoActual();
        } else if(this.tieneCartaMayorQue(10)){
            respuesta = this.obtenerCantoActual();
        } else if(this.tieneCartaMayorQue(8)){
            respuesta = this.obtenerTrucoAleatorio();
        } else if(this.puntos <= puntosOp){ // Ventaja persona o iguales
            if(puntosOp >= Math.trunc(this.totalPuntos / 2)){ // Persona mas de la mitad
                if(this.oponente.ganoUltimaJugada()){
                    respuesta = this.obtenerCantoActual();
                } else {
                    respuesta = this.obtenerTrucoAleatorio();
                }
            }
        } else if(puntosOp >= Math.trunc(this.totalPuntos / 2)){ // Ventaja NPC mas de la mitad
            if(this.oponente.ganoUltimaJugada()){
                respuesta = this.obtenerTrucoAleatorio();
            }
        }
        
        return respuesta;
    }

    /**
     * Obtiene una respuesta a un canto de falta envido
     * @param {Number} puntosOp Los puntos del oponente
     * @returns {String} La respuesta
     */
    obtenerRespuestaFalta(puntosOp){
        let respuesta = "no";

        if(puntosOp === (this.totalPuntos - 1)){ // Persona a un punto
            respuesta = "si";
        } else if(this.puntos <= puntosOp){ // NPC abajo o iguales
            if(this.puntosEnvido > 27){
                respuesta = "si";
            }
        } else if(this.puntosEnvido > 29){  // NPC arriba
            respuesta = "si";
        }

        return respuesta;
    }

    /**
     * Obtiene una respuesta para el envido
     * @param {Boolean} esFalta Indica si el canto es falta envido
     * @param {Array} cantosRealizados Contiene los cantos realizados
     * @returns {String} La respuesta
     */
    responderEnvido(esFalta, cantosRealizados){
        const puntosOp = this.oponente.obtenerPuntos();
        let respuestaFinal;
        
        if(esFalta){
            respuestaFinal = this.obtenerRespuestaFalta(puntosOp);
        } else {
            this.establecerCantosDisponibles(cantosRealizados);
            respuestaFinal = this.obtenerRespuestaNormal(puntosOp);
        }

        return respuestaFinal;
    }

    /**
     * Obtiene una respuesta para el truco
     * @returns {String} La respuesta
     */
    responderTruco(){
        const puntosOp = this.oponente.obtenerPuntos();
        const respuestaFinal = this.obtenerRespuestaTruco(puntosOp);
        
        if(this.cantoActual === this.cantos.length-1){
            this.valecuatro = true;
        }

        return respuestaFinal;
    }

    /**
     * Obtiene un canto de envido
     * @returns {String} El canto
     */
    cantarEnvido(){
        const puntosOp = this.oponente.obtenerPuntos();
        let respuesta = this.obtenerRespuestaNormal(puntosOp);

        if(!this.envidoCantado && respuesta !== "no" && !this.trucoCantado){
            if(respuesta === "si"){
                respuesta = "envido";
            }
            return respuesta;
        }

        return null;
    }

    /**
     * Obtiene un canto de truco
     * @returns {String} El canto
     */
    cantarTruco(){        
        const puntosOp = this.oponente.obtenerPuntos();
        let respuesta = this.obtenerRespuestaTruco(puntosOp);

        if(respuesta === "si"){
            respuesta = "truco";
        }    
        
        return respuesta;
    }

    /**
     * Obtiene una carta a jugar
     * @returns {Carta} La carta
     */
    obtenerCarta(){
        const cartaPersona = this.oponente.obtenerUltimaCartaJugada();
        let carta = null;
        
        if(cartaPersona === null){
            carta = this.jugarTurno(false, null);
        } else {
            carta = this.jugarTurno(true, cartaPersona);
        }

        return carta;
    }

    /**
     * Juega su turno realizando un canto o jugando la carta en mesa
     * @param {Object} juegaNPC Indica si debe jugar
     */
    jugar(juegaNPC){
        const self = this;
        const cantoTruco = (this.trucoCantado || this.jugadaActual === 0 || juegaNPC.estado || this.valecuatro) ? "no" : this.cantarTruco();
        let elemento = null;
        let idElemento = null;
        let indice = null;

        if(cantoTruco === "no"){
            UI.deshabilitar();

            for(let i=0; i< UI.mesaNPC.length; i++){
                if(UI.mesaNPC[i].children.length === 0){
                    elemento = this.obtenerCarta().obtenerImagen();
                    idElemento = elemento.dataset.id;
                    indice = i;
                    break;
                }
            }

            setTimeout(function(){
                if(elemento !== null){
                    self.reproducirAudioCarta();
                    UI.mesaNPC[indice].appendChild(elemento);
                    self.establecerCartaJugada(self.obtenerJugadaActual(), self.obtenerCartaRecibida(idElemento));
                    self.establecerJugadaActual(self.obtenerJugadaActual() + 1);
                    self.eliminarCartaRecibida(idElemento);
                    self.cartaDOM = elemento;
                    self.verificarResultado(self.resultadoParcial, self.trucoAcumulado);
                    
                    if(UI.cartasNPC.children.length > 0){
                        UI.cartasNPC.removeChild(UI.cartasNPC.children[0]);
                    }

                    UI.habilitar();
                    document.dispatchEvent(self.eventoAccion);
                }
            }, 1000);
        } else {
            this.trucoCantado = true;
            Truco.cantar(cantoTruco);
        }
    }

    /**
     * Verifica el resultado actual de acuerdo a las cartas jugadas
     * @param {Object} resultadoParcial El resultado parcial
     * @param {Object} trucoAcumulado Los puntos acumulados hasta el momento
     */
    verificarResultado(resultadoParcial, trucoAcumulado){
        if(this.obtenerJugadaActual() === this.oponente.obtenerJugadaActual()){
            const cartaNPC = this.obtenerUltimaCartaJugada().obtenerValor();
            const cartaPer = this.oponente.obtenerUltimaCartaJugada().obtenerValor();
            
            if(cartaPer > cartaNPC){
                resultadoParcial.per++;
            } else if(cartaNPC > cartaPer){
                resultadoParcial.npc++;
            }

            this.verificarFin(resultadoParcial, trucoAcumulado);
        }
    }

    /**
     * Verifica el fin de la ronda
     * @param {Object} resultadoParcial El resultado parcial
     * @param {Object} trucoAcumulado Los puntos acumulados hasta el momento
     */
    verificarFin(resultadoParcial, trucoAcumulado){        
        if(this.obtenerJugadaActual() === 2){
            if(resultadoParcial.per > resultadoParcial.npc){
                this.asignarPuntos(trucoAcumulado, "per");
            } else if(resultadoParcial.npc > resultadoParcial.per){
                this.asignarPuntos(trucoAcumulado, "npc");
            }
        } else if(this.obtenerJugadaActual() === 3){
            if(resultadoParcial.per > resultadoParcial.npc){
                this.asignarPuntos(trucoAcumulado, "per");
            } else if(resultadoParcial.npc > resultadoParcial.per){
                this.asignarPuntos(trucoAcumulado, "npc");
            } else { // Son iguales
                if(this.obtenerCartasJugadas()[0] > this.oponente.obtenerCartasJugadas[0]){
                   this.asignarPuntos(trucoAcumulado, "npc");
                } else if(this.obtenerCartasJugadas()[0] < this.oponente.obtenerCartasJugadas[0]){
                    this.asignarPuntos(trucoAcumulado, "per");
                } else if(this.oponente.obtenerMano()){
                    this.asignarPuntos(trucoAcumulado, "per");
                } else {
                    this.asignarPuntos(trucoAcumulado, "npc");
                }
            }
        }
    }

    /**
     * Asigna los puntos al jugador
     * @param {Object} trucoAcumulado Los puntos acumulados hasta el momento
     * @param {String} jugador Representa al jugador
     */
    asignarPuntos(trucoAcumulado, jugador){
        if(jugador === "per"){
            if(trucoAcumulado.cantado){
                Truco.agregarPuntos(trucoAcumulado.si, this.oponente);
            } else {
                Truco.agregarPuntos(1, this.oponente);
            }
            UI.tableroPer.textContent = this.oponente.obtenerPuntos();
        } else if(jugador === "npc"){
            if(trucoAcumulado.cantado){
                Truco.agregarPuntos(trucoAcumulado.si, this);
            } else {
                Truco.agregarPuntos(1, this);
            }
            UI.tableroNPC.textContent = this.obtenerPuntos();
        }

        this.estadoJuego.finRonda = true;
        this.verificarFinJuego();
    }

    /**
     * Comprueba si es el fin del juego
     */
    verificarFinJuego(){
        if(this.obtenerPuntos() >= this.totalPuntos || this.oponente.obtenerPuntos() >= this.totalPuntos){
            this.estadoJuego.fin = true;   
        }
    }

    /**
     * Juega su turno buscando una carta
     * @param {Boolean} superar Indica si puede superar a la carta del oponente
     * @param {Carta} cartaPersona La carta del oponente
     * @returns {Carta} La carta elegida
     */
    jugarTurno(superar, cartaPersona){
        let cartaElegida;
        
        if(superar){
            cartaElegida = this.buscarMejorCarta(cartaPersona);
        } else {
            cartaElegida = this.elegirCartaMenor(this.cartasRecibidas, false, cartaPersona);
        }
        
        return cartaElegida;
    }

    /**
     * Busca la mejor carta
     * @param {Carta} cartaPersona La carta del oponente
     * @returns {Carta} La carta elegida
     */
    buscarMejorCarta(cartaPersona){
        const cartasSuperiores = [];
        let cartaElegida;
        
        for(let i=0; i<this.cartasRecibidas.length; i++){
            if(this.cartasRecibidas[i].obtenerValor() > cartaPersona.obtenerValor()){
                cartasSuperiores.push(this.cartasRecibidas[i]);
            }
        }

        if(cartasSuperiores.length === 0){
            cartaElegida = this.elegirCartaMenor(this.cartasRecibidas, false, cartaPersona);
        } else {
            cartaElegida = this.elegirCartaMenor(cartasSuperiores, true, cartaPersona);
        }
        
        return cartaElegida;
    }

    /**
     * Busca la carta de menor valor
     * @param {Array} cartas Las cartas del jugador
     * @param {Boolean} sonCartasSuperiores Indica si son cartas superiores o no
     * @param {Carta} cartaPersona La carta del oponente
     * @returns {Carta} La carta elegida
     */
    elegirCartaMenor(cartas, sonCartasSuperiores, cartaPersona){
        let carta = cartas[0];
        
        if(cartas.length > 1){
            if(sonCartasSuperiores){
                for(let i=1; i<cartas.length; i++){
                    if(cartas[i].obtenerValor() < carta.obtenerValor()){
                        carta = cartas[i];
                    }
                }
            } else {
                for(let i=0; i<cartas.length; i++){
                    if(cartaPersona !== null && cartas[i].obtenerValor() === cartaPersona.obtenerValor()){
                        carta = cartas[i];
                        break;
                    } else if(cartas[i].obtenerValor() < carta.obtenerValor()){
                        carta = cartas[i];
                    }
                }   
            }
        }
        
        return carta;
    }
}