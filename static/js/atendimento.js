const socket = io();

let senhas = [];
let statusFiltroAtual = 'todas';

socket.on('atualizar_lista_senhas', function(listaSenhas) {
    senhas = listaSenhas;
    renderizarSenhas();
});

function chamarSenha(id) {
    socket.emit('chamar_senha', { id: id, guiche: 'Guichê 01' });
}

function finalizarSenha(id) {
    socket.emit('finalizar_senha', { id: id });
}

function renderizarSenhas() {
    const grid = document.getElementById('gridSenhas');
    const termoBusca = document.getElementById('inputBusca').value.toLowerCase();
    grid.innerHTML = '';

    const senhasFiltradas = senhas.filter(item => {
        const atendeStatus = statusFiltroAtual === 'todas' || item.status === statusFiltroAtual;
        const atendeBusca = item.senha.toLowerCase().includes(termoBusca) ||
                            item.responsavel.toLowerCase().includes(termoBusca) ||
                            item.aluno.toLowerCase().includes(termoBusca) ||
                            item.tipo.toLowerCase().includes(termoBusca);
        return atendeStatus && atendeBusca;
    });

    if (senhasFiltradas.length === 0) {
        grid.innerHTML = `<div class="col-span-full text-center py-12 text-slate-400 font-medium">Nenhuma senha encontrada.</div>`;
        return;
    }

    senhasFiltradas.forEach(item => {
        const card = document.createElement('div');
        card.className = "bg-white border border-slate-200 border-t-4 border-t-sesi-red rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between";

        let badgeStatusHtml = '';
        let botaoHtml = '';

        if (item.status === 'aguardando') {
            badgeStatusHtml = `<span class="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-md">Aguardando</span>`;
            botaoHtml = `
                <button onclick="chamarSenha(${item.id})" class="w-full bg-sesi-red hover:bg-sesi-redHover text-white font-bold py-2.5 rounded-xl transition shadow-sm text-sm uppercase tracking-wider">
                    Chamar Senha
                </button>`;
        } else if (item.status === 'chamada') {
            badgeStatusHtml = `<span class="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-md">Em Atendimento</span>`;
            botaoHtml = `
                <button onclick="finalizarSenha(${item.id})" class="w-full bg-sesi-navy hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl transition shadow-sm text-sm uppercase tracking-wider">
                    Finalizar Atendimento
                </button>`;
        } else if (item.status === 'finalizada') {
            badgeStatusHtml = `<span class="bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-md">Finalizada</span>`;
            botaoHtml = `<button disabled class="w-full bg-slate-100 text-slate-400 font-bold py-2.5 rounded-xl cursor-not-allowed text-sm uppercase tracking-wider">Concluído</button>`;
        }

        const detalheOutros = item.especificacao ? `<p class="text-[11px] text-sesi-red font-semibold mt-1">Especif.: ${item.especificacao}</p>` : '';

        card.innerHTML = `
            <div>
                <div class="flex justify-between items-start mb-2">
                    <div>
                        <span class="text-[10px] font-bold text-slate-400 block uppercase tracking-widest">Senha</span>
                        <span class="text-2xl font-black text-sesi-navy">${item.senha}</span>
                    </div>
                </div>

                <div class="mb-3">
                    <span class="text-[11px] font-bold text-slate-500 uppercase block mb-1">Tipo de Atendimento</span>
                    <div class="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold px-3 py-2 rounded-lg truncate">${item.tipo}</div>
                    ${detalheOutros}
                </div>

                <div class="flex items-center gap-2 mb-4 flex-wrap">
                    ${badgeStatusHtml}
                    <span class="text-xs text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md font-medium flex items-center gap-1">
                        <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        ${item.dataHora}
                    </span>
                </div>

                <div class="space-y-1 text-xs text-slate-600 mb-4 border-t border-slate-100 pt-3">
                    <p><strong class="text-slate-700">Responsável:</strong> ${item.responsavel}</p>
                    <p><strong class="text-slate-700">Aluno(a):</strong> ${item.aluno}</p>
                </div>
            </div>
            <div>${botaoHtml}</div>
        `;
        grid.appendChild(card);
    });
}

function filtrarStatus(status) {
    statusFiltroAtual = status;
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.className = "tab-btn px-4 py-2 rounded-xl text-xs font-bold transition bg-white text-slate-600 border border-slate-200 hover:bg-slate-50";
    });
    event.target.className = "tab-btn active px-4 py-2 rounded-xl text-xs font-bold transition bg-sesi-navy text-white shadow-sm";
    renderizarSenhas();
}

function filtrarSenhas() { renderizarSenhas(); }