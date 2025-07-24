const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { body, param, validationResult } = require('express-validator');

// Middleware de validation pour les IDs
const validateId = [
  param('id')
    .isInt({ min: 1 }).withMessage('L\'ID doit être un nombre entier positif')
    .toInt()
];

// Middleware de validation pour les statuts
const validateStatus = [
  body('status')
    .isString().withMessage('Le statut doit être une chaîne de caractères')
    .isIn(['pending', 'approved', 'rejected']).withMessage('Statut invalide')
];

// Middleware pour gérer les erreurs de validation
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Erreur de validation',
      errors: errors.array()
    });
  }
  next();
};

// =============================================
// ROUTES GET
// =============================================

// Récupérer tous les contacts
router.get('/contacts', 
  adminController.getContacts
);

// Récupérer tous les rendez-vous
router.get('/appointments', 
  adminController.getAppointments
);

// Récupérer tous les témoignages
router.get('/testimonials', 
  adminController.getTestimonials
);

// =============================================
// ROUTES PUT (MISE À JOUR)
// =============================================

// Mettre à jour le statut d'un contact
router.put('/contacts/:id', 
  validateId,
  validateStatus,
  handleValidationErrors,
  adminController.updateContactStatus
);

// Mettre à jour le statut d'un rendez-vous
router.put('/appointments/:id', 
  validateId,
  validateStatus,
  handleValidationErrors,
  adminController.updateAppointmentStatus
);

// Mettre à jour le statut d'un témoignage
router.put('/testimonials/:id', 
  validateId,
  validateStatus,
  handleValidationErrors,
  adminController.updateTestimonialStatus
);

module.exports = router;