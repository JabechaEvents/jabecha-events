import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    DocumentSnapshot,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    serverTimestamp,
    startAfter,
    Timestamp,
    updateDoc,
    where,
} from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '../firebase/firebase';
import { CreateEventData, Event, EventStatus, UpdateEventData } from '../types/event';

const EVENTS_COLLECTION = 'events';
const STORAGE_PATH = 'events';

export class EventService {
  /**
   * Create a new event
   */
  static async createEvent(eventData: CreateEventData, hostId: string, hostName: string): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, EVENTS_COLLECTION), {
        ...eventData,
        dateTime: Timestamp.fromDate(eventData.dateTime),
        hostId,
        hostName,
        status: EventStatus.UPCOMING,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error creating event:', error);
      throw new Error('Failed to create event');
    }
  }

  /**
   * Update an existing event
   */
  static async updateEvent(eventId: string, updateData: UpdateEventData): Promise<void> {
    try {
      const eventRef = doc(db, EVENTS_COLLECTION, eventId);
      const dataToUpdate: any = {
        ...updateData,
        updatedAt: serverTimestamp(),
      };

      // Convert Date to Timestamp if dateTime is being updated
      if (updateData.dateTime) {
        dataToUpdate.dateTime = Timestamp.fromDate(updateData.dateTime);
      }

      await updateDoc(eventRef, dataToUpdate);
    } catch (error) {
      console.error('Error updating event:', error);
      throw new Error('Failed to update event');
    }
  }

  /**
   * Delete an event
   */
  static async deleteEvent(eventId: string): Promise<void> {
    try {
      const eventRef = doc(db, EVENTS_COLLECTION, eventId);
      await deleteDoc(eventRef);
    } catch (error) {
      console.error('Error deleting event:', error);
      throw new Error('Failed to delete event');
    }
  }

  /**
   * Get a single event by ID
   */
  static async getEvent(eventId: string): Promise<Event | null> {
    try {
      const eventRef = doc(db, EVENTS_COLLECTION, eventId);
      const eventSnap = await getDoc(eventRef);
      
      if (eventSnap.exists()) {
        return {
          id: eventSnap.id,
          ...eventSnap.data(),
        } as Event;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting event:', error);
      throw new Error('Failed to get event');
    }
  }

  /**
   * Get public events (non-private events for browsing)
   */
  static async getPublicEvents(limitCount: number = 20): Promise<Event[]> {
    try {
      const q = query(
        collection(db, EVENTS_COLLECTION),
        where('isPrivate', '==', false),
        where('status', '==', EventStatus.UPCOMING),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Event[];
    } catch (error) {
      console.error('Error getting public events:', error);
      throw new Error('Failed to get public events');
    }
  }

  /**
   * Get events for a specific user (as host) - requires authentication
   */
  static async getUserEvents(userId: string, limitCount: number = 20): Promise<Event[]> {
    try {
      const q = query(
        collection(db, EVENTS_COLLECTION),
        where('hostId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Event[];
    } catch (error) {
      console.error('Error getting user events:', error);
      throw new Error('Failed to get user events');
    }
  }

  /**
   * Get upcoming events for browsing (public + user's own events if authenticated)
   */
  static async getUpcomingEvents(userId?: string, limitCount: number = 10): Promise<Event[]> {
    try {
      let q;
      
      if (userId) {
        // Get user's own events if authenticated
        q = query(
          collection(db, EVENTS_COLLECTION),
          where('hostId', '==', userId),
          where('status', '==', EventStatus.UPCOMING),
          orderBy('dateTime', 'asc'),
          limit(limitCount)
        );
      } else {
        // Get public upcoming events for browsing
        q = query(
          collection(db, EVENTS_COLLECTION),
          where('isPrivate', '==', false),
          where('status', '==', EventStatus.UPCOMING),
          orderBy('dateTime', 'asc'),
          limit(limitCount)
        );
      }
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Event[];
    } catch (error) {
      console.error('Error getting upcoming events:', error);
      throw new Error('Failed to get upcoming events');
    }
  }

  /**
   * Upload event cover image
   */
  static async uploadCoverImage(eventId: string, imageUri: string): Promise<string> {
    try {
      // Convert image URI to blob
      const response = await fetch(imageUri);
      const blob = await response.blob();
      
      // Create storage reference
      const imageRef = ref(storage, `${STORAGE_PATH}/${eventId}/cover.jpg`);
      
      // Upload image
      await uploadBytes(imageRef, blob);
      
      // Get download URL
      const downloadURL = await getDownloadURL(imageRef);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading cover image:', error);
      throw new Error('Failed to upload cover image');
    }
  }

  /**
   * Delete event cover image
   */
  static async deleteCoverImage(eventId: string): Promise<void> {
    try {
      const imageRef = ref(storage, `${STORAGE_PATH}/${eventId}/cover.jpg`);
      await deleteObject(imageRef);
    } catch (error) {
      console.error('Error deleting cover image:', error);
      // Don't throw error for image deletion failures
    }
  }

  /**
   * Get paginated events (for infinite scroll)
   */
  static async getPaginatedEvents(
    userId: string,
    limitCount: number = 20,
    lastDoc?: DocumentSnapshot
  ): Promise<{ events: Event[]; lastDoc: DocumentSnapshot | null }> {
    try {
      let q = query(
        collection(db, EVENTS_COLLECTION),
        where('hostId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      const querySnapshot = await getDocs(q);
      const events = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Event[];

      const newLastDoc = querySnapshot.docs[querySnapshot.docs.length - 1] || null;

      return { events, lastDoc: newLastDoc };
    } catch (error) {
      console.error('Error getting paginated events:', error);
      throw new Error('Failed to get paginated events');
    }
  }

  /**
   * Search events by title or description
   */
  static async searchEvents(userId: string, searchTerm: string): Promise<Event[]> {
    try {
      // Note: This is a basic implementation. For better search,
      // consider using Algolia or similar search service
      const q = query(
        collection(db, EVENTS_COLLECTION),
        where('hostId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const allEvents = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Event[];

      // Filter by search term (case-insensitive)
      const filteredEvents = allEvents.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );

      return filteredEvents;
    } catch (error) {
      console.error('Error searching events:', error);
      throw new Error('Failed to search events');
    }
  }
}