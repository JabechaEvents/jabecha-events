import { Timestamp } from 'firebase/firestore';

export interface Event {
  id: string;
  title: string;
  description: string;
  dateTime: Timestamp;
  venue: string;
  hostId: string;
  hostName: string;
  coverImage?: string;
  isPrivate: boolean;
  maxGuests?: number;
  status: EventStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CreateEventData {
  title: string;
  description: string;
  dateTime: Date;
  venue: string;
  isPrivate: boolean;
  maxGuests?: number;
  coverImage?: string;
}

export interface UpdateEventData extends Partial<CreateEventData> {
  status?: EventStatus;
}

export enum EventStatus {
  UPCOMING = 'upcoming',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface RSVP {
  userId: string;
  userName: string;
  userEmail: string;
  status: RSVPStatus;
  responseDate: Timestamp;
  message?: string;
}

export enum RSVPStatus {
  ATTENDING = 'attending',
  NOT_ATTENDING = 'not_attending',
  MAYBE = 'maybe'
}

export interface EventGuest {
  userId: string;
  userName: string;
  userEmail: string;
  role: GuestRole;
  invitedAt: Timestamp;
  rsvp?: RSVP;
}

export enum GuestRole {
  HOST = 'host',
  CO_HOST = 'co_host',
  GUEST = 'guest'
}