const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// POST /api/admin/send-email
router.post('/send-email', async (req, res) => {
  const { to, name, type, data } = req.body;

  console.log('[SMTP CONFIG]', {
    host: process.env.MAIL_HOST || 'NON CONFIGURÉ',
    user: process.env.MAIL_USER || 'NON CONFIGURÉ',
    port: process.env.MAIL_PORT || 'NON CONFIGURÉ'
  });

  // Validation améliorée
  if (process.env.NODE_ENV !== 'production') {
    console.log('[SMTP CONFIG]', {
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      user: process.env.MAIL_USER,
      from: process.env.MAIL_FROM,
      secure: process.env.MAIL_SECURE
    });
  }

  console.log('[EMAIL REQUEST] Destinataire:', to, '| Type:', type);

  // Configuration SMTP avec vérification
  if (!process.env.MAIL_HOST || !process.env.MAIL_USER || !process.env.MAIL_PASS) {
    console.error('[EMAIL CONFIG] Variables SMTP manquantes');
    return res.status(500).json({ 
      success: false, 
      message: 'Configuration serveur incomplète' 
    });
  }

  try {
    // Création du transporteur avec timeout
    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: parseInt(process.env.MAIL_PORT),
        secure: process.env.MAIL_SECURE === 'true', // false pour STARTTLS
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        },
        tls: {
            // Ne pas rejeter les certificats auto-signés (utile en dev)
            rejectUnauthorized: process.env.NODE_ENV === 'production'
        }
    });

    // Vérification de la connexion SMTP
    await transporter.verify((error) => {
      if (error) {
        console.error('[SMTP VERIFY]', error);
        throw new Error('Échec de connexion au serveur SMTP');
      }
      console.log('[SMTP READY] Serveur SMTP configuré');
    });

    // Construction du contenu
    const emailContent = buildEmailContent(type, name, data);
    
    // Envoi de l'email
    const info = await transporter.sendMail({
      from: `"Vilo Assist Pro" <${process.env.MAIL_FROM || 'no-reply@viloassist.com'}>`,
      to,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text || emailContent.subject // Fallback text
    });

    console.log('[EMAIL SENT] Message ID:', info.messageId);
    return res.status(200).json({ 
      success: true, 
      message: 'Email envoyé avec succès.',
      messageId: info.messageId 
    });

  } catch (err) {
    console.error('[EMAIL ERROR]', {
      message: err.message,
      stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
      type,
      recipient: to
    });
    
    return res.status(500).json({ 
      success: false, 
      message: process.env.NODE_ENV === 'development' 
        ? `Erreur technique: ${err.message}`
        : "Erreur lors de l'envoi de l'email",
      technicalError: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Dans votre fichier de routes (backend)
router.get('/test-smtp', async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT),
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    await transporter.verify(); // Teste la connexion SMTP
    res.json({ success: true, message: 'SMTP configuré avec succès !' });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Échec de connexion SMTP',
      error: err.message
    });
  }
});

// Helper pour générer le contenu :personalisable
function buildEmailContent(type, name, data) {
  const base = {
    subject: type === 'appointment'
      ? 'Confirmation de votre rendez-vous - Vilo Assist'
      : 'Réponse à votre demande de contact - Vilo Assist',
    html: type === 'appointment'
      ? `<p>Bonjour ${name},</p>
         <p>Votre rendez-vous est confirmé pour le ${data?.date || 'date non spécifiée'} 
         à ${data?.time || 'heure non spécifiée'}.</p>
         <p>Merci de votre confiance.</p>`
      : `<p>Bonjour ${name},</p>
         <p>Nous avons bien reçu votre message : <b>${data?.message || ''}</b>
         concernant le service <b>${data?.service || ''}</b>.</p>
         <p>Nous vous répondrons rapidement.</p>`
  };

  // Version texte pour les clients email simples
  base.text = base.html.replace(/<[^>]*>/g, '');

  return base;
}

// Test SMTP (à ajouter AVANT module.exports)
router.post('/test-smtp', async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT),
      secure: process.env.MAIL_SECURE === 'true',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    // Test 1: Vérifie la connexion SMTP
    await transporter.verify();
    
    // Test 2: Envoi réel d'un email test
    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: 'test@example.com',
      subject: 'Test SMTP',
      text: 'Ceci est un email de test'
    });

    res.json({
      success: true,
      message: 'Connexion SMTP réussie et email test envoyé',
      messageId: info.messageId
    });

  } catch (error) {
    console.error('Erreur SMTP:', error);
    res.status(500).json({
      success: false,
      message: 'Échec de connexion SMTP',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;