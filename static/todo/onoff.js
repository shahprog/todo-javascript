window.addEventListener('online', () => {
    document.querySelector('.sk-folding-cube').style.display = 'none'
    if(firebase.auth().currentUser){
        document.querySelector('.app').style.display = 'initial'
    }else{
        document.querySelector('.login').style.display = 'initial'
    }
    
})

window.addEventListener('offline', () => {
    document.querySelector('.sk-folding-cube').style.display = 'initial'
    document.querySelector('.login').style.display = 'none'
    document.querySelector('.app').style.display = 'none'
})