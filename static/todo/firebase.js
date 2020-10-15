const loginForm = document.querySelector('.login-form');
const regForm = document.querySelector('.register-form');
const logoutButton = document.querySelector('.logout');
const mainApp = document.querySelector('.app');

// On page refresh checking for logged in user
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        document.querySelector('.sk-folding-cube').style.display = 'none'
        mainApp.style.display = "initial"
        loginForm.parentElement.style.display = "none"
    } else {
        setTimeout(() =>{
            mainApp.style.display = "none"
            document.querySelector('.sk-folding-cube').style.display = 'none'
            loginForm.parentElement.style.display = "initial"
            document.querySelector('.login').style.display = 'initial'
        }, 2000)
    }
});

// Logging in using firebase
const firebaseLogin = (email, password) => {
    firebase.auth().signInWithEmailAndPassword(email, password).catch((e) => {
        //
        var errorCode = e.code;
        var errorMsg = e.message;

        swal({
            title: "Login Failed",
            text: e.message,
            icon: "warning",
            buttons: false,
            dangerMode: true,
          })
    });
};

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = loginForm.email.value;
    const password = loginForm.password.value;

    firebaseLogin(email, password);
})

// Firebase logout
logoutButton.addEventListener('click', () => {
    firebase.auth().signOut().then(() => {
        // 
    }).catch(() => {
        //
    });
});

const firebaseRegister = (email, password) => {
    firebase.auth().createUserWithEmailAndPassword(email, password).then(() => {
        
    }).catch(function(error) {
        // Handle Errors here.
        swal({
            title: "Registration Failed",
            text: error.message,
            icon: "warning",
            buttons: false,
            dangerMode: true,
          })
    });
};

regForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = regForm.remail.value;
    const password = regForm.rpassword.value;

    firebaseRegister(email, password);
});