/**
 * Clase Jugador de la que heredan Persona y NPC
 */
export class Jugador {
    /**
     * Crea un jugador
     */
    constructor(){
        this.cartasRecibidas = [];
        this.cantidadCartas = 3;
        this.puntosEnvido = 0;
        this.puntos = 0;
        this.totalPuntos;
        this.cartasJugadas = [null, null, null];
        this.jugadaActual = 0;
        this.oponente;
        this.cartaDOM;
    }

    /**
     * Establece el total de puntos al que se jugará el partido
     * @param {Number} total El total de puntos
     */
    establecerTotalPuntos(total){
        this.totalPuntos = total;
    }

    /**
     * Obtiene el elemento carta del DOM
     * @returns {Object} El elemento HTML
     */
    obtenerCartaDOM(){
        return this.cartaDOM;
    }

    /**
     * Establece el elemento carta del DOM
     * @param {Object} cartaDOM El elemento HTML
     */
    establecerCartaDOM(cartaDOM){
        this.cartaDOM = cartaDOM;
    }

    /**
     * Obtiene la última carta jugada
     * @returns {Object} La carta
     */
    obtenerUltimaCartaJugada(){
        for(let i=(this.cartasJugadas.length-1); i>=0; i--){
            if(this.cartasJugadas[i] !== null){
                return this.cartasJugadas[i];
            }
        }
        return null;
    }

    /**
     * Obtiene el número de jugada actual
     * @returns {Number} La jugada actual
     */
    obtenerJugadaActual(){
        return this.jugadaActual;
    }

    /**
     * Establece el número de jugada actual
     * @param {Number} jugadaActual La jugada actual
     */
    establecerJugadaActual(jugadaActual){
        this.jugadaActual = jugadaActual;
    }

    /**
     * Obtiene las cartas jugadas
     * @returns {Array} Las cartas que se han jugado
     */
    obtenerCartasJugadas(){
        return this.cartasJugadas;
    }

    /**
     * Establece una carta como jugada
     * @param {Number} indice El índice correspondiente
     * @param {Carta} valor La carta jugada
     */
    establecerCartaJugada(indice, valor){
        this.cartasJugadas[indice] = valor;
    }

    /**
     * Reestablece las cartas jugadas a null
     */
    reiniciarCartasJugadas(){
        this.cartasJugadas = [null, null, null];
    }

    /**
     * Obtiene los puntos para el envido
     * @returns {Number} Los puntos
     */
    obtenerPuntosEnvido(){
        return this.puntosEnvido;
    }

    /**
     * Establece el oponente
     * @param {Jugador} oponente La persona o el NPC
     */
    establecerOponente(oponente){
        this.oponente = oponente;
    }

    /**
     * Obtiene los puntos que tiene el jugador hasta el momento
     * @returns {Number} Los puntos
     */
    obtenerPuntos(){
        return this.puntos;
    }

    /**
     * Establece los puntos del jugador
     * @param {Number} puntos Los puntos
     */
    establecerPuntos(puntos){
        if(puntos > this.totalPuntos){
            this.puntos = this.totalPuntos;
        } else {
            this.puntos = puntos;
        }
    }

    /**
     * Asigna los puntos del envido
     */
    asignarPuntosEnvido(){
        const cartas = this.obtenerCartasRecibidas();
        const palos = [];
        const cantidad = {
            oro: 0,
            copa: 0,
            espada: 0,
            basto: 0
        };

        for(let i=0; i<cartas.length; i++){
            palos.push(cartas[i].obtenerPalo());
        }

        for(let i=0; i<palos.length; i++){
            switch(palos[i]){
                case "oro": cantidad.oro++;
                    break;
                case "copa": cantidad.copa++;
                    break;
                case "espada": cantidad.espada++;
                    break;
                case "basto": cantidad.basto++;
                    break;
            }
        }

        const estados = this.obtenerEstados(cantidad);
        this.sumarPuntos(estados, cartas);
    }

    /**
     * Obtien un array con la cantidad de cartas por cada palo
     * @param {Object} cantidad Objeto literal que representa la cantidad de cada palo
     * @returns {Array} Contiene palo y cantidad
     */
    obtenerEstados(cantidad){
        let estados = [];

        for(let i in cantidad){
            switch(cantidad[i]){
                case 1:
                    estados.push({ cantidad: 1, palo: i });
                    break;
                case 2:
                    estados.push({ cantidad: 2, palo: i });
                    break;
                case 3:
                    estados.push({ cantidad: 3, palo: i });
                    break;
            }
        }

        return estados;
    }

    /**
     * Suma los puntos del envido
     * @param {Array} estados Contiene palo y cantidad
     * @param {Array} cartas Las cartas recibidas
     */
    sumarPuntos(estados, cartas){
        const ceros = [10, 11, 12];
        const numeros = [];
        const palos = [];

        for(let i=0; i<cartas.length; i++){
            numeros.push(cartas[i].obtenerNumero());
            palos.push(cartas[i].obtenerPalo());
        }

        switch(estados.length){
            case 1: this.puntosEnvido = sumarMismoPalo();
                break;
            case 2: this.puntosEnvido = sumarDosIguales();
                break;
            case 3: this.puntosEnvido = obtenerMayorDeTres();
                break;
        }

        /**
         * Suma las cartas del mismo palo
         * @returns {Number} El total de puntos
         */
        function sumarMismoPalo(){
            const copiaNumeros = [];
            const mayores = [];
            let mayor = 0;
            let indiceMayor = 0;
            let total = 20;

            for(let i=0; i<numeros.length; i++){
                copiaNumeros.push(numeros[i]);
                if(ceros.indexOf(numeros[i]) === -1 && numeros[i] > mayor){
                    mayor = numeros[i];
                    indiceMayor = i;
                }
            }

            mayores.push(mayor);
            copiaNumeros.splice(indiceMayor, 1);
            mayor = 0;

            for(let i=0; i<copiaNumeros.length; i++){
                if(ceros.indexOf(copiaNumeros[i]) === -1 && copiaNumeros[i] > mayor){
                    mayor = copiaNumeros[i];
                }
            }

            mayores.push(mayor);

            for(let i=0; i<mayores.length; i++){
                total += mayores[i];
            }

            return total;
        }

        /**
         * Suma dos cartas del mismo palo
         * @returns {Number} El total de puntos
         */
        function sumarDosIguales(){
            let total = 20;
            let palo = "";

            for(let i in estados){
                if(estados[i].cantidad === 2){
                    palo = estados[i].palo;
                    break;
                }
            }

            for(let i=0; i<numeros.length; i++){
                if(ceros.indexOf(numeros[i]) === -1 && palos[i] === palo){
                    total += numeros[i];
                }
            }

            return total;
        }

        /**
         * Obtiene la carta con mas puntos
         * @returns {Number} La carta mayor
         */
        function obtenerMayorDeTres(){
            let mayor = 0;

            for(let i=0; i<numeros.length; i++){
                if(ceros.indexOf(numeros[i]) === -1 && numeros[i] > mayor){
                    mayor = numeros[i];
                }
            }

            return mayor;
        }
    }

    /**
     * Reestablece el array de cartas recibidas
     */
    quitarCartasRecibidas(){
        this.cartasRecibidas = [];
    }

    /**
     * Obtiene las cartas recibidas en una mano o ronda
     * @returns {Array} Las cartas recibidas
     */
    obtenerCartasRecibidas(){
        return this.cartasRecibidas;
    }

    /**
     * Obtiene una carta específica
     * @param {Number} id El identificador de la carta
     * @returns {Carta} La carta correspondiente
     */
    obtenerCartaRecibida(id){
        for(let i=0; i<this.cartasRecibidas.length; i++){
            if(this.cartasRecibidas[i].obtenerId().toString() === id){
                return this.cartasRecibidas[i];
            }
        }
        return null;
    }

    /**
     * Elimina una carta cuando se ha jugado en mesa
     * @param {String} id El identificador de la carta
     */
    eliminarCartaRecibida(id){
        for(let i=0; i<this.cartasRecibidas.length; i++){
            if(this.cartasRecibidas[i].obtenerId().toString() === id){
                this.cartasRecibidas.splice(i, 1);
                break;
            }
        }
    }

    /**
     * Reparte las cartas para comenzar la ronda
     * @param {Mazo} mazo El mazo del que se obtienen las cartas a repartir
     */
    repartir(mazo){
        for(let i=0; i<this.oponente.cantidadCartas; i++){
            const carta = this.oponente.recibirCarta(mazo, this.oponente.obtenerCartasRecibidas());
            carta.establecerId(i);
            this.oponente.cartasRecibidas.push(carta);
        }

        for(let i=0; i<this.cantidadCartas; i++){
            const carta = this.recibirCarta(mazo, this.obtenerCartasRecibidas());
            carta.establecerId(i);
            this.cartasRecibidas.push(carta);
        }

        this.oponente.asignarPuntosEnvido();
        this.asignarPuntosEnvido();
    }

    /**
     * Permite recibir una carta del mazo
     * @param {Mazo} mazo El mazo o baraja de cartas
     * @param {Array} cartasJugador Las cartas que posee el jugador
     * @returns {Carta} La carta a recibir
     */
    recibirCarta(mazo, cartasJugador){
        const excluidas = mazo.obtenerCartasExcluidas();
        let cantidadCartas = mazo.obtenerCartas().length;
        let indice = this.obtenerNumeroAleatorio(cantidadCartas);
        let carta = mazo.obtenerCarta(indice);
        
        while(excluidas.indexOf(carta.obtenerNumero()) > -1 || this.yaTieneEsaCarta(carta, cartasJugador)){
            indice = this.obtenerNumeroAleatorio(cantidadCartas);
            carta = mazo.obtenerCarta(indice);
        }
        
        mazo.eliminarCarta(indice);
        return carta;
    }

    /**
     * Verifica si el jugador ya tiene esa carta
     * @param {Carta} carta La carta a recibir
     * @param {Array} cartasJugador Las cartas que posee el jugador
     * @returns {Boolean} true si ya tiene esa carta o false en caso contrario
     */
    yaTieneEsaCarta(carta, cartasJugador){
        for(let i=0; i<cartasJugador.length; i++){
            if(cartasJugador[i].obtenerNumero() === carta.obtenerNumero() &&
               cartasJugador[i].obtenerPalo() === carta.obtenerPalo()){

               return true;
            }
        }
        return false;
    }

    /**
     * Obtiene un número aleatorio
     * @param {Number} limite El número límite
     * @returns El número generado
     */
    obtenerNumeroAleatorio(limite){
        return Math.floor(Math.random() * limite);
    }
}