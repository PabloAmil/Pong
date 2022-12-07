// update loop >> por cada frame se va a llamar a una funcion que va a actualizar las posiciones y la logica de todos los elementos del juego 

import Ball from './Ball.js'; // se importa la clase 
import Paddle from './Paddle.js';

const ball = new Ball(document.getElementById('ball')); // se le asigna a la constante ball la nueva clase que va a tomar el elemento cuyo id sea ball como parametro, osea el div con id ball y clase ball, y ese div ahora va a ser el valor de ballElem. ahora se va a poder utilizar ese div desde Ball.js como luego las propiedades css
const playerPaddle = new Paddle(document.getElementById('player-paddle')); // [Paddle 2]se le asigna a playerPaddle el div cuyo id sea player-paddle, ese div ahora va a ser el valor de paddleElem y las propiedades de .paddle del styles.css pueden ser utilizadas y modificadas
const computerPaddle = new Paddle(document.getElementById('computer-paddle')); // lo mismo para computerPaddle
const playerScoreElem = document.getElementById('player-score');
const computerScoreElem = document.getElementById('computer-score');


//console.log(playerPaddle)
//cosole.log(ball)

let lastTime; // [configuracion de tiempo 2] se declara la variable lastTime que en un principio no va a tener nada

function update(time) { // [configuracion de tiempo 1] se crea una funcion que toma como parametro un variable time que representa cuanto tiempo paso desde el inicio del programa. time corre constantemente, se puede checkear con un console.log(time)
  
  if (lastTime != null) { // [configuracion de tiempo 6] si lastTime ya no es igual a null (como lo era en un principio) se van a realizar las funciones imoortantes
    const delta =  time - lastTime; // [configuracion de tiempo 7] ese valor time que se pasa se convierte en  "delta" para determinar cuanto tiempo paso entre un frame y el otro
    ball.update(delta, [playerPaddle.rect(), computerPaddle.rect()]); // [configuracion de tiempo 8] se llama la funcion update que ESTA DENTRO DE LA CLASE BALL, que como parametro va a usar el valor delta creado. Sigue en Ball.js /// [rebote paddle 3] a la funcion de update de la bola se le pasa como parametro un array que contiene la posicion de los rectangulos del jugador y de la pc. sigue en Ball.js
    
    computerPaddle.update(delta, ball.y); //[computer Paddle 1] computerPaddle llama a la funcion update (de su clase) que utiliza delta como valor de tiempo y por otro lado toma la posicion y de la pelota para moverse hacia donde va a estar. sigue en Paddle.js

    //[Logica del juego 1]

    if (isLose()) { // [Logica del juego 3] si isLose() es verdadero se llama  a la funcion handleLose()
      handleLose(); 
    };
  };

  lastTime = time;  // [configuracion de tiempo 5] esa variable lastTime ahora va a ser igual a time en cada render
  window.requestAnimationFrame(update); // [configuracion de tiempo 4] una vez que se llamo por primera vez la funcion la vuelve a llamar en un loop infinito que se llama cada vez que algo en la pantalla cambia, cada frame la llama
};


function isLose() { // [Logica del juego 2] se crea la funcion isLose() que tomando las reglas de rebote para los costados izquierdo y derecho de la pantalla va a determinar y hay punto o no
  
  const rect = ball.rect() // toma el valor de la posicion que devuelve ball.rect(). checkea si la bola esta por fuera de los limites izquierdo o derecho
  return rect.right >= window.innerWidth || rect.left <= 0 // lo convierte en una variable y lo devuelve

};

function handleLose() { // [Logica del juego 4] esta funcion llama a todos los metodos que resetean posiciones

  const rect = ball.rect(); // se vuelve a definir rect para que funcione dentro de la funcion 
  if (rect.right >= window.innerWidth) { // si la bola se va para la derecha, lo cual significa punto para el jugador 
    playerScoreElem.textContent = parseInt(playerScoreElem.textContent) + 1; // toma el contenido de texto, lo parsea a numero y le suma 1
  } else {
    computerScoreElem.textContent = parseInt(computerScoreElem.textContent) + 1; // lo mismo pero para la pc
  }

  ball.reset();
  computerPaddle.reset();
};


document.addEventListener("mousemove", e => { // [Paddle 3] con el eventListener mousemove se toma el evento (que es un objeto y que tiene dentro una propiedad y porque es la coordenada del mouse) y mas precisamente la posicion y del mismo y se la asigna un valor a la propiedad position (que ya estaba en 50 en el css)

  playerPaddle.position = (e.y / window.innerHeight) * 100 // como la propiedad position era de 50 (vh osea 50%) y lo que da e.y son valores en pixeles, lo que se hace es pasarlo a porcentaje. (e.y / window.innerHeight) lo convierte en un valor entre 0 y 1, en tanto multiplicarlo por 100 da un valor entre 0 y 100. sigue en Paddle.js
});
window.requestAnimationFrame(update); // [configuracion de tiempo 3] se llama a la funcion update desde aca, este metodo es como era el setInterval, pero mas preciso y no corre entre frames. en esta en cambio cada vez que cambia lo que esta en pantalla 


// seguir 37.40


