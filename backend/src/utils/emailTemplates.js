const getJoinRideTemplate = (hostName, joinerName, ride) => {
  return `
    <div style="font-family: sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #4f46e5; padding: 24px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">New Travel Mate!</h1>
      </div>
      <div style="padding: 32px;">
        <p style="font-size: 16px; line-height: 1.5;">Hi <strong>${hostName}</strong>,</p>
        <p style="font-size: 16px; line-height: 1.5;">Exciting news! <strong>${joinerName}</strong> has just joined your ride to <strong>${ride.destination}</strong>.</p>
        
        <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h2 style="font-size: 14px; color: #64748b; text-transform: uppercase; margin-top: 0; letter-spacing: 0.05em;">Ride Details</h2>
          <p style="margin: 8px 0;"><strong>From:</strong> ${ride.from}</p>
          <p style="margin: 8px 0;"><strong>To:</strong> ${ride.destination}</p>
          <p style="margin: 8px 0;"><strong>Time:</strong> ${new Date(ride.dateTime).toLocaleString()}</p>
        </div>
        
        <p style="font-size: 16px; line-height: 1.5;">You can now coordinate with them via the RideMate platform.</p>
        
        <div style="text-align: center; margin-top: 32px;">
          <a href="${process.env.FRONTEND_URL}/all-rides" style="background-color: #4f46e5; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px;">Go to site</a>
        </div>
      </div>
      <div style="background-color: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #94a3b8;">
        &copy; ${new Date().getFullYear()} RideMate. Shared journeys, simplified travel.
      </div>
    </div>
  `;
};

const getLeaveRideTemplate = (hostName, leaverName, ride) => {
  return `
    <div style="font-family: sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #f43f5e; padding: 24px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Update on your Ride</h1>
      </div>
      <div style="padding: 32px;">
        <p style="font-size: 16px; line-height: 1.5;">Hi <strong>${hostName}</strong>,</p>
        <p style="font-size: 16px; line-height: 1.5;"><strong>${leaverName}</strong> has left your ride to <strong>${ride.destination}</strong>. A seat has become available again.</p>
        
        <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h2 style="font-size: 14px; color: #64748b; text-transform: uppercase; margin-top: 0; letter-spacing: 0.05em;">Ride Info</h2>
          <p style="margin: 8px 0;"><strong>Destination:</strong> ${ride.destination}</p>
          <p style="margin: 8px 0;"><strong>Time:</strong> ${new Date(ride.dateTime).toLocaleString()}</p>
        </div>
      </div>
      <div style="background-color: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #94a3b8;">
        &copy; ${new Date().getFullYear()} RideMate.
      </div>
    </div>
  `;
};

const getCancelRideTemplate = (userName, ride) => {
  return `
    <div style="font-family: sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #ef4444; padding: 24px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Ride Cancelled</h1>
      </div>
      <div style="padding: 32px;">
        <p style="font-size: 16px; line-height: 1.5;">Hi <strong>${userName}</strong>,</p>
        <p style="font-size: 16px; line-height: 1.5;">We're sorry to inform you that the ride to <strong>${ride.destination}</strong> hosted by <strong>${ride.creator.name}</strong> has been cancelled.</p>
        
        <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h2 style="font-size: 14px; color: #64748b; text-transform: uppercase; margin-top: 0; letter-spacing: 0.05em;">Cancelled Ride</h2>
          <p style="margin: 8px 0;"><strong>Destination:</strong> ${ride.destination}</p>
          <p style="margin: 8px 0;"><strong>Scheduled For:</strong> ${new Date(ride.dateTime).toLocaleString()}</p>
        </div>
        
        <p style="font-size: 16px; line-height: 1.5;">You can browse other available rides on the platform to find a new travel mate.</p>
        
        <div style="text-align: center; margin-top: 32px;">
          <a href="${process.env.FRONTEND_URL}/all-rides" style="background-color: #4f46e5; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px;">Browse Other Rides</a>
        </div>
      </div>
      <div style="background-color: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #94a3b8;">
        &copy; ${new Date().getFullYear()} RideMate.
      </div>
    </div>
  `;
};

const getReportAdminTemplate = (reporter, reportedUser, report) => {
  return `
    <div style="font-family: sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #ef4444; padding: 24px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">New Safety Report</h1>
      </div>
      <div style="padding: 32px;">
        <p style="font-size: 16px; line-height: 1.5;">An urgent safety report has been submitted on RideMate.</p>
        
        <div style="background-color: #fef2f2; border-radius: 8px; padding: 20px; margin: 24px 0; border: 1px solid #fee2e2;">
          <h2 style="font-size: 14px; color: #991b1b; text-transform: uppercase; margin-top: 0; letter-spacing: 0.05em;">Report Details</h2>
          <p style="margin: 8px 0;"><strong>Reporter:</strong> ${reporter.name} (${reporter.email})</p>
          <p style="margin: 8px 0;"><strong>Reported User:</strong> ${reportedUser.name} (${reportedUser.email})</p>
          <p style="margin: 8px 0;"><strong>Reason:</strong> <span style="color: #dc2626; font-weight: bold;">${report.reason}</span></p>
          <p style="margin: 8px 0;"><strong>Description:</strong> ${report.description || 'No description provided'}</p>
          <p style="margin: 8px 0;"><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
        </div>
        
        <div style="text-align: center; margin-top: 32px;">
          <a href="${process.env.FRONTEND_URL}/admin" style="background-color: #1e293b; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px;">Open Admin Dashboard</a>
        </div>
      </div>
      <div style="background-color: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #94a3b8;">
        &copy; ${new Date().getFullYear()} RideMate Security.
      </div>
    </div>
  `;
};

module.exports = {
  getJoinRideTemplate,
  getLeaveRideTemplate,
  getCancelRideTemplate,
  getReportAdminTemplate,
};
