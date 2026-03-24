import { Router } from "express"
import { validate } from "../middleware/validate";

// import controllers
import { UserController } from "../controllers/user.controller";

// validation schemas
import { loginSchema, registerSchema } from "../validators/user.validator";

const router = Router();


// test route
router.get('/ping', (req, res) => {
    res.send('Pong! Server routes are working')
})

// AUTH ROUTES
router.post('/register', validate({ body: registerSchema }), UserController.register)
router.post('/login', validate({ body: loginSchema }), UserController.login)
// router.get('/users/:id')

export default router