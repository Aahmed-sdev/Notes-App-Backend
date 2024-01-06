const routes = require('express').Router();
const bodyParser = require('body-parser');
const validateToken = require("../middleware/validateToken")
const {createnoteshandlers, getAllNotesHandlers, findNotesByIdHandlers, updateNotesByIdHandlers, shareNotesHandlers, seachNotesHandlers} = require("../controller/noteController")
const {registerUser, authenticateUser, currentUser} = require("../controller/authController")
routes.use(bodyParser.json());
routes.use(validateToken)



routes.get('/api/notes',getAllNotesHandlers)

routes.post('/api/notes',createnoteshandlers);

routes.get('/api/search',seachNotesHandlers)

routes.get('/api/notes/:id',findNotesByIdHandlers)

routes.put('/api/notes/:id',updateNotesByIdHandlers)

routes.post('/api/notes/:id/share', shareNotesHandlers)

routes.post('/api/auth/signup',registerUser );

routes.post('/api/auth/login', authenticateUser);

routes.get('/api/auth/current',validateToken, currentUser);

routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});

module.exports = routes;