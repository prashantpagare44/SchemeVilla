import User from '../models/USER_MODEL.js';
import twilio from 'twilio';
import jwt from 'jsonwebtoken';

const client = twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

// Login / Send OTP (Ab yeh direct Twilio se OTP bhejega)
export const login = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ message: "Phone is required" });
    }

    // Send OTP using Twilio
    await client.verify.v2
      .services(process.env.VERIFY_SERVICE_SID)
      .verifications.create({
        to: `+91${phone}`, // India number
        channel: "sms",
      });

    return res.status(200).json({ message: "OTP sent successfully via SMS" });
  } catch (error) {
    return res.status(500).json({ message: "Error sending OTP", error: error.message });
  }
};

// sendOtp is exactly the same as login now, exporting it to not break routes
export const sendOtp = login;

// Verify OTP & Process Database User
export const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ message: "Phone and OTP are required" });
    }
    
    const verificationCheck = await client.verify.v2
      .services(process.env.VERIFY_SERVICE_SID)
      .verificationChecks.create({
        to: `+91${phone}`,
        code: otp,
      });
      
    if (verificationCheck.status === "approved") {
     
      let user = await User.findOne({ phone });
      
      if (!user) {
        // Agar first-time user hai, toh DB mein create karo
        user = await User.create({
          phone,
          role: "retailer"
        });
      }

    
      const payload = {
        id: user._id,
        phone: user.phone,
        role: user.role
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }); 

      return res.status(200).json({ message: "Login successful", user, token });
    } else {
      return res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    // Twilio returns a 404 status if the OTP has expired or was already used
    if (error.status === 404) {
      return res.status(400).json({ message: "OTP expired, invalid, or already verified. Please request a new one." });
    }
    return res.status(500).json({ error: error.message });
  }
};

export const Logout = (req, res) => {
  // Add logic to clear user tokens or session
  return res.status(200).json({ message: "Logout successful" });
}

// @desc    Get user profile
// @route   GET /auth/api/profile
// @access  Private (Protected)
export const getProfile = async (req, res) => {
  try {
    
    const user = await User.findById(req.user._id).select('-__v'); 
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};