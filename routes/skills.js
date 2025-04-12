document.getElementById('add-teach-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const skill = document.getElementById('new-teach-skill').value;
    const level = document.getElementById('teach-level').value;
    
    await fetch(`/api/users/${currentUserId}/skills`, {
      method: 'PATCH',
      body: JSON.stringify({
        skillsToTeach: [{ skill, level }]
      })
    });
  });
  
  document.getElementById('add-learn-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const skill = document.getElementById('new-learn-skill').value;
    
    await fetch(`/api/users/${currentUserId}/skills`, {
      method: 'PATCH',
      body: JSON.stringify({
        skillsToLearn: [skill]
      })
    });
  });