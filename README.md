# Sistema de Senhas para Escola Aberta 2026

Este projeto é uma aplicação web em tempo real para gerenciar a emissão, chamada e acompanhamento de senhas em eventos escolares. A solução foi desenvolvida com Flask e Flask-SocketIO, permitindo que diferentes telas atualizem automaticamente suas informações sem necessidade de recarregar a página.

## Objetivo

O sistema facilita a organização do fluxo de atendimento em eventos como a Escola Aberta, oferecendo:

- emissão de senhas por categorias;
- visualização das senhas em tempo real;
- chamada das senhas para atendimento;
- exibição em uma tela de TV para acompanhamento público.

## Funcionalidades

- Tela de emissão: gera novas senhas com prefixo, tipo e informações do responsável/aluno.
- Tela de atendimento: permite chamar e finalizar senhas para cada guichê.
- Tela de TV: exibe as senhas chamadas e destaca o atendimento em andamento.
- Comunicação em tempo real via WebSockets, com atualização instantânea entre as telas.

## Tecnologias utilizadas

- Python
- Flask
- Flask-SocketIO
- HTML, CSS e JavaScript

## Estrutura do projeto

- [app.py](app.py): configuração da aplicação, rotas e eventos WebSocket.
- [templates/](templates/): páginas HTML da interface.
- [static/](static/): arquivos CSS e JavaScript do frontend.
- [requirements.txt](requirements.txt): dependências do projeto.

## Requisitos

- Python 3.9 ou superior
- pip

## Instalação

1. Entre na pasta do projeto:
   ```bash
   cd "c:\Users\ryanr\Desktop\Escola aberta 2026"
   ```

2. Crie um ambiente virtual:
   ```bash
   python -m venv .venv
   ```

3. Ative o ambiente virtual:
   ```bash
   .venv\Scripts\activate
   ```

4. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   ```

## Execução

Inicie o servidor com:

```bash
python app.py
```

A aplicação ficará disponível em:

- http://localhost:5000/
- http://localhost:5000/atendimento
- http://localhost:5000/tv

## Observações

- As senhas são armazenadas em memória durante a execução da aplicação.
- Ao reiniciar o servidor, o estado das senhas é resetado.
- O projeto foi pensado para uso em ambiente local ou em rede interna, dependendo da necessidade do evento.

## Próximos passos possíveis

- salvar as senhas em banco de dados;
- adicionar autenticação para usuários administrativos;
- implementar histórico de atendimentos;
- melhorar a interface visual.
