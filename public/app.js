//added currency in the course card
const toCurrency = price => {
return new Intl.NumberFormat('en-US', {
    currency: 'USD',
    style: 'currency'
}).format(price)
}
document.querySelectorAll('.price').forEach(node => {
    node.textContent = toCurrency(node.textContent);
})

//сhanging the time format in the order
const toDate = date => {
    return new Intl.DateTimeFormat( 'en-US',{
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(new Date(date));
}
document.querySelectorAll('.date').forEach( node => {
    node.textContent = toDate(node.textContent);
})





//set the event handler for the button 'Delete' on the page 'Cart'
const $card = document.querySelector('#card');

if ($card) {

    $card.addEventListener('click', event => {
        if (event.target.classList.contains('js-remove')) {
            const id = event.target.dataset.id;
            const csrf = event.target.dataset.csrf;//read the 'csrf' attribute from views/card.hbs -> button delete

            //delete the course when the button is pressed
            //read an ajax-requestres
            fetch('/card/remove/' + id, {
               method: 'delete',
               headers: {
                    'X-XSRF-TOKEN': csrf  //send the token in a configurable HTTP header
               }
            }).then(res => res.json())
                .then(card => { // got the cart object
                    if (card.courses.length) {

                        //create a new array 'html' - in the loop generate all table rows with the new table data
                        const html = card.courses.map(c => {
                            return `
                            <tr>
                                <td>${c.title}</td>
                                <td>${c.count}</td>
                                <td>
                                    <button class="btn btn-small js-remove" data-id="${c.id}">Delete</button>
                                </td>
                            </tr>
                            `
                            //convert the array 'html' into a string
                        }).join('');
                        //replace the old table with the 'html' array
                        $card.querySelector('tbody').innerHTML = html;

                        $card.querySelector('.price').textContent = toCurrency(card.price);

                    } else {
                        $card.innerHTML = '<p>Cart is empty</p>';
                    }
                })
        }
    });

}

//activate tabs on the 'login' page
let instance = M.Tabs.init(document.querySelectorAll('.tabs'));//materializecss.com ->components ->tabs ->initialization