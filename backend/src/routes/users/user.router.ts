import * as express from "express";
import multer from "multer";
import { GetStorage } from "../../utility/uploader";
import { LoadAuthorization, ValidateBearerToken, ValidateBasicAuth, LoadAuthorizedUser } from "../../middleware/common.middleware";
import { ForgetPassword, LoginByEmailAndPassword, Register, ResetPassword, VerifyEmailAndActivateAccount } from "./user.controller";
import { EditProfile, GetProfile } from "./controllers/user.profile.controller";
import { CreatePost, DeletePostById, EditPost, GetPost, GetPostByUserId } from "./controllers/user.post.controller";
import { CreateJob, DeleteJob, EditJob, GetJobs, GetJobsById, GetJobsByUserId } from "./controllers/user.job.controller";

class UserRouting {
    public router: express.Router;
    public upload = multer({ storage: GetStorage() });
    constructor() {
        this.router = express.Router();
        this.configRoutes();
    }

    public configRoutes() {

        // Registration Routes
        this.router.post('/register', Register);
        this.router.post('/verify-email/:id/:token', VerifyEmailAndActivateAccount);

        // Login Routes
        this.router.get('/authentication', [...ValidateBasicAuth, ...LoadAuthorization], LoginByEmailAndPassword);

        // Forget Password
        this.router.post('/forget-password', ForgetPassword);
        this.router.post('/verify-reset-token/:id/:token', VerifyEmailAndActivateAccount);
        this.router.post('/reset-password', ResetPassword);

        // User Routes
        this.router.get('/profile/:id', [...ValidateBearerToken, ...LoadAuthorization, ...LoadAuthorizedUser], GetProfile)
        this.router.post('/profile', [...ValidateBearerToken, ...LoadAuthorization, ...LoadAuthorizedUser, this.upload.single('profile')], EditProfile);

        // Post Routes
        this.router.post('/add/post', [...ValidateBearerToken, ...LoadAuthorization, ...LoadAuthorizedUser, this.upload.single('post')], CreatePost);
        this.router.get('/post', [...ValidateBearerToken, ...LoadAuthorization, ...LoadAuthorizedUser], GetPost);
        this.router.get('/post/:id', [...ValidateBearerToken, ...LoadAuthorization, ...LoadAuthorizedUser], GetPostByUserId);
        this.router.delete('/post/:id', [...ValidateBearerToken, ...LoadAuthorization, ...LoadAuthorizedUser], DeletePostById);
        this.router.post('/post/:id', [...ValidateBearerToken, ...LoadAuthorization, ...LoadAuthorizedUser, this.upload.single('edit')], EditPost);

        // Job Routes
        this.router.post('/add/job', [...ValidateBearerToken, ...LoadAuthorization, ...LoadAuthorizedUser], CreateJob);
        this.router.get('/jobs', [...ValidateBearerToken, ...LoadAuthorization, ...LoadAuthorizedUser], GetJobs);
        this.router.get('/job/:id', [...ValidateBearerToken, ...LoadAuthorization, ...LoadAuthorizedUser], GetJobsById);
        this.router.get('/job/user/:userId', [...ValidateBearerToken, ...LoadAuthorization, ...LoadAuthorizedUser], GetJobsByUserId);
        this.router.post('/job/:id', [...ValidateBearerToken, ...LoadAuthorization, ...LoadAuthorizedUser], EditJob);
        this.router.delete('/delete/:jobId/:userId', [...ValidateBearerToken, ...LoadAuthorization, ...LoadAuthorizedUser], DeleteJob);
    }
}

const UserRouter = new UserRouting().router;
export {
    UserRouter,
}