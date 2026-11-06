let carrinho = [];

function filtrar(categoria) {
    const categorias = document.querySelectorAll('.category');
    const botoes = document.querySelectorAll('.filter-btn');

    botoes.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    categorias.forEach(cat => {
        if (categoria === 'todos' || cat.dataset.category === categoria) {
            cat.style.display = 'block';
        } else {
            cat.style.display = 'none';
        }
    });
}

function alterarQtd(nome, preco, delta) {
    let itemExistente = carrinho.find(item => item.name === nome);
    
    if (itemExistente) {
        itemExistente.qtd += delta;
        if (itemExistente.qtd <= 0) {
            carrinho = carrinho.filter(item => item.name !== nome);
        }
    } else if (delta > 0) {
        carrinho.push({ name: nome, price: preco, qtd: 1 });
    }
    
    atualizarTelas();
}

function atualizarTelas() {
    document.querySelectorAll('.controle-qtd').forEach(controle => {
        let nomeProduto = controle.id.replace('controle-', '');
        let item = carrinho.find(i => i.name === nomeProduto);
        let qtdSpan = document.getElementById(`qtd-${nomeProduto}`);
        
        if (qtdSpan) {
            qtdSpan.innerText = item ? item.qtd : '0';
        }
    });

    let qtdTotal = 0;
    let valorTotal = 0;

    carrinho.forEach(item => {
        qtdTotal += item.qtd;
        valorTotal += item.price * item.qtd;
    });

    document.getElementById('qtd-itens').innerText = qtdTotal;
    document.getElementById('valor-total').innerText = `R$ ${valorTotal.toFixed(2).replace('.', ',')}`;
}

function abrirModal() {
    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }

    let listaHTML = '';
    carrinho.forEach((item, index) => {
        listaHTML += `
            <div class="item-carrinho">
                <span>${item.qtd}x ${item.name}</span>
                <span>R$ ${(item.price * item.qtd).toFixed(2).replace('.', ',')}</span>
                <button onclick="removerItemDoCarrinho('${item.name}')" style="background:none; border:none; color:red; cursor:pointer; font-weight:bold;">❌</button>
            </div>
        `;
    });

    document.getElementById('lista-carrinho').innerHTML = listaHTML;
    document.getElementById('modal-carrinho').style.display = 'block';
}

function toggleEndereco(mostrar) {
    let campoEndereco = document.getElementById('campo-endereco');
    campoEndereco.style.display = mostrar ? 'block' : 'none';
}

function removerItemDoCarrinho(nome) {
    carrinho = carrinho.filter(item => item.name !== nome);
    atualizarTelas();
    abrirModal();
}

function fecharModal() {
    document.getElementById('modal-carrinho').style.display = 'none';
}

function enviarWhatsApp() {
    let nomeCliente = document.getElementById('nome-cliente').value.trim();
    let tipoPedido = document.querySelector('input[name="tipo-pedido"]:checked').value;
    let enderecoCliente = document.getElementById('endereco-cliente').value.trim();
    let observacao = document.getElementById('observacao').value.trim();

    if (!nomeCliente) {
        alert('Por favor, digite seu nome antes de enviar o pedido.');
        return;
    }

    if (tipoPedido === 'Entrega' && !enderecoCliente) {
        alert('Por favor, digite o endereço completo para entrega.');
        return;
    }

    let mensagem = `*Novo Pedido - Cardápio Léle da Cuca*\n\n`;
    mensagem += `👤 *Cliente:* ${nomeCliente}\n`;
    mensagem += `📦 *Tipo:* ${tipoPedido}\n`;

    if (tipoPedido === 'Entrega') {
        mensagem += `📍 *Endereço:* ${enderecoCliente}\n`;
        mensagem += `⚠️ _(Taxa de entrega a calcular conforme a localização)_\n`;
    }

    mensagem += `\n*Itens do Pedido:*\n`;
    let valorTotal = 0;

    carrinho.forEach(item => {
        mensagem += `- ${item.qtd}x ${item.name} (R$ ${(item.price * item.qtd).toFixed(2).replace('.', ',')})\n`;
        valorTotal += item.price * item.qtd;
    });

    mensagem += `\n💰 *Subtotal dos Produtos:* R$ ${valorTotal.toFixed(2).replace('.', ',')}`;

    if (tipoPedido === 'Entrega') {
        mensagem += `\n_(Valor total sem taxa de entrega)_`;
    }

    if (observacao) {
        mensagem += `\n\n📝 *Observações:* ${observacao}`;
    }

    let telefone = "5527995734819"; // Número da Manuela
    let urlWhatsApp = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;

    window.open(urlWhatsApp, '_blank');
}