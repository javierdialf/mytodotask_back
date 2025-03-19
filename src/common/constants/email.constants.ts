export const EMAIL_RESET_PASSWORD_INFORMATION = {

    APP_NAME: 'APP_NAME',
    SUBJECT_EMAIL: 'Reset password email',
    
    HTML_INFORMATION: (resetPasswordLink: string) => (
        `<p>Dear Student, <strong>{name}</strong></p>
        <p>Please accept our best regards.</p>
        <p>To assign a new password, click the link below:</p>
        <p><a href="${resetPasswordLink}">Reset Password</a></p>
        <p>The link is valid for 10 minutes. After this time, if you have not assigned a new password, you will have to use the "I forgot my password" option on the website.</p>
        <p>This email is for informational purposes only. Please do not reply to this message.</p>
        <p>Cordially,<br>
        <strong>{auth backend app}</strong></p>`
    ),

    RESET_PASSWORD_LINK: (resetPasswordToken: string) => `http://localhost:8080/auth/reset-password?reset_token=${resetPasswordToken}`
}