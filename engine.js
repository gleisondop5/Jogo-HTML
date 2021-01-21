 //variaveis do jogo
 // canvas é para desenhar as coisas, ctx é o contexto
var canvas, ctx, ALTURA, LARGURA, frames = 0;

var maxPulos = 3;//limita o numero de pulos do personagem



var  velocidade = 6;

var estadoAtual;

var estado = {
    jogar: 0,
    jogando: 1,
    perdeu: 2
};

var chao = {// variavel que cria o chao. É um tipo de objeto cm metodos embutidos, parce uma classe
    y: 550,
    altura: 50,
    cor: "#e8da78",

    desenha: function(){
        ctx.fillStyle = this.cor;
        ctx.fillRect(0, this.y, LARGURA, this.altura);
    }
};

var bloco = { //variavel que cria bloco (protoganisita do jogo)
    x: 50,
    y: 0,
    altura: 50,
    largura: 50, 
    cor: "#ff9239",
    gravidade: 1.6, //açao da gravidade sobre o personagem
    velocidade: 0, //velocidade inicial
    forcaDoPulo: 23.6, //intensidade do pulo
    qtdPulos: 0,

    atualiza: function(){
        this.velocidade += this.gravidade;
        this.y += this.velocidade;

        if(this.y > chao.y - this.altura && estadoAtual != estado.perdeu){ //evita que o persogem ultrapasse o chão ao cair e se perder ele possa cair
            this.y = chao.y - this.altura;
            this.qtdPulos = 0; //zera o numero de pulos quando tiver no chao para poder pular de novo  
            this.velocidade = 0;//zera a velocidade quando o bloco estiver no chão 
        }
    },

    pula: function(){ //funcao para pular
        if(this.qtdPulos < maxPulos){
            this.velocidade = - this.forcaDoPulo; //negativo pq atuara contratio a gravidade
            this.qtdPulos++;
        }
    },

    desenha: function(){
        ctx.fillStyle = this.cor;
        ctx.fillRect(this.x, this.y, this.largura, this.altura);
    }
};

var obstaculos = {//variavel para criar os obstaculos
    _obs: [], //vetor de obstaculos
    cores: ["#ffbc1c", "#ff1c1c", "#ff85e1", "#52a7ff", "#78ff5d"],
    tempoInsere: 0,

    insere: function(){ //insere obstaculos no vetor
        this._obs.push({
            x: LARGURA, //comeca na lateral esquerda
            largura: 30 + Math.floor(21 * Math.random()),//define a largura do obstaculo variando de 30 a 50
            altura: 30 + Math.floor(120 * Math.random()),//define a altura do obstaculo variando de 30 a 120
            cor: this.cores[Math.floor(5 * Math.random())]//seleciona uma cor aleatoria
        });

        this.tempoInsere = 30 + Math.floor(21 * Math.random());//intervalo dos obstaculos variam de 30 a 50
    },

    atualiza: function(){// atualiza a posicao do obstaculo na tela
        if(this.tempoInsere == 0)
            this.insere();        
        else
            this.tempoInsere--; 

        for ( var i = 0, tam = this._obs.length; i < tam; i++){
            var obs = this._obs[i];
            obs.x -= velocidade;//altera a posicao do bloco conforme velocidade

            if(bloco.x < obs.x + obs.largura && bloco.x + bloco.largura >= obs.x
            && bloco.y + bloco.altura >= chao.y - obs.altura){//faz as verificações de colisões dos blocos
                estadoAtual = estado.perdeu;
            }

            else if(obs.x <= -obs.largura){ //remove o obstaculo quando ele sair da tela
                this._obs.splice(i, 1);
                tam--;
                i--;
            }
        }
    },

    limpa: function(){ //limpa a tela, excluido obstaculos (limpa o vetor) quando perder
        this._obs = [];
    },

    desenha: function(){
        for ( var i = 0, tam = this._obs.length; i < tam; i++){
            var obs = this._obs[i];
            ctx.fillStyle = obs.cor;
            ctx.fillRect(obs.x, chao.y - obs.altura, obs.largura, obs.altura);
        }
    }
};

            
function clique(evento) { // identificar se clicou
    if(estadoAtual == estado.jogando){//so pula no estado jogando
        bloco.pula();
    }
    else if(estadoAtual == estado.jogar){//muda o estado para jogando ao clicar
        estadoAtual = estado.jogando;
    }
    else if(estadoAtual == estado.perdeu && bloco.y >= 2 * ALTURA){//muda o estado para jogar ao clicar
        estadoAtual = estado.jogar;
        bloco.velocidade = 0;
        bloco.y = 0;
    }
    
}

function main() { //inicializa o jogo
    ALTURA = window.innerHeight;//altura da tela do jogador
    LARGURA = window.innerWidth;//largura da tela do jogador
    if (LARGURA >= 500) { //forca a tela do jogador para 600px
        LARGURA = 600;
        ALTURA = 600;
    }

    canvas = document.createElement("canvas"); //cria o elemento canvas
    canvas.width = LARGURA;
    canvas.height = ALTURA;
    canvas.style.border = "1px solid #000";

    ctx = canvas.getContext("2d"); // tudo que for usado sera 2d
    document.body.appendChild(canvas); // add a variavel canvas no corpo do html
    document.addEventListener("mousedown", clique); // sempre que o mousedown (clique) ocorrer chama a funcao clique

    estadoAtual = estado.jogar;
    roda();
}


function roda() {//vai ficar em loop desenhando o jogo na canvas
    atualiza();
    desenha();
    window.requestAnimationFrame(roda); //cria um loop na funcao roda
}

function atualiza() { // atualiza status do personagem e obstaculos
    frames++;
    bloco.atualiza();//atualiza posição do bloco
    if(estadoAtual == estado.jogando){        
        obstaculos.atualiza();//atualiza a posição do obstaculo
    }
     else if(estadoAtual == estado.perdeu){
        obstaculos.limpa();
     }
}

function desenha() { // desenha personagem, obstaculos, chao e etc
    ctx.fillStyle = "#80daff"; // atribui cor ao canvas
    ctx.fillRect(0, 0, LARGURA, ALTURA); // atribui x (canto superior esquerdo) e y (canto inferior direito)

    if(estadoAtual == estado.jogar){//cria o botao para iniciar o jogo
        ctx.fillStyle = "green";
        ctx.fillRect(LARGURA/2 - 50, ALTURA/2 - 50, 100, 100);//subtrai 50 para alinha com o centro do quadrado
    }
    else if(estadoAtual == estado.perdeu){// indicacao que jogador perdeu
        ctx.fillStyle = "red";
        ctx.fillRect(LARGURA/2 - 50, ALTURA/2 - 50, 100, 100);//subtrai 50 para alinha com o centro do quadrado
    }

    else if(estadoAtual == estado.jogando){//so desenha os obstaculos durante o jogo
        obstaculos.desenha();// acessa a variavel obstaculo e o metodo desenha dele
    }

    chao.desenha(); //acessa a variavel chao e o metodo desenha dela    
    bloco.desenha(); // acessa a variavel bloco e o metodo desenha dela
}