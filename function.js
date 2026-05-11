const usuarios = [
    {user: "mimmarcelo", pass: "Teste123"},
    {user: "jamili", pass: "2109"},
    {user: "larissa", pass: "1807"},
    {user: "Ricael", pass: "2601"},
    {user: "TheDog", pass: "AuAU"}
];

let chatAtual = "";

function login() {
    let u = document.getElementById("user").value;
    let p = document.getElementById("pass").value;
    let errorMsg = document.getElementById("error-msg");

    
    if(errorMsg) errorMsg.style.display = "none";

    let valido = usuarios.find(x => x.user === u && x.pass === p);

    if(valido){
        localStorage.setItem("logado", "true");
        localStorage.setItem("usuarioLogado", u);
        window.location.href = "chat.html"
    } else {
        if(errorMsg) {
            errorMsg.style.display = "block";
        } else {
            alert("Login invalido"); 
        }
    }
}

function verificarLogin() {
    if(localStorage.getItem("logado") !== "true") {
        window.location.href = "index.html";
    }
}

function logout(){
    localStorage.removeItem("logado");
    localStorage.removeItem("usuarioLogado");
    window.location.href = "index.html";
}

function carregarContatos() {
    let usuarioLogado = localStorage.getItem("usuarioLogado");
    let controles = document.getElementById("chat-controls");
    
    if(!controles) return;
    controles.innerHTML = ""; 

    usuarios.forEach(u => {
        if(u.user !== usuarioLogado) {
            controles.innerHTML += `<button class="btn-chat" onclick="abrirChat('${u.user}')">Conversar com ${u.user}</button>`;
        }
    });


    let outroContato = usuarios.find(u => u.user !== usuarioLogado);
    if(outroContato) {
        abrirChat(outroContato.user);
    }
}

function abrirChat(outroUsuario){
    let usuarioLogado = localStorage.getItem("usuarioLogado");
    
    let chave = [usuarioLogado, outroUsuario].sort().join("_");
    chatAtual = chave;
    
    renderizarChat();
}

function renderizarChat() {
    let AreaDoChat = document.getElementById("AreaDoChat");
    let usuarioLogado = localStorage.getItem("usuarioLogado");
    
    let historicoTexto = localStorage.getItem(chatAtual);
    let historico = [];
    
    if(historicoTexto) {
        try {
            historico = JSON.parse(historicoTexto);
        } catch(e) {
            
            historico = [];
        }
    }

    AreaDoChat.innerHTML = "";

    historico.forEach(msg => {
        let classeCor = (msg.sender === usuarioLogado) ? "msg-enviada" : "msg-recebida";
        AreaDoChat.innerHTML += `
            <div class="msg-container ${classeCor}">
                <span class="msg-sender">${msg.sender}</span>
                <p>${msg.text}</p>
            </div>
        `;
    });

    AreaDoChat.scrollTop = AreaDoChat.scrollHeight;
}

function enviarMsg() {
    let textInput = document.getElementById("msg");
    let msgTexto = textInput.value.trim();
    
    if(msgTexto === "" || chatAtual === "") return;

    let usuarioLogado = localStorage.getItem("usuarioLogado");

    let historicoTexto = localStorage.getItem(chatAtual);
    let historico = [];
    if(historicoTexto) {
        try { historico = JSON.parse(historicoTexto); } catch(e) {}
    }

    historico.push({
        sender: usuarioLogado,
        text: msgTexto
    });

    localStorage.setItem(chatAtual, JSON.stringify(historico));

    textInput.value = "";
    
    renderizarChat();
}