import { Carta } from "./Carta.js";

/**
 * Representa el mazo o baraja de cartas
 */
export class Mazo {
    /**
     * Construye el mazo
     */
    constructor() {
        this.palos = ["oro", "copa", "espada", "basto"];
        this.numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        this.cartasExcluidas = [8, 9];
        this.rutaImagen = "imagenes/baraja.png";
        this.rutaImagenDorso = "imagenes/dorso.png";
        this.cartas = [];
        this.imagenMazo;
        this.crearMazo();
    }

    /**
     * Inicia el mazo creando todas las cartas con su número y palo
     */
    iniciar(){
        this.cartas = [];

        for(let i=0; i<this.palos.length; i++){
            for(let j=0; j<this.numeros.length; j++){
                const carta = new Carta(this.palos[i], this.numeros[j], i, j);
                this.cartas.push(carta);
            }
        }
    }

    /**
     * Obtiene las cartas del mazo
     * @returns {Array} Las cartas
     */
    obtenerCartas(){
        return this.cartas;
    }

    /**
     * Obtiene las cartas excluidas del mazo
     * @returns {Array} Las cartas excluidas
     */
    obtenerCartasExcluidas(){
        return this.cartasExcluidas;
    }

    /**
     * Obtiene todos los palos
     * @returns {Array} Los palos
     */
    obtenerPalos(){
        return this.palos;
    }

    /**
     * Obtiene todos los números
     * @returns {Array} Los números
     */
    obtenerNumeros(){
        return this.numeros;
    }

    /**
     * Obtiene una carta de acuerdo al índice especificado
     * @param {Number} indice El índice de la carta
     * @returns {Object} El contenedor HTML con la imagen correspondiente
     */
    obtenerCarta(indice){
        const carta = this.crearCarta(this.cartas[indice]);
        return carta;
    }

    /**
     * Elimina una carta del mazo
     * @param {Number} indice El índice de la carta
     */
    eliminarCarta(indice){
        this.cartas.splice(indice, 1);
    }

    /**
     * Crea una carta con su imagen
     * @param {Carta} carta La carta correspondiente
     * @returns {Object} El elemento HTML con su imagen
     */
    crearCarta(carta){
        const imagen = new Image();
        const contenedorCarta = document.createElement("div");
        
        imagen.src = this.rutaImagen;
        contenedorCarta.classList.add("carta");
        contenedorCarta.style.width = carta.obtenerAncho() + "px";
        contenedorCarta.style.height = carta.obtenerAlto() + "px";
        imagen.style.marginLeft = carta.obtenerX() + "px";
        imagen.style.marginTop = carta.obtenerY() + "px";
        contenedorCarta.appendChild(imagen);
        carta.establecerImagen(contenedorCarta);
        
        return carta;
    }

    /**
     * Crea la imagen del dorso
     * @returns {Object} El elemento HTML con la imagen del dorso
     */
    crearImagenDorso(){
        const imagen = new Image();
        const contenedorCarta = document.createElement("div");
        
        imagen.src = this.rutaImagenDorso;
        contenedorCarta.classList.add("carta");
        contenedorCarta.classList.add("dorso");
        contenedorCarta.appendChild(imagen);
        return contenedorCarta;
    }

    /**
     * Crea la imagen del mazo superponiendo el dorso de las cartas
     */
    crearMazo(){
        const mazo = document.createElement("div");
        const carta1 = this.crearImagenDorso();
        const carta2 = this.crearImagenDorso();
        const carta3 = this.crearImagenDorso();
        carta1.style.position = "absolute";
        carta2.style.position = "absolute";
        carta2.style.marginTop = "5px";
        carta3.style.position = "absolute";
        carta3.style.marginTop = "10px";
        mazo.appendChild(carta1);
        mazo.appendChild(carta2);
        mazo.appendChild(carta3);
        mazo.classList.add("mazo");
        this.imagenMazo = mazo;
    }

    /**
     * Obtiene el elemento HTML que representa al mazo
     * @returns {Object} EL elemento HTML
     */
    obtenerImagenMazo(){
        return this.imagenMazo;
    }
}