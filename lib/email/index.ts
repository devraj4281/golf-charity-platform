import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendWinnerStatusEmail(email: string, status: string) {
  try {
    let subject = ''
    let text = ''
    if (status === 'approved') {
      subject = 'Your Winner Proof has been Approved!'
      text = 'Congratulations! Your proof has been approved. We will be processing your prize payout shortly.'
    } else if (status === 'rejected') {
      subject = 'Update on Your Winner Proof'
      text = 'We regret to inform you that your winner proof was rejected.'
    } else if (status === 'paid') {
      subject = 'Prize Payout Sent!'
      text = 'Your prize payout has been successfully sent to you. Enjoy your winnings!'
    } else {
      return
    }

    await resend.emails.send({
      from: 'Golf Charity Platform <noreply@golfcharityplatform.com>',
      to: email,
      subject,
      text,
    })
  } catch (error) {
    console.error('Failed to send winner status email:', error)
  }
}

export async function sendDrawPublishedEmail(email: string, drawMonth: string) {
  try {
    await resend.emails.send({
      from: 'Golf Charity Platform <noreply@golfcharityplatform.com>',
      to: email,
      subject: `The Draft for ${drawMonth} is Published!`,
      text: `Hello! The monthly draw for ${drawMonth} is now published. Check the dashboard to see if you won!`,
    })
  } catch (error) {
    console.error('Failed to send draw published email:', error)
  }
}
