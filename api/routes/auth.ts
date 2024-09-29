import { Request, Response } from 'express';
 const router = require("express").Router();

import jwt from 'jsonwebtoken'; // Import jsonwebtoken

const passport = require("passport");
const JWT_SECRET = 'your_jwt_secret';
router.get("/login/success", (req: any, res: Response) => {

    console.log(req.user)
    const user = req.user

    const payload = {
        email: user.email,
        firstName: user.firstName,
        userID: user._id
      };
  
      // Generate the JWT token
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); // Token expires in 1 hour
      
  
	if (req.user) {
		

        if (typeof sessionStorage !== 'undefined') {
            // Fallback to sessionStorage if localStorage is not supported
            sessionStorage.setItem('token', token);
          } 

          res.redirect(`http://localhost:3001?token=${token}`);

    

	} else {
		res.status(403).json({ error: true, message: "Not Authorized" });
	}
});

router.get("/login/failed", (req: Request, res: Response) => {
	res.status(401).json({
		error: true,
		message: "Log in failure",
	});
});

router.get("/google", passport.authenticate("google", ["profile", "email"]));

router.get(
	"/google/callback",
	passport.authenticate("google", {
		successRedirect: 'http://localhost:3000/auth/login/success',
		failureRedirect: "/login/failed",
	})

);

router.get("/logout", (req: Request, res: Response) => {
	 res.redirect(process.env.CLIENT_URL || '');
});

export default router