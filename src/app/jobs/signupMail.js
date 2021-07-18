const { Mail } = require('../helpers');
const { jobsKeys } = require('../constants');

module.exports = {
  key: jobsKeys.SignupMail,
  // To options use Bull docs <https://optimalbits.github.io/bull> with reference
  options: { delay: 3000, attempts: 3 },
  async handle({ data }) {
    const { user } = data;

    await Mail.sendMail({
      from: `Churrastri <${process.env.MAIL_USER}`,
      to: `${user.name} <${user.email}>`,
      subject: 'Bem-vindx ao Churras Tri!',
      html: `Olá ${user.name}, bem-vindx ao Churras Tri =)`,
    });
  },
};
