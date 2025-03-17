import { db } from './config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Function to save contact form submissions
export const saveContactMessage = async (data) => {
  try {
    const docRef = await addDoc(collection(db, "contactMessages"), {
      ...data,
      createdAt: serverTimestamp()
    });
    
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error saving message: ", error);
    return { success: false, error };
  }
}; 