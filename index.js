// --- 1. EFEITO DE DIGITAÇÃO (HERO) ---
const elementTypewriter = document.querySelector("#typewriter");
const frases = [
  "LA CASA HAMBURGUERIA",
  "O MELHOR DE MONTE ALEGRE",
  "DELIVERY ON",
];
let fraseIndex = 0;
let charIndex = 0;
let apagando = false;

function digitar() {
  const fraseAtual = frases[fraseIndex];
  if (!apagando) {
    elementTypewriter.textContent = fraseAtual.substring(0, charIndex + 1);
    charIndex++;
    if (charIndex === fraseAtual.length) {
      apagando = true;
      setTimeout(digitar, 3000); // tempo que fica parado lendo
      return;
    }
  } else {
    elementTypewriter.textContent = fraseAtual.substring(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      apagando = false;
      fraseIndex = (fraseIndex + 1) % frases.length;
    }
  }
  setTimeout(digitar, apagando ? 30 : 80);
}
digitar();

// --- 2. LÓGICA DO CARRINHO DE COMPRAS ---
let carrinho = []; // Array que guarda os itens
const numeroWhatsApp = "5593992350756"; // Seu número configurado

// Elementos do DOM
const cartPanel = document.getElementById("cart-panel");
const cartOverlay = document.getElementById("cart-overlay");
const cartItemsContainer = document.getElementById("cart-items");
const emptyCartMsg = document.getElementById("empty-cart-msg");
const cartTotalEl = document.getElementById("cart-total");
const cartCountEl = document.getElementById("cart-count");
const btnFinalizar = document.getElementById("btn-finalizar");

// Adicionar item
function addToCart(nome, preco, imagem) {
  // Verifica se já tem no carrinho, se tiver, só soma a quantidade
  const itemExistente = carrinho.find((item) => item.nome === nome);
  if (itemExistente) {
    itemExistente.quantidade += 1;
  } else {
    carrinho.push({ nome, preco, imagem, quantidade: 1 });
  }

  atualizarInterfaceCarrinho();
  mostrarToast();
}

// Aumentar/Diminuir quantidade
function alterarQuantidade(index, operacao) {
  if (operacao === "+") {
    carrinho[index].quantidade += 1;
  } else if (operacao === "-") {
    carrinho[index].quantidade -= 1;
    if (carrinho[index].quantidade <= 0) {
      carrinho.splice(index, 1); // Remove se for 0
    }
  }
  atualizarInterfaceCarrinho();
}

// Atualizar Tela
function atualizarInterfaceCarrinho() {
  cartItemsContainer.innerHTML = ""; // Limpa a lista
  let total = 0;
  let qtdTotal = 0;

  if (carrinho.length === 0) {
    emptyCartMsg.style.display = "block";
    btnFinalizar.disabled = true;
    cartCountEl.classList.remove("scale-110");
    cartCountEl.classList.add("scale-0"); // Esconde badge
  } else {
    emptyCartMsg.style.display = "none";
    btnFinalizar.disabled = false;
    cartCountEl.classList.remove("scale-0");
    cartCountEl.classList.add("scale-110"); // Mostra badge
  }

  carrinho.forEach((item, index) => {
    total += item.preco * item.quantidade;
    qtdTotal += item.quantidade;

    // Cria o HTML do item no carrinho
    const div = document.createElement("div");
    div.className =
      "flex items-center gap-4 bg-[#111] p-3 rounded-lg border border-white/5 relative";
    div.innerHTML = `
                    <img src="${item.imagem}" class="w-16 h-16 object-cover rounded-md">
                    <div class="flex-1">
                        <h4 class="font-bold text-sm leading-tight mb-1 text-white">${item.nome}</h4>
                        <span class="text-lacasa-red text-sm font-bold">R$ ${(item.preco * item.quantidade).toFixed(2).replace(".", ",")}</span>
                    </div>
                    <div class="flex items-center gap-2 bg-black rounded-lg p-1 border border-white/10">
                        <button onclick="alterarQuantidade(${index}, '-')" class="w-6 h-6 flex justify-center items-center text-gray-400 hover:text-white hover:bg-white/10 rounded transition">-</button>
                        <span class="text-sm font-bold w-4 text-center">${item.quantidade}</span>
                        <button onclick="alterarQuantidade(${index}, '+')" class="w-6 h-6 flex justify-center items-center text-gray-400 hover:text-white hover:bg-white/10 rounded transition">+</button>
                    </div>
                `;
    cartItemsContainer.appendChild(div);
  });

  // Atualiza totais
  cartTotalEl.innerText = `R$ ${total.toFixed(2).replace(".", ",")}`;
  cartCountEl.innerText = qtdTotal;
}

// Enviar pedido para o WhatsApp
function enviarPedidoWhatsApp() {
  if (carrinho.length === 0) return;

  let textoPedido = "🍔 *NOVO PEDIDO - LA CASA HAMBURGUERIA* 🍔%0A%0A";
  textoPedido += "*Itens do Pedido:*%0A";

  let totalPedido = 0;

  carrinho.forEach((item) => {
    let subtotal = item.quantidade * item.preco;
    totalPedido += subtotal;
    textoPedido += `➖ ${item.quantidade}x ${item.nome} - R$ ${subtotal.toFixed(2).replace(".", ",")}%0A`;
  });

  textoPedido += `%0A*TOTAL: R$ ${totalPedido.toFixed(2).replace(".", ",")}*%0A`;
  textoPedido += "%0A*Forma de pagamento:* (Informe aqui)%0A";
  textoPedido += "*Endereço para entrega:* (Informe aqui)";

  // Redireciona
  const link = `https://wa.me/${numeroWhatsApp}?text=${textoPedido}`;
  window.open(link, "_blank");

  // Opcional: Esvaziar carrinho após enviar
  // carrinho = []; atualizarInterfaceCarrinho(); toggleCart();
}

// Abrir/Fechar painel lateral
function toggleCart() {
  const isClosed = cartPanel.classList.contains("translate-x-full");
  if (isClosed) {
    cartPanel.classList.remove("translate-x-full");
    cartOverlay.classList.remove("hidden");
    setTimeout(() => cartOverlay.classList.remove("opacity-0"), 10);
  } else {
    cartPanel.classList.add("translate-x-full");
    cartOverlay.classList.add("opacity-0");
    setTimeout(() => cartOverlay.classList.add("hidden"), 300);
  }
}

// Mostrar aviso flutuante
function mostrarToast() {
  const toast = document.getElementById("toast");
  toast.classList.remove("translate-y-20", "opacity-0");
  setTimeout(() => {
    toast.classList.add("translate-y-20", "opacity-0");
  }, 2500);
}
