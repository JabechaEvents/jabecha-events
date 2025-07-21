import { z } from 'zod';

export const createEventSchema = z.object({
  title: z.string()
    .min(1, 'Event title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must not exceed 100 characters'),
  
  description: z.string()
    .min(1, 'Event description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must not exceed 1000 characters'),
  
  venue: z.string()
    .min(1, 'Venue is required')
    .min(3, 'Venue must be at least 3 characters')
    .max(200, 'Venue must not exceed 200 characters'),
  
  dateTime: z.date({
    required_error: 'Event date and time is required',
    invalid_type_error: 'Please select a valid date and time'
  }).refine(
    (date) => date > new Date(),
    { message: 'Event must be scheduled for a future date' }
  ),
  
  isPrivate: z.boolean().default(false),
  
  maxGuests: z.number()
    .min(1, 'Maximum guests must be at least 1')
    .max(10000, 'Maximum guests cannot exceed 10,000')
    .optional()
    .or(z.literal('')),
    
  coverImage: z.string().optional(),
});

export const updateEventSchema = createEventSchema.partial();

export const eventSearchSchema = z.object({
  query: z.string()
    .min(1, 'Search query is required')
    .max(100, 'Search query must not exceed 100 characters'),
});

// Type inference from schemas
export type CreateEventFormData = z.infer<typeof createEventSchema>;
export type UpdateEventFormData = z.infer<typeof updateEventSchema>;
export type EventSearchFormData = z.infer<typeof eventSearchSchema>;

// Transform function to convert form data to service data
export const transformFormToCreateData = (formData: CreateEventFormData) => {
  return {
    ...formData,
    maxGuests: typeof formData.maxGuests === 'number' ? formData.maxGuests : undefined,
  };
};