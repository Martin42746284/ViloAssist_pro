const { Contact, Appointment, Testimonial } = require('../models');
const { validationResult } = require('express-validator');

// Options communes de requête
const defaultQueryOptions = {
  order: [['createdAt', 'DESC']],
  attributes: { exclude: ['updatedAt'] } // Exclure les champs inutiles
};

// GET /admin/contacts
exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.findAll({
      ...defaultQueryOptions,
      where: req.query.status ? { status: req.query.status } : {}
    });
    
    res.json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la récupération des contacts",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// GET /admin/appointments
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      ...defaultQueryOptions,
      where: req.query.status ? { status: req.query.status } : {},
      include: [ // Exemple d'inclusion de relations
        { model: Contact, attributes: ['name', 'email'] }
      ]
    });

    res.json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la récupération des rendez-vous",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// GET /admin/testimonials
exports.getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.findAll({
      ...defaultQueryOptions,
      where: req.query.status ? { status: req.query.status } : {}
    });

    res.json({
      success: true,
      count: testimonials.length,
      data: testimonials
    });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la récupération des témoignages",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// PUT /admin/contacts/:id
exports.updateContactStatus = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Erreur de validation',
      errors: errors.array()
    });
  }

  try {
    const { id } = req.params;
    const { status } = req.body;

    const [updated] = await Contact.update(
      { status },
      { where: { id }, returning: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Contact non trouvé'
      });
    }

    res.json({
      success: true,
      message: "Statut du contact mis à jour avec succès",
      data: { id, status }
    });
  } catch (error) {
    console.error('Error updating contact status:', error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la mise à jour du contact",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// PUT /admin/appointments/:id
exports.updateAppointmentStatus = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Erreur de validation',
      errors: errors.array()
    });
  }

  try {
    const { id } = req.params;
    const { status } = req.body;

    const [updated] = await Appointment.update(
      { status },
      { where: { id }, returning: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Rendez-vous non trouvé'
      });
    }

    res.json({
      success: true,
      message: "Statut du rendez-vous mis à jour avec succès",
      data: { id, status }
    });
  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la mise à jour du rendez-vous",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// PUT /admin/testimonials/:id
exports.updateTestimonialStatus = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Erreur de validation',
      errors: errors.array()
    });
  }

  try {
    const { id } = req.params;
    const { status } = req.body;

    const [updated] = await Testimonial.update(
      { status },
      { where: { id }, returning: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Témoignage non trouvé'
      });
    }

    res.json({
      success: true,
      message: "Statut du témoignage mis à jour avec succès",
      data: { id, status }
    });
  } catch (error) {
    console.error('Error updating testimonial status:', error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la mise à jour du témoignage",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};