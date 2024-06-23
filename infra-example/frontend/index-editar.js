document.addEventListener('DOMContentLoaded', function() {
    const purchaseId = new URLSearchParams(window.location.search).get('id');

    const form = document.getElementById('edit-purchase-form');
    const purchaseNameInput = document.getElementById('purchaseName');
    const purchaseValueInput = document.getElementById('purchaseValue');
    const purchaseDateInput = document.getElementById('purchaseDate');

    // Função para carregar os dados da compra
    async function loadPurchaseData() {
        const response = await fetch(`/api/editor/${purchaseId}`);
        const data = await response.json();
        purchaseNameInput.value = data.purchase_name;
        purchaseValueInput.value = data.value;
        purchaseDateInput.value = data.purchase_date.split('T')[0]; // Ajusta formato da data para YYYY-MM-DD
    }

    // Carregar dados da compra ao carregar a página
    loadPurchaseData();

    // Atualizar a compra
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const updatedPurchase = {
            purchase_name: purchaseNameInput.value,
            value: parseFloat(purchaseValueInput.value),
            purchase_date: purchaseDateInput.value
        };

        const response = await fetch(`/api/editor/${purchaseId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedPurchase)
        });

        if (response.ok) {
            alert('Compra atualizada com sucesso!');
        } else {
            alert('Erro ao atualizar compra.');
        }
    });
});
