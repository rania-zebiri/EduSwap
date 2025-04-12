const { login, register } = require('../controllers/authController');
router.post('/login', login);
router.post('/register', register);