
const toCurrency = (price) => {
    return new Intl.NumberFormat('ua-UA', {
        currency: "uah",
        style: 'currency'
    }).format(price)
}
document.querySelectorAll('.price').forEach((node) => {
    node.textContent = toCurrency(node.textContent)
})

const $card = document.querySelector('#card')
if($card) {
    $card.addEventListener('click', e => {
        if(e.target.classList.contains('js-remove')) {
            const id = e.target.dataset.id
            const csrf = e.target.dataset.csrf
            
            fetch(`/card/remove${id}`, {
                method: 'delete',
                headers: {
                    'X-XSRF-TOKEN': csrf
                }
            }).then(res => res.json())
            .then(card => {
                console.log(card);
                if(card.courses.length) {
                    const html = card.courses.map((c) => {
                        return `
                        <tr>
                            <td>${c.title}</td>
                            <td>${c.count}</td>
                            <td>
                                <button class="btn btn-small js-remove" data-id="${c.id}">Delete</button>
                            </td>
                    
                        </tr>
                        `
                    }).join('')
                    $card.querySelector('tbody').innerHTML = html
                    $card.querySelector('.price').textContent = toCurrency(card.price)
                } else {
                    $card.innerHTML = 'Card is empty'
                }
            });
        }
    })
}

M.Tabs.init(document.querySelectorAll('.tabs'));

