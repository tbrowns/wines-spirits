import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js'
import { getDatabase, ref, onValue, update} from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js'

const appSettings = {
    databaseURL: 'https://winesandspirits-cdd6b-default-rtdb.firebaseio.com/'
}

const database = getDatabase(initializeApp(appSettings));
const itemList = ref(database, 'items');

const content_table = document.getElementById("content_table");
const main_container = document.getElementById("main_container");

function addNewHeader(parent){
    const header_row = document.createElement('tr');

    header_row.innerHTML = `<th>Brand</th>`
    header_row.innerHTML += `<th>Size</th>`
    header_row.innerHTML += `<th>No of items</th>`
    header_row.innerHTML += `<th>Action</th>`

    parent.appendChild(header_row)

}

function addNewRow(entry, table){
    const new_row = document.createElement('tr');
    new_row.innerHTML =  `<td>${entry.brand_name}</td>`
    new_row.innerHTML += `<td>${entry.bottle_size}</td>`
    new_row.innerHTML += `<td '>${entry.item_count}</td>`
    new_row.innerHTML += `<td '>
                            <button class='edit_butt'>
                                Edit
                            </button>
                        </td>`

    new_row.children[3].children[0].addEventListener('click', (e) => {
        const update_stock_container = document.createElement('div');

        const first_child = document.createElement('div');
        first_child.textContent = entry.brand_name;

        const second_child = document.createElement('div');
        second_child.textContent = entry.bottle_size;

        const third_child = document.createElement('input');
        third_child.type = 'number';

        update_stock_container.appendChild(first_child);
        update_stock_container.appendChild(second_child);
        update_stock_container.appendChild(third_child);

        const last_child = document.createElement('div');
        last_child.classList = 'buttons_container'
        update_stock_container.appendChild(last_child);

        const add_stock_btn = document.createElement("button");
        add_stock_btn.textContent = 'Add';
        add_stock_btn.type = 'button';

        const replace_stock_btn = document.createElement("button");
        replace_stock_btn.textContent = 'Replace';
        replace_stock_btn.type = 'button';

        const exit_stock_container_btn = document.createElement("button");
        exit_stock_container_btn.textContent = 'Exit';
        exit_stock_container_btn.type = 'button';

        last_child.appendChild(add_stock_btn);
        last_child.appendChild(replace_stock_btn);
        last_child.appendChild(exit_stock_container_btn);

        update_stock_container.classList = 'update_stock_container';
        main_container.appendChild(update_stock_container);

        function update_method(items){
            update_stock_container.style.display = 'none';

            const updates = {};

            updates['items/' + entry.id] = {
                brand_name: entry.brand_name,
                bottle_size: entry.bottle_size,
                item_count: items,
                s_price: entry.s_price,
                ws_price: entry.ws_price

            }
        
            update(ref(database), updates);

        }

        update_stock_container.children[3].children[2].addEventListener('click', ()=> update_stock_container.style.display = 'none')

        update_stock_container.children[3].children[1].addEventListener('click',()=>{
            const items = Number(third_child.value) || 0;
            update_method(items);

        })
        
        update_stock_container.children[3].children[0].addEventListener('click', ()=>{
            const items = entry.item_count + Number(third_child.value) || 0;
            update_method(items);
        })

    })
                
    table.appendChild(new_row);

}

onValue(itemList,(snapshot) => { 
    if(snapshot.exists()){
        content_table.innerHTML = '';

        addNewHeader(content_table);

        let stock_list = [];

        Object.entries(snapshot.val()).forEach((entry)=>{
            const temp  = {
                ...entry[1],
                id: entry[0]
            }
            stock_list.push({
                ...temp
            });
            
        })

        stock_list.sort((a,b) => (a.brand_name > b.brand_name) ? 1 : -1);

        stock_list.forEach((entry)=>{
            addNewRow(entry,content_table);
        })

        document.getElementById("loading_container").style.display = 'none'
    }
});
