import exp from 'express';
export const commonRouter =exp.Router();
import { authenticate } from '../services/AuthService.js';
import { verifyToken } from '../middlewares/verifyToken.js';    
import { checkAuthor } from '../middlewares/checkAuthor.js';    
import UserTypeModel from '../models/UserModel.js';
import bcrypt from 'bcryptjs';  


//login 
commonRouter.post('/login',async(req,res)=>{


      try {
        const userCred = req.body;
        const { token, user } = await authenticate(userCred);
    
        res.cookie("token", token, {
          httpOnly: true,
          sameSite: "lax",
          secure: false,
        });
    
        res.status(200).json({ message: "login success", payload: user});
      } catch (err) {
        res.status(401).json({ message: "invalid credentials", error: err.message });
      }

});




//logout for User, Author and Admin
commonRouter.get('/logout', (req, res) => {
  // Clear the cookie named 'token'
  res.clearCookie('token', {
    httpOnly: true, // Must match original  settings
    secure: false,   // Must match original  settings
    sameSite: 'lax' // Must match original  settings
  });
  
  res.status(200).json({ message: 'Logged out successfully' });
});



// Change Password Route
// Allows a user to update their password

commonRouter.put('/change-password', async (req, res) => {
  try {

    // Extract email, current password and new password from request body
    let { email, currentPassword, newPassword } = req.body;

    // Find the user in the database using the provided email
    let userObj = await UserTypeModel.findOne({ email });

    // If user is not found, return 404 error
    if (!userObj) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the entered current password with the hashed password in database
    let isMatched = await bcrypt.compare(
      currentPassword,      // Password entered by user
      userObj.password      // Hashed password stored in DB
    );

    // If passwords do not match, return unauthorized error
    if (!isMatched) {
      return res.status(401).json({ message: "Old Password is Invalid" });
    }

    // Hash the new password before saving it
    // 10 represents the salt rounds used for hashing
    let newHashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    await UserTypeModel.findByIdAndUpdate(
      userObj._id,
      { $set: { password: newHashedPassword } }
    );

    // Send success response
    res.status(200).json({ message: "Password changed successfully" });

  } catch (error) {
    // Handle unexpected errors
    res.status(400).json({ message: error.message });
  }
});

