import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js'
import { getDatabase, ref, push, onValue, remove, update} from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js'

const appSettings = {
    databaseURL: 'https://winesandspirits-cdd6b-default-rtdb.firebaseio.com/'
}

const database = getDatabase(initializeApp(appSettings));
const itemList = ref(database, 'items');

const currentDateRef = ref(database, getLocalISOString());

const add_purchase = document.getElementById("add_purchase");
const content_table = document.getElementById("content_table");

const _size = document.getElementById("size_options");
const payment_method = document.getElementById("payment_method");
const no_records_container = document.getElementById("no_records_container");
const product_entry_search = document.getElementById("product_entry_search");
const product_quantity = document.getElementById("product_quantity");

const purchase_summary_search = document.getElementById("purchase_summary_search");

purchase_summary_search.value = getLocalISOString();

let allEntries = [];

function getLocalISOString(){
    const currentDate = new Date();
    const localISOString = new Date(currentDate - currentDate.getTimezoneOffset() * 60000).toISOString();

    return localISOString.split('T')[0]
}

function addPurchaseSummary(total_profit,total_cash,total_mpesa){
    document.getElementById('purchase_summary').style.display = 'flex';
    document.getElementById('total_profit').innerHTML = `Profit: <b>Ksh.${total_profit}</b>`
    document.getElementById('cash_received').innerHTML = `Total Cash Received: <b>Ksh.${total_cash}</b>`
    document.getElementById('mpesa_received').innerHTML = `Total Mpesa Received: <b>Ksh.${total_mpesa}</b>`

}

function addNewHeader(parent){
    const header_row = document.createElement('tr');

    header_row.innerHTML = `<th>Brand</th>`
    header_row.innerHTML += `<th>Size</th>`
    header_row.innerHTML += `<th>Quantity</th>`
    header_row.innerHTML += `<th>Buying</th>`
    header_row.innerHTML += `<th>Selling</th>`
    header_row.innerHTML += `<th>Profit</th>`
    header_row.innerHTML += `<th>Payment</th>`
    parent.appendChild(header_row)

}

function addNewRow(entry, table, table_date){
    const new_row = document.createElement('tr');
    new_row.innerHTML =  `<td>${entry[1].brand_name}</td>`
    new_row.innerHTML += `<td>${entry[1].bottle_size}</td>`
    new_row.innerHTML += `<td style = 'text-align: center;'>${entry[1].quantity}</td>`
    new_row.innerHTML += `<td>${entry[1].wholesale}</td>`
    new_row.innerHTML += `<td>${entry[1].selling}</td>`
    
    new_row.innerHTML += `<td>${entry[1].profit}</td>`

    if(entry[1].payment =='Cash'){
        new_row.innerHTML += `<td>
                            <p style = 'color: #006b21; 
                            background-color: #86e49d;'
                            class='paid'>
                                ${entry[1].payment}
                            </p>
                          </td>`

    }else if(entry[1].payment =='M-pesa'){
        new_row.innerHTML += `<td>
                            <p  style = 'background-color: #6fcaea;'
                                class='paid'>
                                ${entry[1].payment}
                            </p>
                          </td>`

    }else{
        new_row.innerHTML += `<td><button type='button' class='unpaid'>Unpaid</button></td>`

    }
  
    new_row.innerHTML += `<td style='display: flex; 
                                justify-content: center; 
                                align-items: center;
                                min-width: 36px;
                                background-color: red; 
                                color: white;'> 
                                    <i class="fa fa-trash" aria-hidden="true"></i>
                                    
                            </td>`

    if(entry[1].payment == 'None'){
        new_row.children[6].children[0].addEventListener('click', ()=>{
            const update_payment_container = document.createElement("div");
            update_payment_container.innerHTML = `<label for="cash_payment">
                                                    Cash
                                                    <input type="radio" name="payment" id="cash_payment">
                                                    
                                                </label>`

            update_payment_container.innerHTML += `<label for="mpesa_payment">
                                                    Mpesa
                                                    <input type="radio" name="payment" id="mpesa_payment">
                                                    
                                                </label>`

            update_payment_container.classList = 'update_payment_container';
            document.getElementById('product_list').appendChild(update_payment_container)
                                                
    
            update_payment_container.children[0].addEventListener('input', (e) => {
                e.target.checked = false;
                update_payment_container.style.display = 'none';
    
                entry[1].payment = 'Cash';
            
                const updates = {};
                updates[table_date+ '/' + entry[0]] = entry[1];
                
                update(ref(database), updates);
            },{ once: true })
    
            update_payment_container.children[1].addEventListener('input', (e) => {
                e.target.checked = false;
                update_payment_container.style.display = 'none';
                entry[1].payment = 'M-pesa';
            
                const updates = {};
                updates[table_date+ '/' + entry[0]] = entry[1];
                
                update(ref(database), updates);
            },{ once: true })
                                                                        
        })
        
    }

    new_row.children[7].addEventListener('click', ()=>{
        remove(ref(database, table_date + '/' + entry[0]));

        allEntries.forEach(allEntry => {
            if(entry[1].brand_name === allEntry[1].brand_name && entry[1].bottle_size === allEntry[1].bottle_size){
                allEntry[1].item_count += entry[1].quantity;
            
                const updates = {};
                updates['items/' + allEntry[0]] = allEntry[1];
                
                update(ref(database), updates);
            }
        });                               
    })
                
    table.appendChild(new_row);

}

onValue(itemList,(snapshot) => { 
    if(snapshot.exists())
        allEntries = Object.entries(snapshot.val());

});

onValue(currentDateRef,(snapshot) => { 
    no_records_container.style.display = 'none';
    content_table.innerHTML = '';

    if(snapshot.exists()){
        
        let total_profit = 0;  
        let total_cash = 0;
        let total_mpesa = 0;

        addNewHeader(content_table);

        Object.entries(snapshot.val()).forEach((entry)=>{

            addNewRow(entry,content_table,getLocalISOString());
            
            const amount = entry[1].payment;
            if(amount!='None'){
                total_profit += entry[1].profit

                if(amount == 'Cash')
                    total_cash += entry[1].selling;

                else if(amount == 'M-pesa')
                    total_mpesa += entry[1].selling;

            }
        })
    
        addPurchaseSummary(total_profit,total_cash,total_mpesa);

    }else{
        no_records_container.style.display = 'flex';
        document.getElementById('purchase_summary').style.display = 'none';
        document.getElementById('no_previous_record').style.display = 'none';
        document.getElementById('no_current_record').style.display = 'flex';
        
        return;
    }
});

purchase_summary_search.addEventListener('input', (e)=>{
    onValue(ref(database, e.target.value),(snapshot) => { 
        no_records_container.style.display = 'none';
        content_table.innerHTML = '';

        if(snapshot.exists()){
            let total_profit = 0;  
            let total_cash = 0;
            let total_mpesa = 0;
    
            addNewHeader(content_table);
    
            Object.entries(snapshot.val()).forEach((entry)=>{
    
                addNewRow(entry,content_table,e.target.value);

                const amount = entry[1].payment;
                if(amount!='None'){
                    total_profit += entry[1].profit

                    if(amount == 'Cash')
                    total_cash += entry[1].selling;

                    else if(amount == 'M-pesa')
                    total_mpesa += entry[1].selling;

                }
            })
        
            addPurchaseSummary(total_profit,total_cash,total_mpesa);
    
        }else{
            no_records_container.style.display = 'flex';
            document.getElementById('no_current_record').style.display = 'none';
            document.getElementById('purchase_summary').style.display = 'none';
            document.getElementById('no_previous_record').style.display = 'flex';
    
            return;
        }
    });
})

add_purchase.addEventListener('click', (e) =>{
    document.getElementById('add_purchase_text').style.display = 'none'
    document.getElementById('loading_ring').style.display = 'block'

    e.target.style.transform = 'scale(.5)'

    setTimeout(()=> e.target.style.transform = 'scale(1)',100);

    const bottle_size = _size.value;
    const brand_name = product_entry_search.value.toLowerCase();
    const quantity = Number(product_quantity.value) || 1;
    const payment = payment_method.value || 'None';

    let item_found = false;

    allEntries.forEach((entry) =>{
        if(item_found) return;

        const value = entry[1];
        let itemName = value.brand_name;
    
        if(brand_name == itemName.toLowerCase() && value.bottle_size == bottle_size){
            item_found = true;

            product_entry_search.value = '';

            const wholesale= value.ws_price * quantity;
            const selling = value.s_price * quantity;
            const profit = selling - wholesale;

            push(currentDateRef, {
                brand_name: value.brand_name,
                bottle_size,
                quantity,
                wholesale,
                selling,
                profit,
                payment
            })

            entry[1].item_count -= quantity;
            
            const updates = {};
            updates['items/' + entry[0]] = entry[1];
                
            update(ref(database), updates);

            document.getElementById('add_purchase_text').style.display = 'block'
            document.getElementById('loading_ring').style.display = 'none'

            const inputAccepted = document.getElementById('inputAccepted');
            inputAccepted.style.display = 'flex'

            setTimeout(()=> inputAccepted.style.display = 'none', 1500)
        }
    })

    if(!item_found){
        document.getElementById('add_purchase_text').style.display = 'block'
        document.getElementById('loading_ring').style.display = 'none'

        const inputError = document.getElementById('inputError');
        inputError.style.display = 'flex'

        setTimeout(()=> inputError.style.display = 'none', 2500)

    }
})