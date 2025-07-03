// Statuts génériques réutilisables
export type ContactStatus = 'nouveau' | 'traité' | 'fermé';
export type AppointmentStatus = 'en_attente' | 'confirmé' | 'annulé' | 'terminé';

export interface Contact {
  id: string;
  name: string;
  email: string;
  service: string;
  message: string;
  status: ContactStatus;
  created_at: string;
}

export interface Appointment {
  id: string;
  client_name: string;
  client_email: string;
  date: string; // format ISO YYYY-MM-DD
  time: string; // format HH:mm
  status: AppointmentStatus;
  created_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  commentaire: string;
  note: string;
  date: string;
  created_at: string;
}

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'user';
  created_at: string;
}

// ✅ Types pour formulaires (saisie côté utilisateur)
export type ContactFormData = Omit<Contact, 'id' | 'created_at' | 'status'>;

export type AppointmentFormData = {
  client_name: string;
  client_email: string;
  date: string;
  time: string;
};

// ✅ Types pour mise à jour partielle (PUT/PATCH)
export type UpdateAppointmentData = Partial<Omit<Appointment, 'id' | 'created_at'>>;
export type UpdateContactData = Partial<Omit<Contact, 'id' | 'created_at'>>;
export type ProfileFormData = Omit<Profile, 'id' | 'created_at' | 'updated_at'>;
