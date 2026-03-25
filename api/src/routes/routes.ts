import { Router } from "express"
import { validate } from "../middleware/validate";

// import controllers
import { UserController } from "../modules/auth/user.controller";

// validation schemas
import { loginSchema, registerSchema } from "../modules/auth/user.validator";

const router = Router();


// test route
router.get('/ping', (req, res) => {
    res.send('Pong! Server routes are working')
})

// AUTH ROUTES
router.post('/register', validate({ body: registerSchema }), UserController.register)
router.post('/login', validate({ body: loginSchema }), UserController.login)
router.post('/refresh', UserController.refreshTokens)
// router.get('/users/:id')

// APPLICATION ROUTES
router
    .route("/applications")
    .post((req, res) => {
        res.send("Called POST applications");
    })
    .get((req, res) => {
        res.send("Called GET applications");
    });

router
    .route("/applications/:id")
    .get((req, res) => {
        const { id } = req.params;
        res.send("Called GET application by id");
    })
    .put((req, res) => {
        const { id } = req.params;
        res.send("Called PUT application by id");
    })
    .delete((req, res) => {
        const { id } = req.params;
        res.send("Called DELETE application by id");
    });

export default router