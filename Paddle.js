const SPEED = .02;


export default class Paddle { // [Paddle 1] se crea la clase paddle para utilizarla. sigue en script.js
  constructor(paddleElem) {
    this.paddleElem = paddleElem;
    this.reset()
  }

  // [Paddle 4] se utilizan getters y setter para la posicion

  get position(){
    return parseFloat(getComputedStyle(this.paddleElem).getPropertyValue("--position")); // de nuevo, getComputedStyle obtiene las propiedades y valores css de un elemento. En tanto getPropertyValue() devuelve el valor de una propiedad especifica
  };

  set position(value) {
    this.paddleElem.style.setProperty("--position", value); // se le establece la propiedad de estilo "--position" con el valor indicado. El value que obtiene para settear la posicion es el que le pasa el eventListener de mousemove en Script.js. es decir que a la propiedad position que ya tenia el div desde antes, ahora le actualiza el valor por el nuevo. siguiente paso en scrip.js
  };

  rect() { // [rebote paddle 2] se crea una funcion que retorna el rectangulo antes mencionado. sigue en script.js
    return this.paddleElem.getBoundingClientRect()
  }

  reset() {
    this.position = 50; // [computer Paddle 3] se crea una funcion para resetear la posicion de la paddle luego de un punto
  }

  update(delta, ballHeight) { // [computer Paddle 2] aca se define el metodo update para la bola. la posicion va a ser la posicion actual += velocidad establecida * el intervalo de frames * (la posicion y de la bola - la posicion actual del elemento). todo esto es para limitar la velocidad maxima a la que se mueve la paleta de la pc
    this.position += SPEED * delta * (ballHeight - this.position);
  };


};

