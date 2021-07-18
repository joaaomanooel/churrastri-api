module.exports = {
  host: process.env.MAIL_HOST || 'smtp.gmail.com',
  port: process.env.MAIL_PORT || 465,
  auth: {
    user: process.env.MAIL_USER || 'churrastri@gmail.com',
    pass: process.env.MAIL_PASSWORD || 'C7KDZum9bkS4RcL',
  },
};
