const socket = io();

const formCadastro = document.getElementById('formCadastro');
const campoOutrosContainer = document.getElementById('campoOutrosContainer');
const especificacaoOutros = document.getElementById('especificacaoOutros');

let aguardandoImpressao = false;

function verificarOutrosOpcao() {
    const select = document.getElementById('tipoAtendimento');
    if (select.value.includes("Outros Assuntos")) {
        campoOutrosContainer.classList.remove('hidden');
        especificacaoOutros.setAttribute('required', 'true');
    } else {
        campoOutrosContainer.classList.add('hidden');
        especificacaoOutros.removeAttribute('required');
        especificacaoOutros.value = '';
    }
}

formCadastro.addEventListener('submit', function(e) {
    e.preventDefault();

    const selectTipo = document.getElementById('tipoAtendimento');

    // Captura a data completa (Dia/Mês/Ano e Hora:Minuto)
    const agora = new Date();
    const dataHoraFormatada = agora.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' - ' + agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    const dadosFormulario = {
        responsavel: document.getElementById('nomeResponsavel').value,
        aluno: document.getElementById('nomeAluno').value,
        tipo: selectTipo.value,
        especificacao: especificacaoOutros.value,
        dataHora: dataHoraFormatada
    };

    aguardandoImpressao = true;
    socket.emit('emitir_senha', dadosFormulario);

    formCadastro.reset();
    verificarOutrosOpcao();
});

socket.on('atualizar_lista_senhas', function(senhas) {
    if (!senhas || senhas.length === 0) return;

    const ultimo = senhas[senhas.length - 1];

    document.getElementById('senhaDestaque').innerText = ultimo.senha;
    document.getElementById('tipoDestaque').innerText = ultimo.tipo;

    const lista = document.getElementById('listaHistorico');
    lista.innerHTML = '';

    const ultimosCinco = senhas.slice(-5).reverse();
    ultimosCinco.forEach(item => {
        const li = document.createElement('li');
        li.className = 'bg-sesi-navyLight p-3 rounded-lg border border-slate-700/60 flex justify-between items-center';
        li.innerHTML = `
            <div class="overflow-hidden pr-2">
                <div class="text-xs font-bold text-slate-200 truncate">${item.responsavel}</div>
                <div class="text-[10px] text-red-400 font-semibold truncate">${item.tipo}</div>
            </div>
            <span class="text-xs font-black text-red-400 bg-red-950/40 px-2 py-1 rounded border border-red-900/50">${item.senha}</span>
        `;
        lista.appendChild(li);
    });

    if (aguardandoImpressao) {
        aguardandoImpressao = false;

        document.getElementById('printSenha').innerText = ultimo.senha;
        document.getElementById('printTipo').innerText = ultimo.tipo;
        document.getElementById('printResponsavel').innerText = ultimo.responsavel;
        document.getElementById('printAluno').innerText = ultimo.aluno;
        document.getElementById('printDataHora').innerText = ultimo.dataHora;

        setTimeout(() => {
            window.print();
        }, 100);
    }
});