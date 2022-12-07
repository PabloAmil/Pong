
const INITIAL_VELOCITY = .025;
const VELOCITY_INCREASE = 0.00001;

export default class Ball { // se exporta la clase Ball
  constructor(ballElem) { // el constructor recibe el elemento que corresponde a la bola
    this.ballElem = ballElem; // el elemento de la bola esta siendo pasado a la clase para poder ser usado
    this.reset();// 
  };

  get x() { // [Actualizacion ball 2] se crea una funcion para conseguir la posicion de x de la bola
    // el valor de x ya estaba determinado en styles.css. para obtener esa propiedad css se utiliza el metodo getComputedStyle y se le pasa como parametro ballElem (el div con id ball), esto obtiene la PROPIEDAD css. getComputedStyle lo que hace es conseguir todos las propiedades y valores de un elemento html y devolver un objeto con ellas. luego getPropertyValue busca la propiedad que tenga ese nombre, en este caso "--x" y retorna el VALOR, en este caso 50.
    return parseFloat(getComputedStyle(this.ballElem).getPropertyValue('--x')) // finalmente esa informacion con parseFloat es convertida en un number de javascript que se puede utilizar
  };

  set x(value) { // [Actualizacion ball 3] a ese elemento html (el div antes mencionado) se le settea la propiedad de nombre '--x' (primer parametro) y un valor determinado para ella (segundo parametro)
    this.ballElem.style.setProperty('--x', value) 
  };

  get y() { // [Actualizacion ball 4] // se hace lo mismo pero para el eje y
    return parseFloat(getComputedStyle(this.ballElem).getPropertyValue('--y'))
  };

  set y(value) {
    this.ballElem.style.setProperty('--y', value)
  };

  rect()  { // [rebotes 1] se escribe una funcion que obtiene la posicion de la bola
    return this.ballElem.getBoundingClientRect(); // getBOundingClientRect() lo que hace es retornar el tamaño de un elemento (en este caso la bola) y su posicion relativa al viewport. es un objeto y tiene las propiedades: left, top, right, bottom, x, y, width, height. 'x' representa el left, en tanto 'y' el top
  };

  reset() { // [Direction 1] se crea el metodo reset para darle una posicion por default a la bola para centralizarla. esta funcion se llama al principio.
    this.x = 50;
    this.y = 50; 

    // [Direction 2] se comienza creando un objeto con coordenadas, se lo setea en 0 para que el while sea verdadero. cero es menor que 0.2 y 
    this.direction = { x: 0 };

    while (Math.abs(this.direction.x) <= .2 || Math.abs(this.direction.x) >= .9)  { // esto es para evitar que la pelota se mueva demasiado verticalmente y nunca toque las paletas. si es mas .9 quiere decir que va muy horizontal, pero si es menos .2 es muy vertical. el Math.abs es para evitar numeros negativos
      const heading = randomNumberBetween(0, 2 * Math.PI) // [Direction 3] esto da un numero random entre 0 y 360. nota (2 pi es equivalente a 360 grados) esto da un resultado en radianas, lo que permite utilizar seno y coseno para determinar las direcciones de x e y
      this.direction = { x: Math.cos(heading), y: Math.sin(heading)} // [Direction 4]  toma el numero que resulta de heading y saca el coseno (x) y seno (y) para determinar la direccion

    };
    //[Velocity 1]
    this.velocity = INITIAL_VELOCITY; // [velocity 4] al llamarse la funcion de reset la velocidad vuelve a su valor inicial
    
  };

  update(delta, paddleRects) { // [Actualizacion ball 1] se crea la funcion que va a actualizarla //  [rebote paddle 1] // a la funcion de update de la bola se le agrega el parametro paddleRects, el cual son los rectangulos para las paleta. sigue en Paddle.js
    // lo que se va a hacer es tomar la posicion x e y de la bola, la velocidad y la direccion en la que se mueve 
    // lo que hay que hacer es tomar la velocidad y la direccion y agregarlos a la posicion en la que esta la bola

    
    // el div ya esta tomado, por lo que las propiedades x e y pueden modificarse desde aca. recordar que son porcentajes de la pantalla. 
    // IMPORTANTE: al usar get y set es posible llamar (como aca) a la funcion de ese nombre (x o y) y otorgarle el valor que se indique a la propiedad 

    this.x += this.direction.x * this.velocity * delta; // [Velocity 2] el valor ahora va a ser la direccion x del objeto direction, mutiplicado por la velocidad para que se mueva y por delta para manejar el intervalo de tiempo entre frames
    this.y += this.direction.y * this.velocity * delta;
    this.velocity += VELOCITY_INCREASE * delta; // [velocity 3] la velocidad de la bola aumenta con el pasar del tiempo
    const rect = this.rect(); // [rebotes 2] dentro del update para obtener las posiciones rect va a obtener lo que devuelve la funcion rect() al ser llamada 

    if (rect.bottom >= window.innerHeight || rect.top <= 0) { // [rebotes 3] si el fondo del rectangulo es mayor o igual que la propiedad innerHeight(que devuelve la altura del area de contenido de una ventana) significa que se paso la parte inferior de la pantalla; o si rect.top es menor o igual a 0 que significa que la bola se fue por arriba de la pantalla
      this.direction.y *= -1; // entonces la direccion de y se va a invertir 
      //console.log(rect)
    };


    if (paddleRects.some(r => isCollision(r, rect))) { // [rebote paddle 4] //recordar que paddleRects esta representando el array que se paso en script.js como 2do parametro
      // [rebote paddle 4] si cualquiera de los 2 valores da true, se va a tomar ese rect (r) y se va a llamar la funcion isCollision, la cual va a tomar el rect del paddle y de la bola
      
      this.direction.x *= -1; // si en efecto hay una colision, si isCollision devuelve true cambia la direccion de x de la bola
    };

  }
}; 

function randomNumberBetween(min, max) { // [Direction 5] para que funcione hay que crear la funcion que se encarga de darle el numero a heading
  return Math.random() * (max - min) + min  // obtiene un numero random entre 0 y 1 y lo multiplica por max - min para asegurarse que el valor obtenido este en el rango y luego agrega el minimo para asegurarse de que el minimo sea el numero mas bajo obtenido
}

function isCollision(rect1, rect2) { // [rebote paddle 5] esto lo que hace es comparar los lados de ambos elementos, las paddles y la bola, rect 1 son los paddle, cualquiera de los 2, rect 2 es la bola
  
  return rect1.left <= rect2.right && rect1.right >= rect2.left && rect1.top <= rect2.bottom && rect1.bottom >= rect2.top;

  // estos son los rebotes importantes, porque son los que se invierten. 
  // 1 si del paddle (cualquiera de los 2) el eje x(lado izquierdo) es menor (en el caso del izquierdo) o igual (el caso del derecho)que la posicion right de la bola hay rebote
  // 2 si de un paddle el lado derecho es mayor (caso paddle derecho) o igual (caso paddle izquierdo) que el lado izquierdo de la bola hay rebote

  // si cualquiera de estas condiciones se cumplen isCollision devuelve true 
}; 



