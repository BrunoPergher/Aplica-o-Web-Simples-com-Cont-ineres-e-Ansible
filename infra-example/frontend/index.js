const list = document.querySelector("#client-list");

// Função para carregar compras
async function loadPurchases() {
  list.innerHTML = ""; // Limpa a lista antes de carregar novos itens
  const response = await fetch("/api");
  const data = await response.json();
  console.log(data);
  for (const compra of data) {
    console.log(compra);
    const date = new Date(compra.purchase_date);
    const formattedDate = `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${date.getFullYear()}`;

    const item = document.createElement("li");
    item.classList.add(
      "list-group-item",
      "d-flex",
      "justify-content-between",
      "align-items-center"
    );
    item.textContent = `${compra.purchase_name} - ${compra.value} - ${formattedDate}`;

    // Criar botão de editar
    const editButton = document.createElement("button");
    editButton.textContent = "Editar";
    editButton.classList.add("btn", "btn-info");
    editButton.addEventListener("click", () => {
      // Redireciona para a página de editor com o ID da compra
      window.location.href = `/api/editor/${compra.id}`;
    });

    // Adiciona o botão de editar ao item da lista
    item.appendChild(editButton);
    list.appendChild(item);
  }
}

// Carregar compras assim que a página carrega
document.addEventListener("DOMContentLoaded", loadPurchases);

// Adicionar evento de clique ao botão de carregar
document.querySelector("#load-button").addEventListener("click", loadPurchases);
