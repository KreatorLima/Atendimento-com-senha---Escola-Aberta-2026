const socket = io();

let chamadasAnteriores = [];

// Relógio da TV
function atualizarRelogio() {
    const agora = new Date();
    document.getElementById('relogioHora').innerText = agora.toLocaleTimeString('pt-BR');
    document.getElementById('relogioData').innerText = agora.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
}
setInterval(atualizarRelogio, 1000);
atualizarRelogio();

// 1. Sinal sonoro de atenção (Beep)
function tocarSinal() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
    } catch (e) {
        console.log("Áudio bloqueado ou não suportado.");
    }
}

// 2. Sintetizador de Voz (Sintetiza e fala o texto)
function falarChamada(senha, responsavel, guiche) {
    if ('speechSynthesis' in window) {
        // Cancela falas anteriores que ainda estejam na fila
        window.speechSynthesis.cancel();

        // Formata o texto para a pronúncia soar natural
        // Exemplo de senha: "M-001" vira "M 0 0 1" para a voz não embolar os números
        const senhaFormatada = senha.replace('-', ' '); 
        const textoParaFalar = `Senha ${senhaFormatada}. ${responsavel}. Dirigir-se ao ${guiche}.`;

        const mensagem = new SpeechSynthesisUtterance(textoParaFalar);
        mensagem.lang = 'pt-BR';
        mensagem.rate = 0.9;  // Velocidade da fala (0.9 é um pouco mais pausado e claro)
        mensagem.pitch = 1.0; // Tom da voz

        // Tenta selecionar uma voz em português do Brasil instalada no sistema
        const voces = window.speechSynthesis.getVoices();
        const vozPtBr = voces.find(v => v.lang === 'pt-BR' || v.lang === 'pt_BR');
        if (vozPtBr) {
            mensagem.voice = vozPtBr;
        }

        // Executa a fala
        window.speechSynthesis.speak(mensagem);
    }
}

// Recebe a chamada de senha via WebSocket
socket.on('senha_chamada_tv', function(chamada) {
    // 1. Toca o apito
    tocarSinal();

    // 2. Atualiza a tela
    document.getElementById('senhaAtual').innerText = chamada.senha;
    document.getElementById('tipoAtual').innerText = chamada.tipo;
    document.getElementById('responsavelAtual').innerText = chamada.responsavel;
    document.getElementById('alunoAtual').innerText = chamada.aluno;
    document.getElementById('guicheAtual').innerText = chamada.guiche || 'Guichê 01';

    // 3. Aguarda 700ms (tempo do apito terminar) e chama a voz
    setTimeout(() => {
        falarChamada(chamada.senha, chamada.responsavel, chamada.guiche || 'Guichê 01');
    }, 700);

    // 4. Atualiza o histórico
    chamadasAnteriores.unshift(chamada);
    renderizarHistorico();
});

function renderizarHistorico() {
    const lista = document.getElementById('listaUltimas');
    lista.innerHTML = '';

    const historico = chamadasAnteriores.slice(1, 5);

    if (historico.length === 0) {
        lista.innerHTML = '<li class="text-center py-10 text-slate-500 font-medium text-sm">Nenhuma chamada anterior.</li>';
        return;
    }

    historico.forEach(item => {
        const li = document.createElement('li');
        li.className = 'bg-sesi-navyLight p-3.5 rounded-2xl border border-slate-700/60 flex justify-between items-center';
        li.innerHTML = `
            <div class="overflow-hidden pr-2">
                <span class="text-xl font-black text-white block">${item.senha}</span>
                <span class="text-xs text-sesi-red font-bold truncate block">${item.tipo}</span>
            </div>
            <div class="text-right">
                <span class="text-xs font-bold text-slate-300 block">${item.guiche || 'Guichê 01'}</span>
                <span class="text-[10px] text-slate-500 font-medium">${item.dataHora}</span>
            </div>
        `;
        lista.appendChild(li);
    });
}