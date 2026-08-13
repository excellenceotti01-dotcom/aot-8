// Temporary mock response matching the planned AOT 8.0 registration endpoint.
export const registrationSettings = {
  data: {
    isOpen: true,
    opensAt: null,
    closesAt: null,
    introduction: 'Choose how you want to participate.',
    commonFields: [
      { id: 'fullName', label: 'Name', type: 'text', required: true, autoComplete: 'name' },
      { id: 'email', label: 'Email', type: 'email', required: true, autoComplete: 'email' },
      { id: 'phone', label: 'Phone', type: 'tel', required: true, autoComplete: 'tel' },
      { id: 'organisation', label: 'Organisation', type: 'text', required: true, autoComplete: 'organization' },
    ],
    types: [
      { id: 'attend', label: 'Attend', formTitle: 'Attend registration', submitLabel: 'Submit registration' },
      { id: 'speaker', label: 'Speaker', formTitle: 'Speaker registration', submitLabel: 'Submit registration' },
      { id: 'exhibitor', label: 'Exhibitor', formTitle: 'Exhibitor registration', submitLabel: 'Submit registration' },
      { id: 'sponsor', label: 'Sponsor', formTitle: 'Sponsor registration', submitLabel: 'Submit registration' },
    ],
    confirmation: { message: 'Thank you. Your registration has been received.' },
  },
  meta: { source: 'mock' },
}
