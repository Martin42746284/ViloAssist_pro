const { Testimonial } = require('../models');
const { validationResult, body } = require('express-validator');

// =============================================
// ✅ MIDDLEWARES DE VALIDATION
// =============================================

exports.validateTestimonial = [
  body('name')
    .notEmpty().withMessage('Le nom est requis')
    .isLength({ min: 2, max: 100 }).withMessage('Le nom doit contenir entre 2 et 100 caractères'),

  body('post')
    .notEmpty().withMessage('Le poste est requis')
    .isLength({ max: 100 }).withMessage('Le poste ne doit pas dépasser 100 caractères'),

  body('entreprise')
    .notEmpty().withMessage('Le nom de l\'entreprise est requis')
    .isLength({ max: 100 }).withMessage('Le nom de l\'entreprise ne doit pas dépasser 100 caractères'),

  body('comment')
    .notEmpty().withMessage('Le commentaire est requis')
    .isLength({ max: 1000 }).withMessage('Le commentaire ne doit pas dépasser 1000 caractères'),

  body('rating')
    .notEmpty().withMessage('La note est requise')
    .isInt({ min: 1, max: 5 }).withMessage('La note doit être comprise entre 1 et 5')
];

// =============================================
// ✅ CRUD OPERATIONS
// =============================================

// GET - Récupérer tous les témoignages (avec filtrage optionnel)
exports.getAllTestimonials = async (req, res) => {
  try {
    const { status } = req.query;
    const whereClause = {};
    
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      whereClause.status = status;
    }

    const testimonials = await Testimonial.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'name', 'post', 'entreprise', 'comment', 'rating', 'status', 'createdAt']
    });

    res.json({ 
      success: true, 
      data: testimonials,
      count: testimonials.length
    });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// GET - Récupérer un témoignage spécifique
exports.getTestimonialById = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByPk(req.params.id, {
      attributes: ['id', 'name', 'post', 'entreprise', 'comment', 'rating', 'status', 'createdAt']
    });

    if (!testimonial) {
      return res.status(404).json({ 
        success: false, 
        message: 'Témoignage non trouvé' 
      });
    }

    // Seuls les admins peuvent voir les témoignages non approuvés
    if (testimonial.status !== 'approved' && !req.user?.isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: 'Accès non autorisé' 
      });
    }

    res.json({ 
      success: true, 
      data: testimonial 
    });
  } catch (error) {
    console.error('Error fetching testimonial:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// POST - Créer un nouveau témoignage
exports.createTestimonial = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  try {
    const { name, post, entreprise, comment, rating } = req.body;

    const testimonial = await Testimonial.create({
      name,
      post,
      entreprise,
      comment,
      rating,
      status: 'pending' // Par défaut en attente de modération
    });

    res.status(201).json({
      success: true,
      data: testimonial,
      message: 'Témoignage soumis avec succès. En attente de modération.'
    });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Erreur de validation',
        errors: error.errors.map(e => e.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// PUT - Mettre à jour un témoignage
exports.updateTestimonial = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  try {
    const testimonial = await Testimonial.findByPk(req.params.id);
    
    if (!testimonial) {
      return res.status(404).json({ 
        success: false, 
        message: 'Témoignage non trouvé' 
      });
    }

    // Seuls les admins peuvent modifier le statut
    if (req.body.status && !req.user?.isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: 'Non autorisé à modifier le statut' 
      });
    }

    const { name, post, entreprise, comment, rating, status } = req.body;
    
    const updatedData = {};
    if (name) updatedData.name = name;
    if (post) updatedData.post = post;
    if (entreprise) updatedData.entreprise = entreprise;
    if (comment) updatedData.comment = comment;
    if (rating) updatedData.rating = rating;
    if (status) updatedData.status = status;

    await testimonial.update(updatedData);

    res.json({
      success: true,
      data: testimonial,
      message: 'Témoignage mis à jour avec succès'
    });
  } catch (error) {
    console.error('Error updating testimonial:', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Erreur de validation',
        errors: error.errors.map(e => e.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// DELETE - Supprimer un témoignage
exports.deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByPk(req.params.id);
    
    if (!testimonial) {
      return res.status(404).json({ 
        success: false, 
        message: 'Témoignage non trouvé' 
      });
    }

    await testimonial.destroy();
    
    res.json({
      success: true,
      message: 'Témoignage supprimé avec succès'
    });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Impossible de supprimer - témoignage lié à d\'autres données'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};