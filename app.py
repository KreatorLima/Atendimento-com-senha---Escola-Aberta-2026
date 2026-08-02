from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'sesi_secret_key_2026'
socketio = SocketIO(app, cors_allowed_origins="*")

# Estruturas em memória para armazenar o estado das senhas
senhas = []
contadores = {'M': 1, 'S': 1, 'F': 1, 'C': 1, 'U': 1, 'O': 1}

# --- ROTAS DE NAVEGAÇÃO ---
@app.route('/')
def emissao():
    return render_template('emissao.html')

@app.route('/atendimento')
def atendimento():
    return render_template('atendimento.html')

@app.route('/tv')
def tv():
    return render_template('tv.html')

# --- EVENTOS WEBSOCKET ---
@socketio.on('connect')
def handle_connect():
    # Envia a lista atualizada assim que qualquer tela se conectar
    emit('atualizar_lista_senhas', senhas)

@socketio.on('emitir_senha')
def handle_emitir_senha(dados):
    prefixo = dados.get('prefixo', 'S')
    numero = contadores[prefixo]
    codigo_senha = f"{prefixo}-{str(numero).zfill(3)}"
    contadores[prefixo] += 1

    nova_senha = {
        'id': len(senhas) + 1,
        'senha': codigo_senha,
        'tipo': dados.get('tipo'),
        'especificacao': dados.get('especificacao', ''),
        'responsavel': dados.get('responsavel'),
        'aluno': dados.get('aluno'),
        'dataHora': dados.get('dataHora'),
        'status': 'aguardando',
        'guiche': ''
    }
    
    senhas.append(nova_senha)
    # Notifica todos os painéis de atendimento
    emit('atualizar_lista_senhas', senhas, broadcast=True)

@socketio.on('chamar_senha')
def handle_chamar_senha(dados):
    senha_id = dados.get('id')
    guiche = dados.get('guiche', 'Guichê 01')

    for s in senhas:
        if s['id'] == senha_id:
            s['status'] = 'chamada'
            s['guiche'] = guiche
            # Notifica a TV para realizar o disparo de áudio e destaque
            emit('senha_chamada_tv', s, broadcast=True)
            break

    # Atualiza as dashboards dos atendentes
    emit('atualizar_lista_senhas', senhas, broadcast=True)

@socketio.on('finalizar_senha')
def handle_finalizar_senha(dados):
    senha_id = dados.get('id')
    for s in senhas:
        if s['id'] == senha_id:
            s['status'] = 'finalizada'
            break
            
    emit('atualizar_lista_senhas', senhas, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)