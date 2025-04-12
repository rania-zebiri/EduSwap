// Initialize Firebase (same as auth.js)
const auth = firebase.auth();
const db = firebase.firestore();

// DOM Elements
const teachList = document.getElementById('teach-list');
const learnList = document.getElementById('learn-list');
const logoutBtn = document.getElementById('logout-btn');

// Authentication Check
auth.onAuthStateChanged(user => {
    if (!user) {
        window.location.href = 'index.html';
    } else {
        loadUserSkills(user.uid);
    }
});

// Load User Skills
function loadUserSkills(userId) {
    db.collection('users').doc(userId).get()
        .then(doc => {
            if (doc.exists) {
                const data = doc.data();
                renderSkills('teach-list', data.skillsToTeach || []);
                renderSkills('learn-list', data.skillsToLearn || []);
            }
        })
        .catch(error => console.error("Error loading skills:", error));
}

// Render Skills to UI
function renderSkills(listId, skills) {
    const listElement = document.getElementById(listId);
    listElement.innerHTML = '';

    if (skills.length === 0) {
        listElement.innerHTML = '<p class="empty-state">No skills added yet</p>';
        return;
    }

    skills.forEach(skill => {
        const skillItem = document.createElement('div');
        skillItem.className = 'skill-item';
        
        if (typeof skill === 'object') {
            skillItem.innerHTML = `
                <strong>${skill.skill}</strong>
                <span class="skill-level">(${skill.level})</span>
            `;
        } else {
            skillItem.textContent = skill;
        }
        
        listElement.appendChild(skillItem);
    });
}

// Logout
logoutBtn.addEventListener('click', () => {
    auth.signOut();
});

// Add Teaching Skill
document.getElementById('add-teach-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const skill = document.getElementById('new-teach-skill').value.trim();
    const level = document.getElementById('teach-level').value;

    if (!skill || !level) return;

    try {
        await db.collection('users').doc(userId).update({
            skillsToTeach: firebase.firestore.FieldValue.arrayUnion({
                skill,
                level
            }),
            lastActive: firebase.firestore.FieldValue.serverTimestamp()
        });
        e.target.reset();
        loadUserSkills(userId);
    } catch (error) {
        console.error("Error adding teaching skill:", error);
    }
});

// Add Learning Skill
document.getElementById('add-learn-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const skill = document.getElementById('new-learn-skill').value.trim();
    if (!skill) return;

    try {
        await db.collection('users').doc(userId).update({
            skillsToLearn: firebase.firestore.FieldValue.arrayUnion(skill),
            lastActive: firebase.firestore.FieldValue.serverTimestamp()
        });
        e.target.reset();
        loadUserSkills(userId);
    } catch (error) {
        console.error("Error adding learning skill:", error);
    }
});

// Clear Skills
document.getElementById('clear-teach').addEventListener('click', async () => {
    if (confirm('Clear all teaching skills?')) {
        const userId = auth.currentUser?.uid;
        await db.collection('users').doc(userId).update({
            skillsToTeach: [],
            lastActive: firebase.firestore.FieldValue.serverTimestamp()
        });
        loadUserSkills(userId);
    }
});

document.getElementById('clear-learn').addEventListener('click', async () => {
    if (confirm('Clear all learning skills?')) {
        const userId = auth.currentUser?.uid;
        await db.collection('users').doc(userId).update({
            skillsToLearn: [],
            lastActive: firebase.firestore.FieldValue.serverTimestamp()
        });
        loadUserSkills(userId);
    }
});