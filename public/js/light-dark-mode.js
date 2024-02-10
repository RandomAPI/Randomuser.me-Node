(function(){
body = document.querySelector('body')
let p = document.querySelectorAll('p')
let input = document.querySelectorAll('pre')
let btn = document.querySelector('#modes')
let h2 = document.querySelectorAll('h2');
let card = document.querySelector('.card')
let modeStauts = document.querySelector('#off-on');
const darkmode = () =>{
    switch (modeStauts.innerText) {
        case 'OFF':
            modeStauts.innerText = 'ON'
            break;
        case 'ON':
            modeStauts.innerText = 'OFF'
            break;
    
        default:
            break;
    }
    //  common of all pages
    body.classList.toggle('dark');
    p.forEach(element => {
        element.classList.toggle('dark-content')
    });
    input.forEach(element => {
        element.classList.toggle('dark-content')
    })
    h2.forEach(element =>{
        element.classList.toggle('h-dark')
    })
    // For index page
    if (window.location.href.match(/index$/)){

        card.classList.toggle('card-dark');
    }
    // For Documentation Page and Changelog Page
    if(window.location.href.match(/documentation$/) || window.location.href.match(/changelog$/)){
        let li = document.querySelectorAll('.doc-ul > li')  
        //  The .doc-ul class is also added to the 'ul's of changelog page 
        li.forEach(element => {
            element.classList.toggle('dark-content')  
          });
    }
    // For stats page 
    if(window.location.href.match(/stats$/)){
        let span = document.querySelectorAll('span');
        span.forEach(element => {
            element.classList.toggle('dark')
        })
    }   
}
btn.addEventListener('click', ()=>{
    // get value of 'dark' item form localstorage on every click
    setDarkMode = localStorage.getItem('dark');
    if(setDarkMode !== 'ON'){
        darkmode();
        // set vlaue to 'ON' of dark node is on
        setDarkMode = localStorage.setItem('dark', 'ON')
    }else{
        darkmode();
        // set vlaues to 'null' of dark mode is off
        setDarkMode = localStorage.setItem('dark', null)
    }
})
// get vlaue of 'dark' item form local storage;
let setDarkMode = localStorage.getItem('dark')
// cheak mode 'on-off' on page reload;
if(setDarkMode === 'ON'){
    darkmode()
}
})();