import { configurations } from '../../../infrastructure/configurations/index';

import { User } from '../../../models/User';
import { NodeMailServiceAdapter } from '../../integrations/aws/node-mailer-service-adapter';

export const authLoginNotificationMail = async (options: { user: User }) => {
  const { user } = { ...options };
  const output = `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml">
  <head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  </head>
  <body style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative; -webkit-text-size-adjust: none; background-color: #ffffff; color: #718096; height: 100%; line-height: 1.4; margin: 0; padding: 0; width: 100% !important;">
  <style>
  @media  only screen and (max-width: 600px) {
  .inner-body {
  width: 100% !important;
  }

  .footer {
  width: 100% !important;
  }
  }
  
  @media  only screen and (max-width: 500px) {
  .button {
  width: 100% !important;
  }
  }
  </style>
  
  <table class="wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative; -premailer-cellpadding: 0; -premailer-cellspacing: 0; -premailer-width: 100%; background-color: #edf2f7; margin: 0; padding: 0; width: 100%;">
  <tr>
  <td align="center" style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative;">
  <table class="content" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative; -premailer-cellpadding: 0; -premailer-cellspacing: 0; -premailer-width: 100%; margin: 0; padding: 0; width: 100%;">
  <tr>
  <td class="header" style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative; padding: 25px 0; text-align: center;">

  </td>
  </tr>
  
  <!-- Email Body -->
  <tr>
  <td class="body" width="100%" cellpadding="0" cellspacing="0" style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative; -premailer-cellpadding: 0; -premailer-cellspacing: 0; -premailer-width: 100%; background-color: #edf2f7; border-bottom: 1px solid #edf2f7; border-top: 1px solid #edf2f7; margin: 0; padding: 0; width: 100%;">
  <table class="inner-body" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation" style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative; -premailer-cellpadding: 0; -premailer-cellspacing: 0; -premailer-width: 570px; background-color: #ffffff; border-color: #e8e5ef; border-radius: 2px; border-width: 1px; box-shadow: 0 2px 0 rgba(0, 0, 150, 0.025), 2px 4px 0 rgba(0, 0, 150, 0.015); margin: 0 auto; padding: 0; width: 570px;">
  <!-- Body content -->
  <tr>
  

  <td class="content-cell" style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative; max-width: 100vw; padding: 32px;">
  <!-- <h1 style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative; color: #3d4852; font-size: 18px; font-weight: bold; margin-top: 0; text-align: left;">Hello!</h1> -->
  <h2 style="margin-bottom:20px">Confirm your account</h2>

  <span style="font-size:16px">
  You are receiving this email because we have received a request to confirm your account
  </span><br/><br/>

  <table class="subcopy" width="100%" cellpadding="0" cellspacing="0" role="presentation">
  <tr>
  <td colspan="2">
  <a 
  style="    
  background: #0069ff;
  border-radius: 3px;
  border: 1px solid #0069ff;
  color: #fff !important;
  display: inline-block;
  height: 3rem;
  line-height: 3rem;
  text-align: center;
  text-decoration: none;
  width:100%" href="${
    configurations.datasite.urlClient
  }/confirm-account?token=${user?.token}">Confirm your account</a>
  </td>
  </tr>
  </table><br/><br/>

  <span style="font-size:16px"> 
    <strong> <a> Have questions? </a> </strong>
    <div style="height:2px"><br></div>
    You can check out our 
    <a style="text-decoration:none" target="_blank" href="#">FAQ</a> 
    or our 
    <a style="text-decoration:none" target="_blank" href="#">support page</a>
    for more information.
  </span>

  
  <table class="subcopy" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative; border-top: 1px solid #e8e5ef; margin-top: 25px; padding-top: 25px;">
  <tr>
  <td style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative;">
  <p style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative; line-height: 1.5em; margin-top: 0; text-align: left; font-size: 14px;">
  If you’re having trouble clicking the "Confirm your account" button, copy and paste the URL below into your web browser: <span class="break-all" style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative; word-break: break-all;">
  <a href="${configurations.datasite.urlClient}/confirm-account?token=${
    user?.token
  }" style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative; color: #3869d4;">
  ${configurations.datasite.urlClient}/confirm-account?token=${user?.token}
  </a></span></p>
  
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  
  <tr>
  <td style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative;">
  <table class="footer" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation" style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative; -premailer-cellpadding: 0; -premailer-cellspacing: 0; -premailer-width: 570px; margin: 0 auto; padding: 0; text-align: center; width: 570px;">
  <tr>
  <tr>
  <td style="font-family: Montserrat, -apple-system, 'Segoe UI', sans-serif; font-size: 12px; padding-left: 48px; padding-right: 48px; --text-opacity: 1; color: #eceff1; color: rgba(236, 239, 241, var(--text-opacity));">
    <p style="--text-opacity: 1; color: #263238; color: rgba(38, 50, 56, var(--text-opacity));">
      Use of our service and website is subject to our
      <a href="${
        configurations.datasite.urlClient
      }" class="hover-underline" style="--text-opacity: 1; color: #7367f0; color: rgba(115, 103, 240, var(--text-opacity)); text-decoration: none;">Terms of Use</a> and
      <a href="${
        configurations.datasite.urlClient
      }" class="hover-underline" style="--text-opacity: 1; color: #7367f0; color: rgba(115, 103, 240, var(--text-opacity)); text-decoration: none;">Privacy Policy</a>.
    </p>
  </td>
  </tr>
  <td class="content-cell" align="center" style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative; max-width: 100vw; padding: 32px;">
  <p style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative; line-height: 1.5em; margin-top: 0; color: #b0adc5; font-size: 12px; text-align: center;">© 2022 - ${new Date().getFullYear()} ${
    configurations.datasite.name
  }. All rights reserved.</p>
  
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </table>
  </body>
  </html>
      `;
  // create reusable transporter object using the default SMTP transport
  await NodeMailServiceAdapter({
    to: [`${user.email}`],
    subject: `${configurations.datasite.name} - Notification access to the Customer Area`,
    html: output,
  });
};

// <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
// <html xmlns="http://www.w3.org/1999/xhtml">
// <head>
// <meta name="viewport" content="width=device-width, initial-scale=1.0">
// <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
// <meta name="color-scheme" content="light">
// <meta name="supported-color-schemes" content="light">
// </head>
// <body style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative; -webkit-text-size-adjust: none; background-color: #ffffff; color: #718096; height: 100%; line-height: 1.4; margin: 0; padding: 0; width: 100% !important;">
// <div style="width:590px;max-width:100%;margin:auto;padding-top:10px"><div class="adM">
// </div><p style="padding-bottom:10px"><a><img src="https://ci4.googleusercontent.com/proxy/i3rg86c4GJeHXvoXlb9RtlaTJf8Z59Gli5vIiStGHDc6FCEmCxltA-XRDXYrBC30e2IihSCpf9pS0-o_bAmGnwCIq34MEIUgr97t_vOM4JJ2MHqviw=s0-d-e1-ft#https://www.netsons.com/manage/images/email-logo-small.png?ver=1.1" alt="" class="CToWUd" data-bit="iit" border="0"></a></p>
// <p><span style="color:#888888">COMUNICAZIONE DI SERVIZIO</span><br><br>Gentile Cliente,<br><br>ti informiamo che è appena stato effettuato l'accesso alla tua Area Clienti.</p>
// <ul>
// <li>Username: <a href="mailto:${user?.email}" target="_blank">${
//   user?.email
// }</a></li>
// <li>Indirizzo IP di provenienza: 93.49.117.134</li>
// <li>Data e ora di accesso: ${formateDateMMDDYYMomentJs(new Date())}</li>
// </ul>
// <p>Ricevi questa mail per la tua sicurezza. Se desideri puoi disabilitare l'invio di questa notifica dalla Dashboard della tua Area Clienti (Notifica di accesso).</p>
// <p>Cordiali saluti,<br><br></p><div style="font-size:12px">Questa è una mail automatica.<br>Per dubbi e assistenza il Servizio Clienti Netsons è a tua disposizione al numero + 39 0854510052 e tramite&nbsp;chat e ticket direttamente nella tua <a href="https://www.netsons.com/manage/index.php?m=ns&amp;p=support" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.netsons.com/manage/index.php?m%3Dns%26p%3Dsupport&amp;source=gmail&amp;ust=1661877021988000&amp;usg=AOvVaw1zv3H-H1uTZsnr5JQDu5P7">Area Clienti</a>.</div><p></p>            <div style="border-top:1px solid #eee;font-size:11px;line-height:16px;color:#666;text-align:center;margin-top:20px;padding-top:5px">
// <p><a><img src="https://ci4.googleusercontent.com/proxy/P98tSRFmiihgcU5sVI1Bv6lD3lwXs6g_-oYYA3wg3K8GDlITNEcEP_E-MWbaFi_W0wiMdH5ZnkuTlZ-RfyWSTngKluygvKLtbZ1SpzzPHDc5B_DznA=s0-d-e1-ft#https://www.netsons.com/manage/images/email-logo-round.png?ver=1.1" alt="" class="CToWUd" data-bit="iit" border="0"></a></p>
// <p>
// <a href="https://www.netsons.com/manage/clientarea.php" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.netsons.com/manage/clientarea.php&amp;source=gmail&amp;ust=1661877021988000&amp;usg=AOvVaw1yiUujooXLylSl_aHIZmLZ">Area Clienti</a> |  <a href="https://www.netsons.com/manage/clientarea.php?action=invoices" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.netsons.com/manage/clientarea.php?action%3Dinvoices&amp;source=gmail&amp;ust=1661877021988000&amp;usg=AOvVaw0MLsELiXrY_EKYPT86lJo3">Fatture e pagamenti</a> | <a href="https://www.netsons.com/contratti/" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.netsons.com/contratti/&amp;source=gmail&amp;ust=1661877021988000&amp;usg=AOvVaw3dtOP00D2g1EfQyk1NaGsJ">Contratti di servizio</a> | <a href="https://www.netsons.com/assistenza/" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.netsons.com/assistenza/&amp;source=gmail&amp;ust=1661877021988000&amp;usg=AOvVaw0Zb2tHDNREpZmM_jEcC4JA">Assistenza e Supporto</a>
// </p>
// <p>Netsons s.r.l. | Via Tirino 99, 65129 Pescara<br/>
// Tel: (+39) 085 45 100 52  | Fax: (+39) 085 91 120 33 | Pec: <a href="mailto:info@pec.netsons.com" target="_blank">info@pec.netsons.com</a>
// <br/>
// Netsons è un marchio registrato dalla Netsons s.r.l.</p><div class="yj6qo"></div><div class="adL">
// </div></div><div class="adL">
// </div></div>
// </body>
// </html>
