// Firebase Initialization
const firebaseConfig = {
    apiKey: "AIzaSyAS8z9R1np8vcoIXGyEHQDPgpdSNlJyOPw",
    authDomain: "eduswap-142dc.firebaseapp.com",
    projectId: "eduswap-142dc",
    storageBucket: "eduswap-142dc.appspot.com",
    messagingSenderId: "875282442068",
    appId: "1:875282442068:web:b683363bf790dca4414ac1"
};
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// DOM Elements
const authForm = document.getElementById('auth-form');
const resetForm = document.getElementById('reset-form');
const resetModal = document.getElementById('reset-modal');
const forgotPassword = document.getElementById('forgot-password');
const toggleLink = document.getElementById('toggle-link');
const authSubmit = document.getElementById('auth-submit');
const formTitle = document.querySelector('h2');
const toggleText = document.getElementById('toggle-text');
const rememberMe = document.getElementById('remember-me');
const wilayaGroup = document.getElementById('wilaya-group');

// State
let isLogin = true;

// Initialize Form View
function initFormView() {
    wilayaGroup.style.display = isLogin ? 'none' : 'block';
    formTitle.textContent = isLogin ? 'Welcome to EduSwap' : 'Create an Account';
    authSubmit.textContent = isLogin ? 'Login' : 'Register';
    toggleText.textContent = isLogin ? "Don't have an account?" : "Already have an account?";
    toggleLink.textContent = isLogin ? "Register" : "Login";
}

// Check for Remembered Email
if (localStorage.getItem('rememberEmail')) {
    document.getElementById('auth-email').value = localStorage.getItem('rememberEmail');
    rememberMe.checked = true;
}

// Toggle Between Login/Register
toggleLink.addEventListener('click', (e) => {
    e.preventDefault();
    isLogin = !isLogin;
    initFormView();
    document.getElementById('auth-error').textContent = '';
});

// Forgot Password
forgotPassword.addEventListener('click', (e) => {
    e.preventDefault();
    resetModal.style.display = 'flex';
});

// Close Modal
resetModal.addEventListener('click', (e) => {
    if (e.target === resetModal) {
        resetModal.style.display = 'none';
    }
});

// Password Reset
resetForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('reset-email').value;
    const resetMessage = document.getElementById('reset-message');
    
    try {
        await auth.sendPasswordResetEmail(email);
        resetMessage.textContent = `Password reset link sent to ${email}`;
        resetMessage.style.color = "green";
        setTimeout(() => {
            resetModal.style.display = 'none';
            resetMessage.textContent = '';
        }, 3000);
    } catch (error) {
        resetMessage.textContent = error.message;
        resetMessage.style.color = "red";
    }
});

// Authentication Handler
authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    const authError = document.getElementById('auth-error');

    try {
        // Validate inputs
        if (!email || !password) {
            throw new Error('Please fill all fields');
        }

        if (!isLogin && !document.getElementById('user-wilaya').value) {
            throw new Error('Please select your wilaya');
        }

        // Set persistence
        const persistence = rememberMe.checked 
            ? firebase.auth.Auth.Persistence.LOCAL 
            : firebase.auth.Auth.Persistence.SESSION;
        
        await auth.setPersistence(persistence);
        
        // Remember email if checked
        if (rememberMe.checked) {
            localStorage.setItem('rememberEmail', email);
        } else {
            localStorage.removeItem('rememberEmail');
        }

        if (isLogin) {
            // Login
            await auth.signInWithEmailAndPassword(email, password);
        } else {
            // Registration
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const wilaya = document.getElementById('user-wilaya').value;
            
            // Save additional user data
            await db.collection('users').doc(userCredential.user.uid).set({
                email: email,
                wilaya: wilaya,
                skillsToTeach: [],
                skillsToLearn: [],
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                lastActive: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        
        // Redirect to skills page
        window.location.href = 'skills.html';
    } catch (error) {
        authError.textContent = error.message;
    }
});

// Initialize form view on load
initFormView();