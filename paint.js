let canvas = document.getElementById("canvas");
let contexto = canvas.getContext("2d");
let desenhando = false;
let selecionando = false; // Variável para controlar a seleção
let corAtual = "#000000"; // Cor inicial
let selecao = []; // Array para armazenar os pontos da área de seleção

canvas.addEventListener("mousedown", function(event){
    if (event.shiftKey) { // Ative o modo de seleção ao pressionar a tecla Shift
        selecionando = true;
        selecao = []; // Limpe a seleção anterior
        selecao.push({ x: event.clientX - canvas.offsetLeft, y: event.clientY - canvas.offsetTop });
    } else {
        desenhando = true;
        contexto.beginPath();
        contexto.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
    }
});

canvas.addEventListener("mousemove", function(event){
    if(desenhando){
        contexto.strokeStyle = corAtual;
        contexto.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
        contexto.stroke();
    }
    
    if (selecionando) {
        selecao.push({ x: event.clientX - canvas.offsetLeft, y: event.clientY - canvas.offsetTop });
    }
});

canvas.addEventListener("mouseup", function(event){
    desenhando = false;
    
    if (selecionando) {
        selecionando = false;
        // Preencha apenas dentro da área de seleção
        contexto.fillStyle = corAtual;
        contexto.beginPath();
        contexto.moveTo(selecao[0].x, selecao[0].y);
        for (let i = 1; i < selecao.length; i++) {
            contexto.lineTo(selecao[i].x, selecao[i].y);
        }
        contexto.closePath();
        contexto.fill();
    }
});

let colorButtons = document.querySelectorAll(".colorButton");
colorButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        corAtual = button.getAttribute("data-color");
    });
});

let colorPicker = document.getElementById("colorPicker");
colorPicker.addEventListener("input", function() {
    corAtual = colorPicker.value;
});