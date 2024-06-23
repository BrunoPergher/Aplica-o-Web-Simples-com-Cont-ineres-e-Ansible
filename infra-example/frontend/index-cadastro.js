document.getElementById('purchase-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const purchaseName = document.getElementById('purchaseName').value;
    const purchaseValue = document.getElementById('purchaseValue').value;
    const purchaseDate = document.getElementById('purchaseDate').value;

    // Validar campos
    if (!purchaseName || purchaseValue <= 0 || !purchaseDate) {
        alert('Por favor, preencha todos os campos corretamente.');
        return;
    }

    // Chamada de API para criar a compra
    try {
        const response = await fetch('/api/purchases', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                purchase_name: purchaseName,
                value: purchaseValue,
                purchase_date: purchaseDate
            })
        });

        if (!response.ok) {
            throw new Error('Falha ao criar compra');
        }

        const result = await response.json();
        console.log(result);
        alert('Compra criada com sucesso!');
    } catch (error) {
        console.error(error);
        alert('Erro ao criar a compra.');
    }
});