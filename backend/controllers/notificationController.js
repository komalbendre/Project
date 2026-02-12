import Notification from "../models/Notification.js";

/**
 * @desc    Create a notification for interview scheduled
 * @access  Internal
 */
export const createInterviewNotification = async (userId, companyName, internshipTitle, interviewDate) => {
  try {
    const formattedDate = new Date(interviewDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const notification = new Notification({
      userId,
      type: 'interview_scheduled',
      title: 'Interview Scheduled',
      message: `Your interview for ${internshipTitle} at ${companyName} has been scheduled on ${formattedDate}`,
      company: companyName,
      position: internshipTitle,
      actionUrl: `/applications`,
      read: false,
      createdAt: new Date()
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error("Error creating interview notification:", error);
    throw error;
  }
};