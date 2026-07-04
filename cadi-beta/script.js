const usernameInput = document.getElementById('user');
const passwordInput = document.getElementById('password');
const form = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');


const users = [
    { name: 'Samuel',user: '188902', password: '1234' },
    { name: 'Axel',user: '189301', password: '5678' },
    { name: 'Naomi', user: '188332', password: '9012' },
    { name: 'Johana', user: '188254', password: '3456' },
];

const login = (username, password) => {
    const user = users.find(user => user.user === username && user.password === password);
    return user;
};


form.addEventListener("submit", e=>{
    e.preventDefault();
    errorMessage.innerHTML = "";


    let isaStudent = false;
    if(usernameInput.value === ''){
        errorMessage.innerHTML += 'Please enter your UPSLP ID <br>';
        isaStudent = true;
    }
    if(usernameInput.value.length !== 6){
        errorMessage.innerHTML += 'Log in with your UPSLP ID; it must be 6 digits long. <br>';
        isaStudent = true;
    }
    if (passwordInput.value === '') {
        errorMessage.innerHTML += 'Please enter your password <br>';
        isaStudent = true;
    }

    if(!isaStudent){
        const user = login(usernameInput.value, passwordInput.value);
        if (!user) {
            errorMessage.innerHTML += 'Invalid username or password <br>';
        }else{
            errorMessage.style.color = 'green';
            errorMessage.innerHTML = 'Login successful! Redirecting...<br>';
            document.body.classList.add('fade-out');
            setTimeout(() => {
                window.location.href = 'agenda.html';
            }, 2000);
        }
    }
});
