/**
 * Representa una carta de la baraja
 */
export class Carta {
    /**
     * Crea una carta
     * @param {String} palo El palo o pinta
     * @param {Number} numero El número
     * @param {Number} indicePalo El índice que proviene del array de palos
     * @param {Number} indiceNumero El índice que proviene del array de números
     */
    constructor(palo, numero, indicePalo, indiceNumero) {
        this.palo = palo;
        this.numero = numero;
        this.indicePalo = indicePalo;
        this.indiceNumero = indiceNumero;
        this.ancho = 75;
        this.alto = 115;
        this.imagen = null;
        this.valor = null;
        this.id = null;
        this.asignarValor();
    }

    /**
     * Obtiene los valores de todas las cartas
     * @returns {Object} Objeto literal con la identificación de la carta y su correspondiente valor
     */
    obtenerValores(){
        return {
            "4": 0,
            "5": 1,
            "6": 2,
            "7basto": 3,
            "7copa": 3,
            "10": 4,
            "11": 5,
            "12": 6,
            "1copa": 7,
            "1oro": 7,
            "2": 8,
            "3": 9,
            "7oro": 10,
            "7espada": 11,
            "1basto": 12,
            "1espada": 13,
        }
    }

    /**
     * Obtiene el id asignado a la carta
     * @returns {Number} El id de la carta
     */
    obtenerId(){
        return this.id;
    }

    /**
     * Asigna el id a la carta
     * @param {String} id El id de la carta
     */
    establecerId(id){
        this.id = id;
    }

    /**
     * Asigna un valor a la carta
     */
    asignarValor(){
        this.valor = this.verificarValor();
    }

    /**
     * Obtiene el valor o peso de la carta
     * @returns 
     */
    obtenerValor(){
        return this.valor;
    }

    /**
     * Comprueba el valor que corresponde a la carta
     * @returns {Number} El valor correspondiente
     */
    verificarValor(){
        const valores = this.obtenerValores();

        for(let i in valores){
            if(i === (this.numero + this.palo) || i === this.numero.toString()){
                return valores[i];
            }
        }

        return null;
    }

    /**
     * Establece el elemento HTML que representa a la carta
     * @param {Object} imagen Un div contenedor con su imagen
     */
    establecerImagen(imagen){
        this.imagen = imagen;
    }

    /**
     * Obtiene el elemento HTML que representa a la carta
     * @returns {Object} Un div contenedor con su imagen
     */
    obtenerImagen(){
        return this.imagen;
    }

    /**
     * Obtiene el palo o pinta de la carta
     * @returns {String} El palo
     */
    obtenerPalo(){
        return this.palo;
    }

    /**
     * Obtiene el número de la carta
     * @returns {Number} El número
     */
    obtenerNumero(){
        return this.numero;
    }

    /**
     * Obtiene el índice del array de palos
     * @returns {Number} El índice correspondiente
     */
    obtenerIndicePalo(){
        return this.indicePalo;
    }

    /**
     * Obtiene el índice del array de números
     * @returns {Number} El índice correspondiente
     */
    obtenerIndiceNumero(){
        return this.indiceNumero;
    }

    /**
     * Obtiene la coordenada en el eje Y de la carta
     * @returns {Number} La posición en Y en px
     */
    obtenerY(){
        return -this.indicePalo * this.alto;
    }

    /**
     * Obtiene la coordenada en el eje X de la carta
     * @returns {Number} La posición en X en px
     */
    obtenerX(){
        return -this.indiceNumero * this.ancho;
    }

    /**
     * Obtiene el ancho de la carta
     * @returns {Number} El ancho en px
     */
    obtenerAncho(){
        return this.ancho;
    }

    /**
     * Obtiene el alto de la carta
     * @returns {Number} El alto en px
     */
    obtenerAlto(){
        return this.alto;
    }
}