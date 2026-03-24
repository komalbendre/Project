// backend/controllers/settingsController.js
import UserSettings from "../models/UserSettings.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";


// @desc    Get user settings
// @route   GET /api/settings
// @access  Private
export const getSettings = async (req, res) => {
  try {
    let settings = await UserSettings.findOne({ userId: req.user._id });
    
    // If no settings exist, create default settings
    if (!settings) {
      settings = new UserSettings({ 
        userId: req.user._id,
        // Default values will be used from schema
      });
      await settings.save();
      console.log('Created default settings for user:', req.user._id);
    }
    
    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error("Get settings error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching settings"
    });
  }
};

// @desc    Update notification settings
// @route   PUT /api/settings/notifications
// @access  Private
export const updateNotifications = async (req, res) => {
  try {
    const { email, push } = req.body;
    
    const settings = await UserSettings.findOneAndUpdate(
      { userId: req.user._id },
      { 
        $set: { 
          notifications: { email, push }
        } 
      },
      { new: true, upsert: true }
    );
    
    res.status(200).json({
      success: true,
      message: "Notification settings updated",
      data: settings.notifications
    });
  } catch (error) {
    console.error("Update notifications error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating notifications"
    });
  }
};

// @desc    Update privacy settings
// @route   PUT /api/settings/privacy
// @access  Private
export const updatePrivacy = async (req, res) => {
  try {
    const { profileVisibility, showEmail, showPhone, showResume, allowMessagesFrom } = req.body;
    
    const settings = await UserSettings.findOneAndUpdate(
      { userId: req.user._id },
      { 
        $set: { 
          privacy: { profileVisibility, showEmail, showPhone, showResume, allowMessagesFrom }
        } 
      },
      { new: true, upsert: true }
    );
    
    res.status(200).json({
      success: true,
      message: "Privacy settings updated",
      data: settings.privacy
    });
  } catch (error) {
    console.error("Update privacy error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating privacy"
    });
  }
};

// @desc    Update appearance settings
// @route   PUT /api/settings/appearance
// @access  Private
export const updateAppearance = async (req, res) => {
  try {
    const { theme, language, defaultResumeTemplate, compactView } = req.body;
    
    const settings = await UserSettings.findOneAndUpdate(
      { userId: req.user._id },
      { 
        $set: { 
          appearance: { theme, language, defaultResumeTemplate, compactView }
        } 
      },
      { new: true, upsert: true }
    );
    
    res.status(200).json({
      success: true,
      message: "Appearance settings updated",
      data: settings.appearance
    });
  } catch (error) {
    console.error("Update appearance error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating appearance"
    });
  }
};

// @desc    Update preferences
// @route   PUT /api/settings/preferences
// @access  Private
export const updatePreferences = async (req, res) => {
  try {
    const { defaultJobSearchRadius, preferredJobTypes, preferredLocations, desiredSalary, skillLevel } = req.body;
    
    const settings = await UserSettings.findOneAndUpdate(
      { userId: req.user._id },
      { 
        $set: { 
          preferences: { defaultJobSearchRadius, preferredJobTypes, preferredLocations, desiredSalary, skillLevel }
        } 
      },
      { new: true, upsert: true }
    );
    
    res.status(200).json({
      success: true,
      message: "Preferences updated",
      data: settings.preferences
    });
  } catch (error) {
    console.error("Update preferences error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating preferences"
    });
  }
};

// @desc    Change password
// @route   PUT /api/settings/change-password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Get user with password
    const user = await User.findById(req.user._id);
    
    // Check current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect"
      });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    // Update last password change in settings
    await UserSettings.findOneAndUpdate(
      { userId: req.user._id },
      { 
        $set: { 
          'account.lastPasswordChange': new Date()
        } 
      },
      { upsert: true }
    );
    
    res.status(200).json({
      success: true,
      message: "Password changed successfully"
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while changing password"
    });
  }
};

// @desc    Delete account
// @route   DELETE /api/settings/account
// @access  Private
export const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    
    // Get user with password
    const user = await User.findById(req.user._id);
    
    // Verify password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Password is incorrect"
      });
    }
    
    // Delete user settings first
    await UserSettings.findOneAndDelete({ userId: req.user._id });
    
    // Delete user
    await User.findByIdAndDelete(req.user._id);
    
    res.status(200).json({
      success: true,
      message: "Account deleted successfully"
    });
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting account"
    });
  }
};

// @desc    Update account settings (2FA, session timeout)
// @route   PUT /api/settings/account
// @access  Private
export const updateAccountSettings = async (req, res) => {
  try {
    const { twoFactorAuth, sessionTimeout } = req.body;
    
    const settings = await UserSettings.findOneAndUpdate(
      { userId: req.user._id },
      { 
        $set: { 
          account: { twoFactorAuth, sessionTimeout }
        } 
      },
      { new: true, upsert: true }
    );
    
    res.status(200).json({
      success: true,
      message: "Account settings updated",
      data: settings.account
    });
  } catch (error) {
    console.error("Update account settings error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating account settings"
    });
  }
};