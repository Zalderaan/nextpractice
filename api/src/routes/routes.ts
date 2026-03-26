import { Router } from "express"
import { validate } from "../middleware/validate";

// import controllers
import { UserController } from "../modules/auth/user.controller";

// validation schemas
import { loginSchema, registerSchema } from "../modules/auth/user.validator";
import { authenticate } from "../middleware/authCheck";

const router = Router();


// test route
router.get('/ping', (req, res) => {
    res.status(200).json({
        success: true,
        message: "Pong! Server working :)"
    }); })

// AUTH ROUTES
router.post('/register', validate({ body: registerSchema }), UserController.register)
router.post('/login', validate({ body: loginSchema }), UserController.login)
router.post('/refresh', UserController.refreshTokens)
// router.get('/users/:id')

// PROTECTED
router.get('/protected', authenticate, (req, res) => {
    res.json({ message: 'Protected data', user: (req as any).user });
});
// APPLICATION ROUTES
router
    .route("/applications")
    .post((req, res) => {
        res.status(200).json({
            success: true,
            message: "Called POST applications"
        });
    })
    .get((req, res) => {
        res.status(200).json({
            success: true,
            message: "Called GET applications"
        });
    });

router
    .route("/applications/:id")
    .get((req, res) => {
        const { id } = req.params;
        res.send(`Called GET application id: ${id}`);
    })
    .put((req, res) => {
        const { id } = req.params;
        res.send(`Called PUT application id: ${id}`);
    })
    .delete((req, res) => {
        const { id } = req.params;
        res.send(`Called DELETE application id: ${id}`);
    });

export default router