import exp from 'express';
export const commonRouter =exp.Router();
import { authenticate } from '../services/AuthService.js';
import { verifyToken } from '../middlewares/verifyToken.js';    
import { checkAuthor } from '../middlewares/checkAuthor.js';    


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



//change the password (protected route)
commonRouter.put(
  '/change-password',
  verifyToken,
  checkAuthor,
  async (req, res) => {
    try {

      const userId = req.user._id;  // from verifyToken
      const { oldPassword, newPassword } = req.body;

      // Validate input
      if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Find user
      const user = await UserTypeModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Compare old password
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Old password is incorrect" });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password
      user.password = hashedPassword;
      await user.save();

      res.status(200).json({ message: "Password changed successfully" });

    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
);
