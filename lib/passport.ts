import User from '../api/models/User'
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require('passport')


 passport.use(
    new GoogleStrategy({
        clientID:process.env.CLIENT_ID,
        clientSecret:process.env.CLIENT_SECRET,
        callbackURL:"/auth/google/callback",
        scope:["profile","email"]
    },
    async(accessToken:any,refreshToken:any,profile:any,done:any)=>{
        try {
            let user = await User.findOne({email:profile.emails[0].value});

            if(!user){
                user = new User({
                    firstName:profile.displayName,
                    email:profile.emails[0].value,
                    imgurl:profile.photos[0].value
                });

                await user.save();
            }

            return done(null,user)
        } catch (error) {
            return done(error,null)
        }
    }
    )
)

passport.serializeUser((user:any,done:any)=>{
    done(null,user);
})

passport.deserializeUser((user:any,done:any)=>{
    done(null,user);
});
export default passport