import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js'
import { getDatabase, ref, push, onValue, remove, update} from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js'

const appSettings = {
    databaseURL: 'https://winesandspirits-cdd6b-default-rtdb.firebaseio.com/'
}

const database = getDatabase(initializeApp(appSettings));
const itemList = ref(database, 'items');

const add_brand_info_btn = document.getElementById("add_brand_info_btn");
const add_brand_info_input = document.getElementById("add_brand_info_input");
const save_entry = document.getElementById("save_entry");
const exit = document.getElementById("exit");

const brand_name = document.getElementById("brand_name");
const bottle_size = document.getElementById("bottle_size");
const ws_price = document.getElementById("ws_price");
const s_price = document.getElementById("s_price");

const search_bar = document.getElementById("search_product");

const display_brand_infos = document.getElementById("display_brand_info");

const main_container = document.getElementById("main_container"); 

onValue(itemList,(snapshot) => { 
    if(snapshot.exists())
        display_brand_infos.innerHTML = '';

        Object.entries(snapshot.val()).forEach((entry) =>{
            let value = entry[1];
    
            let newDiv = document.createElement('div');
    
            newDiv.innerHTML = `<div> ${value.brand_name} </div>`;
            newDiv.innerHTML += `<div> Size: ${value.bottle_size} </div>`;
            newDiv.innerHTML += `<div> Buying Price: Ksh. ${value.ws_price} </div>`;
            newDiv.innerHTML += `<div> Selling Price: Ksh. ${value.s_price} </div>`;
    
            newDiv.innerHTML += `<i class="fa fa-pencil-square-o" aria-hidden="true"> Update</i>`
                                    
            newDiv.innerHTML += `<i class="fa fa-trash" aria-hidden="true"> Delete </i>`;
            
            newDiv.addEventListener('click',()=>{
                if(newDiv.children[4].style.display == 'none' ||
                    newDiv.children[4].style.display == ''){
                        newDiv.children[4].style.display = 'flex';
                        newDiv.children[5].style.display = 'flex';
    
                }else{
                    newDiv.children[4].style.display = 'none'
                    newDiv.children[5].style.display = 'none'
    
                }
            })

            document.getElementById('loader_container').style.display = 'none'
    
            newDiv.children[4].addEventListener('click',()=>{

                const update_brand_info_input = document.createElement('div')

                const first_child = document.createElement('h1')
                first_child.textContent = value.brand_name;

                const second_child = document.createElement('label');
                second_child.textContent = 'Size:';

                const third_child = document.createElement('input');
                third_child.type = 'text';
                third_child.value = value.bottle_size;

                const fourth_child = document.createElement('label');
                fourth_child.textContent = 'Buying price:';

                const fifth_child = document.createElement('input');
                fifth_child.type = 'text';
                fifth_child.value = value.ws_price;

                const sixth_child = document.createElement('label');
                sixth_child.textContent = 'Selling price:';

                const seventh_child = document.createElement('input');
                seventh_child.type = 'text';
                seventh_child.value = value.s_price;

                const update_btn_container = document.createElement('div');

                const update_entry = document.createElement('button');
                update_entry.type = 'button';
                update_entry.textContent = 'Save'
                const cancel_update = document.createElement('button');
                cancel_update.type = 'button';
                cancel_update.textContent = 'Cancel';

                update_btn_container.appendChild(update_entry);
                update_btn_container.appendChild(cancel_update);
                update_btn_container.classList = 'save_options';

                update_brand_info_input.appendChild(first_child);
                update_brand_info_input.appendChild(second_child);
                update_brand_info_input.appendChild(third_child);
                update_brand_info_input.appendChild(fourth_child);
                update_brand_info_input.appendChild(fifth_child);
                update_brand_info_input.appendChild(sixth_child);
                update_brand_info_input.appendChild(seventh_child);
                update_brand_info_input.appendChild(update_btn_container);
                update_brand_info_input.classList = 'update_brand_info_input'

                main_container.appendChild(update_brand_info_input);

                cancel_update.addEventListener('click', () => {
                    main_container.removeChild(update_brand_info_input);
                });

                update_entry.addEventListener('click', () => {

                    const postData = {
                        brand_name: value.brand_name,
                        bottle_size: update_brand_info_input.children[2].value,
                        ws_price: update_brand_info_input.children[4].value,
                        s_price: update_brand_info_input.children[6].value,
                        item_count: value.item_count
                    };
                
                    const updates = {};
                    updates['items/' + entry[0]] = postData;
                    
                    update(ref(database), updates);
                    update_brand_info_input.style.display = 'none';
                })
                
            })
    
            newDiv.children[5].addEventListener('click',()=>{
                remove(ref(database, 'items/' + entry[0]));

            })
             
            newDiv.classList.add('brand_info');
            display_brand_infos.appendChild(newDiv);
        })

});

search_bar.addEventListener('input', (e) =>{
    const elements = document.querySelectorAll(".brand_info");

    elements.forEach(element=>{
        let search_name = e.target.value;
        search_name = search_name.toLowerCase().trim();

        let brand_info_name = element.children[0].innerHTML;
        brand_info_name = brand_info_name.toLowerCase().trim().slice(0, search_name.length);
        
        if(brand_info_name != search_name){
            element.style.display="none";

        }else{
            element.style.display="flex";
        }
            
    })

});

add_brand_info_btn.addEventListener('click', () => add_brand_info_input.style.display = 'flex');

exit.addEventListener('click', () => add_brand_info_input.style.display = 'none');

save_entry.addEventListener('click', (e) => {
    if(brand_name.value && bottle_size.value &&
        ws_price.value && s_price.value){

            const brand_info = {
                brand_name: brand_name.value,
                bottle_size: bottle_size.value,
                ws_price: ws_price.value,
                s_price: s_price.value,
                item_count: 0
            }

            push(itemList, brand_info);
            Array.from(add_brand_info_input.children).forEach((child) => child.value='')

    }
});

