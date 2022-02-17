let msgRight;
let msgWrong;
let msgWin;
let usuario;

$(function () {
  $('[data-toggle="popover"]').popover()
})

$(function () {
  $('.example-popover').popover({
    container: 'body'
  })
})

/*$(document).ready(function () {
  arrSrc.sort(function () {
    return Math.random() - 0.5;
  });
});*/

if (localStorage.getItem("ganador")) {
  let cookieganador = localStorage.getItem("ganador"); // El local storage lo dejamos igual con Jquery¿?
  setGanador(cookieganador);
}

//Array de las cartas
const arrCartas = [$("#carta1")[0], $("#carta2")[0], $("#carta3")[0], $("#carta4")[0], $("#carta5")[0], $("#carta6")[0], $("#carta7")[0], 
$("#carta8")[0], $("#carta9")[0], $("#carta10")[0], $("#carta11")[0], $("#carta12")[0], $("#carta13")[0], $("#carta14")[0], $("#carta15")[0] ];

//Array con las url de las cartas
const arrSrc = [ "img/mtg1.jpg", "img/mtg2.jpg", "img/mtg3.jpg", "img/mtg4.jpg", "img/mtg5.jpg",
  "img/mtg6.jpg", "img/mtg1.jpg", "img/mtg2.jpg", "img/mtg3.jpg", "img/mtg4.jpg", "img/mtg5.jpg",
  "img/mtg6.jpg", "img/mtg7.jpg","img/mtg7.jpg", "img/bomba.jpg"];

const arrProgress = [
  "0%", "14.27%", "28.57%", "42.85%", "57.14%", "71.43%","85.71%", "100%",
];

let seleccion1 = "";
let seleccion2 = "";
let puntuacion = 0;
let contadorErr = 0;

$("#btnComenzar").click(function startGame() {

  $("#btnStart").off();
  $("#btnStart").css("display", "none");
  
  $("#btnReplay").css("display", "inherit");

  usuario = $("#usuario").val();
  $("#usu").html(usuario);

  //Dificultad
 
  var dificultad = $("input[name='dificultad']:checked").val();
  if(!dificultad){
    dificultad="medium";
  }
 
  //Dependiendo de la dificultad, ejecutaremos un comienzo distinto:

  //startDificultad(dificultad);

  reinicio(dificultad);

  /*for (let i = 0; i < arrCartas.length; i++) {
    const carta = arrCartas[i];
    $(carta).click(function () {
      $(this).attr("src", arrSrc[i]);
     // $(this).fadeOut(200, function(){
      //  $(this).attr("src", arrSrc[i]).delay(200);     
     // });
      //$(this).fadeIn(200);
      if (arrSrc[i] == "img/bomba.jpg") {
        // Si se añade el fondo de bomba, añadimos el dato bomba a este elemento
        $(this).data("bomba", true); //Añadimos el DATA para que no se pueda ver cual es
      }
    });
  }*/

  arrCartas.forEach((element) => {
    $(element).click(function comparar(e) {
      if (seleccion1 == "") {
        seleccion1 = e.target;

        if ($(seleccion1).data("bomba")) {

          $(".audio")[3].play();
          $(seleccion1).removeData("bomba");
          
          setTimeout(() => {
            $(seleccion1).attr("src", "img/dorso.jpg");
            seleccion1 = "";
            seleccion2 = "";
            seleccion1;
            return bomba();
          }, 500);
        } else {
          $(".audio")[0].play();
        }
      } else {
        if (seleccion1 != e.target) {
          seleccion2 = e.target;

          if ($(seleccion2).data("bomba")) {
            $(".audio")[3].play();
            $(seleccion2).removeData("bomba");

            setTimeout(() => {
              $(seleccion1).attr("src", "img/dorso.jpg");
              $(seleccion2).attr("src", "img/dorso.jpg");
              seleccion1 = "";
              seleccion2 = "";
              seleccion1;
              return bomba();
            }, 500);
          } else {
            $(".audio")[0].play();

            if ( $(seleccion1).attr("src") === $(seleccion2).attr("src") ) {
              $(seleccion1).addClass("sombreado");
              
              $(seleccion2).addClass("sombreado");
                

              $(".audio")[1].play();

              seleccion1 = "";
              seleccion2 = "";

              puntuacion++;

              $("#alerts").html(msgRight);
              $("#alerts").removeClass("alert-dark");
              $("#alerts").removeClass("alert-danger");
              $("#alerts").addClass("alert-info");
              $("#marcador").val(puntuacion);

              cambiarProgreso(puntuacion);

              if ($("#marcador").val() == 7) {
                alert(msgWin + $("#errores").val());

                var erroresGanador = parseInt($("#erroresGanador").val());
                var erroresJugador = parseInt($("#errores").val());

                if (erroresGanador >= erroresJugador) {
                  var usuarioErrores = usuario + "&" + erroresJugador;
                  console.log(usuarioErrores);
                  localStorage.setItem("ganador", usuarioErrores.toString());
                  setGanador(usuarioErrores.toString());
                }


                $(".img").off("click");

                $("#alerts").html(msgWin + $("#errores").val());
                $("#alerts").removeClass("alert-dark");
                $("#alerts").removeClass("alert-danger");
                $("#alerts").removeClass("alert-info");
                $("#alerts").addClass("alert-success");

               // location.reload();
              }
            } else {
              setTimeout(() => {
                if ($(seleccion1).hasClass("sombreado")) {
                  $(seleccion2).attr("src", "img/dorso.jpg");
                  $(".audio")[2].play();
                } else if ($(seleccion2).hasClass("sombreado")) {
                  $(seleccion1).attr("src", "img/dorso.jpg");
                  $(".audio")[2].play();
                } else {
                  
                  $(seleccion1).attr("src", "img/dorso.jpg");
                  $(seleccion2).attr("src", "img/dorso.jpg");
                  $(".audio")[2].play();
                }

                seleccion1 = "";
                seleccion2 = "";

                $("#alerts").html(msgWrong);
                $("#alerts").removeClass("alert-dark");
                $("#alerts").removeClass("alert-info");
                $("#alerts").addClass("alert-danger");


                contadorErr++;

                $("#errores").val(contadorErr);
              }, 500);
            }
          }
        }
      }
    });
  });
});

function setGanador(c) {
  let arrGanador = c.split("&");

  $("#erroresGanador").val(arrGanador[1]);
  $("#winner").html(arrGanador[0]);
}

function reinicio() {
    
    //Desordenamos el array
    arrSrc.sort(function () {
      return Math.random() - 0.5;
    });

    //Borramos los aciertos, se les pone el dorso a todas las cartas, se asigna la función a dar la vuelta y una es la bomba
    for (let i = 0; i < arrCartas.length; i++) {
      const carta = arrCartas[i];

      $(carta).removeClass("sombreado");
      $(carta).attr("src", "img/dorso.jpg");

      $(carta).click(function () {
        $(this).attr("src", arrSrc[i]);

        if (arrSrc[i] == "img/bomba.jpg") {

          $(this).data("bomba", true); 
        }
      });
    }
    //En caso de reinicio, se eliminan errores y puntuación acumulada
    contadorErr = 0;
    $("#errores").val(contadorErr);

    puntuacion = 0;
    cambiarProgreso(puntuacion);
    $("#marcador").val(puntuacion);

    $("#alerts").html("Start!");

    $("#alerts").removeClass("alert-success");
    $("#alerts").removeClass("alert-danger");
    $("#alerts").removeClass("alert-info");
    $("#alerts").addClass("alert-dark");



}

function bomba(){
     //Dar la vuelta a las cartas porque se reinicia mediante la bomba
     for (let i = 0; i < arrCartas.length; i++) {
        const carta = arrCartas[i];
  
        $(carta).removeClass("sombredo");
        $(carta).removeClass("sombreado");
        $(carta).attr("src", "img/dorso.jpg");
      }
  
      contadorErr++;
      $("#errores").val(contadorErr);
  
      puntuacion = 0;
      cambiarProgreso(puntuacion);
      $("#marcador").val(puntuacion);
      $(".tablero").effect("bounce", "fast");
}

function cambiarProgreso(punt) {
  $("#progress").css("width", arrProgress[punt]);
}

if (!localStorage.getItem("idioma")) {
  idioma("ES");
}

if (localStorage.idioma == "ES") {
  idioma("ES");
}

if (localStorage.idioma == "EN") {
  idioma("EN");
}

$("#btnES").click(function () {
  idioma("ES");
});
$("#btnEN").click(function () {
  idioma("EN");
});

function idioma(idi) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var myArr = JSON.parse(this.responseText);
      cargarJSON(myArr, idi);
    }
  };
  xhr.open("GET", "lang/lang.json", true);
  xhr.send();
}

function cargarJSON(json, idi) {
  var idioma = json["LANGUAGE"][idi];

  $("#score").html(idioma["SCORE"]);
  $("#errors").html(idioma["ERRORS"]);
  $("#topPlayer").html(idioma["TOP"]);
  $("#topErr").html(idioma["ERRTOP"]);
  $("#language").html(idioma["LANG"]);
  $("#alerts").html(idioma["ALERTS"]);

  msgRight = idioma["RIGHT"];
  msgWrong = idioma["WRONG"];
  msgWin = idioma["WIN"];

  $("#desc").html(idioma["DESC"]);

  localStorage.setItem("idioma", idi);
}
