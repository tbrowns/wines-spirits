var scrollTrigger = 50;
const nava = document.getElementById('header');
window.onscroll = function () {
    if (window.scrollY >= scrollTrigger) {
            nava.style.background = "rgba(255, 255, 255, .8)"
            nava.style.zIndex = "99";
            nava.style.boxShadow = "0px 0px 10px whitesmoke";

    }else {
        nava.style.background = "none"
        nava.style.zIndex = "99";
        nava.style.boxShadow = "none";
    }
}

const side_bar = document.getElementById("side_bar");

export function getLocalISOString(){
    const currentDate = new Date();
    const localISOString = new Date(currentDate - currentDate.getTimezoneOffset() * 60000).toISOString();

    return localISOString.split('T')[0]
}

document.getElementById("close_menu_container").addEventListener('click', ()=>{
    side_bar.style.display= 'none'

})

document.getElementById("open_menu_container").addEventListener('click', ()=>{
   side_bar.style.display= 'flex'

})