import { Router } from "express"
import { validate } from "../middleware/validate";

// import controllers
import { UserController } from "../modules/auth/user.controller";

// validation schemas
import { loginSchema, registerSchema } from "../modules/auth/user.validator";
import { authenticate } from "../middleware/authCheck";
import Application from "../modules/applications/Application.model";
import { ApplicationController } from "../modules/applications/application.controller";
import { createApplicationSchema } from "../modules/applications/application.validator";

const router = Router(); // for public routes
const protected_router = Router(); // for protected routes
protected_router.use(authenticate);


// ---------------------- PUBLIC ---------------------
// test route
router.get('/ping', (req, res) => {
    res.status(200).json({
        success: true,
        message: "Pong! Server working :)"
    });
})

// AUTH ROUTES
router.post('/register', validate({ body: registerSchema }), UserController.register)
router.post('/login', validate({ body: loginSchema }), UserController.login)
router.post('/refresh', UserController.refreshTokens)
// router.get('/users/:id')





// ---------------------- PROTECTED ---------------------
protected_router.get('/protected', (req, res) => {
    res.json({ message: 'Protected data', user: (req as any).user });
});

// TEST PROTECTED
protected_router.get('/test_protected', (req, res) => {
    const userId = (req as any).user?.id;
    res.status(200).json({
        success: true,
        message: "Called GET applications"
    });
});

// APPLICATION ROUTES
protected_router
    .route("/applications")
        .post( validate({ body: createApplicationSchema }), ApplicationController.postApplication)
        .get((req, res) => {
            res.status(200).json({
                success: true,
                message: "Called GET applications"
            });
        });

protected_router
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

export {
    router,
    protected_router,
} 
