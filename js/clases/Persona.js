import { Jugador } from "./Jugador.js";

/**
 * Representa al jugador persona
 */
export class Persona extends Jugador {
    /**
     * Crea el jugador
     */
    constructor(){
        super();
        this.turno = false;
        this.ultimaJugadaGanada = false;
        this.mano;
    }

    /**
     * Permite saber si ganó la última jugada
     * @returns {Boolean} Indica si ganó la última jugada o no
     */
    ganoUltimaJugada(){
        return this.ultimaJugadaGanada;
    }

    /**
     * Establece el estado de la última jugada
     * @param {Boolean} ganada Indica si ha sido ganada
     */
    establecerUltimaJugada(ganada){
        this.ultimaJugadaGanada = ganada;
    }

    /**
     * Asigna el turno
     * @param {Boolean} turno Indica si es su turno
     */
    establecerTurno(turno){
        this.turno = turno;
    }

    /**
     * Permite saber si es su turno
     * @returns {Boolean} Indica si es su turno
     */
    esTurno(){
        return this.turno;
    }

    /**
     * Permite saber si es mano
     * @returns {Boolean} Indica si es mano
     */
    obtenerMano(){
        return this.mano;
    }

    /**
     * Establece la mano
     * @param {Boolean} mano Indica si es mano
     */
    establecerMano(mano){
        this.mano = mano;
    }
}