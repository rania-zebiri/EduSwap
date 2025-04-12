const express = require('express');
const router = express.Router();
const { adminDb } = require('../firebase-admin');
const User = require('../Models/user');
const Joi = require('joi');

// Helper middleware for validation
const validateUserData = (req, res, next) => {
  const { error } = User.schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

// Get user profile
router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const userRef = adminDb.collection(User.collection).doc(userId);
    const snapshot = await userRef.get();
    
    if (!snapshot.exists) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(200).json(snapshot.data());
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).send('Internal server error');
  }
});

// Update user skills
router.post('/:userId/skills', async (req, res) => {
  try {
    const userId = req.params.userId;
    const { skillsToTeach, skillsToLearn } = req.body;

    // Basic validation
    if (!skillsToTeach || !skillsToLearn) {
      return res.status(400).json({ error: 'Both skillsToTeach and skillsToLearn are required' });
    }

    await adminDb.collection(User.collection)
      .doc(userId)
      .update({
        skillsToTeach,
        skillsToLearn,
        lastActive: new Date().toISOString()
      });
      
    res.status(200).json({ message: 'Skills updated successfully' });
  } catch (error) {
    console.error('Error updating skills:', error);
    res.status(500).send('Internal server error');
  }
});

// Create/Update full user profile
router.post('/:userId', validateUserData, async (req, res) => {
  try {
    const userData = req.body;
    const userId = req.params.userId;

    if (userId !== userData.userId) {
      return res.status(400).send('User ID in path does not match body');
    }

    await adminDb.collection(User.collection)
      .doc(userId)
      .set(userData, { merge: true });
      
    res.status(200).json({ message: 'Profile updated successfully', user: userData });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).send('Internal server error');
  }
});

// Create sample user (dev only - remove in production)
router.post('/create-sample', async (req, res) => {
  try {
    const sampleUser = {
      userId: "1208",
      name: "Bouzourene Abdoullah Ishak",
      email: "abdougamer016@gmail.com",
      skillsToTeach: [
        { skill: "JavaScript", level: "intermediate" },
        { skill: "Boxing", level: "beginner" }
      ],
      skillsToLearn: ["Cooking", "Design"],
      rating: 4.2,
      availability: {
        weekends: true,
        weekdays: false,
        schedule: "After 6 PM"
      },
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    };

    await adminDb.collection(User.collection)
      .doc(sampleUser.userId)
      .set(sampleUser);
      
    res.status(201).json({ message: 'Sample user created', user: sampleUser });
  } catch (error) {
    console.error('Error creating sample user:', error);
    res.status(500).send('Internal server error');
  }
});

module.exports = router;

const { updateSkills } = require('../controllers/userController');
router.patch('/:userId/skills', updateSkills);