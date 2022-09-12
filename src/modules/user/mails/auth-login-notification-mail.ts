import { formateDateMMDDYYMomentJs } from '../../../infrastructure/utils/commons/formate-date-momentjs';
import { configurations } from '../../../infrastructure/configurations/index';
import { createTransport } from 'nodemailer';

import { User } from '../../../models/User';
import moment from 'moment';

// import formData from 'form-data';
// import Mailgun from 'mailgun.js';
// const mailgun = new Mailgun(formData);
// const mg = mailgun.client({
//   username: 'api',
//   key: `66bf0631a87091245037bf33b79697a8-0e6e8cad-005184f7`,
// });

// console.log(`mg ====>`, mg);
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
  <div style="width:590px;max-width:100%;margin:auto;padding-top:10px"><div class="adM">    
  </div><p style="padding-bottom:10px"><a><img src="https://ci4.googleusercontent.com/proxy/i3rg86c4GJeHXvoXlb9RtlaTJf8Z59Gli5vIiStGHDc6FCEmCxltA-XRDXYrBC30e2IihSCpf9pS0-o_bAmGnwCIq34MEIUgr97t_vOM4JJ2MHqviw=s0-d-e1-ft#https://www.netsons.com/manage/images/email-logo-small.png?ver=1.1" alt="" class="CToWUd" data-bit="iit" border="0"></a></p>        
  <p><span style="color:#888888">COMUNICAZIONE DI SERVIZIO</span><br><br>Gentile Cliente,<br><br>ti informiamo che è appena stato effettuato l'accesso alla tua Area Clienti.</p>
  <ul>
  <li>Username: <a href="mailto:${user?.email}" target="_blank">${
    user?.email
  }</a></li>
  <li>Indirizzo IP di provenienza: 93.49.117.134</li>
  <li>Data e ora di accesso: ${formateDateMMDDYYMomentJs(new Date())}</li>
  </ul>
  <p>Ricevi questa mail per la tua sicurezza. Se desideri puoi disabilitare l'invio di questa notifica dalla Dashboard della tua Area Clienti (Notifica di accesso).</p>
  <p>Cordiali saluti,<br><br></p><div style="font-size:12px">Questa è una mail automatica.<br>Per dubbi e assistenza il Servizio Clienti Netsons è a tua disposizione al numero + 39 0854510052 e tramite&nbsp;chat e ticket direttamente nella tua <a href="https://www.netsons.com/manage/index.php?m=ns&amp;p=support" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.netsons.com/manage/index.php?m%3Dns%26p%3Dsupport&amp;source=gmail&amp;ust=1661877021988000&amp;usg=AOvVaw1zv3H-H1uTZsnr5JQDu5P7">Area Clienti</a>.</div><p></p>            <div style="border-top:1px solid #eee;font-size:11px;line-height:16px;color:#666;text-align:center;margin-top:20px;padding-top:5px">
  <p><a><img src="https://ci4.googleusercontent.com/proxy/P98tSRFmiihgcU5sVI1Bv6lD3lwXs6g_-oYYA3wg3K8GDlITNEcEP_E-MWbaFi_W0wiMdH5ZnkuTlZ-RfyWSTngKluygvKLtbZ1SpzzPHDc5B_DznA=s0-d-e1-ft#https://www.netsons.com/manage/images/email-logo-round.png?ver=1.1" alt="" class="CToWUd" data-bit="iit" border="0"></a></p>
  <p>
  <a href="https://www.netsons.com/manage/clientarea.php" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.netsons.com/manage/clientarea.php&amp;source=gmail&amp;ust=1661877021988000&amp;usg=AOvVaw1yiUujooXLylSl_aHIZmLZ">Area Clienti</a> |  <a href="https://www.netsons.com/manage/clientarea.php?action=invoices" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.netsons.com/manage/clientarea.php?action%3Dinvoices&amp;source=gmail&amp;ust=1661877021988000&amp;usg=AOvVaw0MLsELiXrY_EKYPT86lJo3">Fatture e pagamenti</a> | <a href="https://www.netsons.com/contratti/" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.netsons.com/contratti/&amp;source=gmail&amp;ust=1661877021988000&amp;usg=AOvVaw3dtOP00D2g1EfQyk1NaGsJ">Contratti di servizio</a> | <a href="https://www.netsons.com/assistenza/" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.netsons.com/assistenza/&amp;source=gmail&amp;ust=1661877021988000&amp;usg=AOvVaw0Zb2tHDNREpZmM_jEcC4JA">Assistenza e Supporto</a>
  </p>
  <p>Netsons s.r.l. | Via Tirino 99, 65129 Pescara<br/>
  Tel: (+39) 085 45 100 52  | Fax: (+39) 085 91 120 33 | Pec: <a href="mailto:info@pec.netsons.com" target="_blank">info@pec.netsons.com</a>
  <br/>
  Netsons è un marchio registrato dalla Netsons s.r.l.</p><div class="yj6qo"></div><div class="adL">
  </div></div><div class="adL">
  </div></div>
  </body>
  </html>
      `;
  // create reusable transporter object using the default SMTP transport
  const transporter = createTransport({
    host: configurations.implementations.mailSMTP.host,
    port: configurations.implementations.mailSMTP.port,
    secure: false, // true for 465, false for other ports
    auth: {
      user: configurations.implementations.mailSMTP.user, // generated ethereal user
      pass: configurations.implementations.mailSMTP.pass, // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  // setup email data with unicode symbols
  const mailOptions = {
    from: `${configurations.datasite.name} ${configurations.datasite.emailNoreply}`, // sender address
    to: user?.email, // list of receivers
    subject: `${configurations.datasite.name} - Notification access to the Customer Area`, // Subject line
    html: output, // html body
  };
  // send mail with defined transport object
  await transporter.sendMail(mailOptions);
};
