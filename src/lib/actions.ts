
'use server';

import { database } from '@/lib/firebase';
import { ref, remove } from 'firebase/database';

const correctPassword = process.env.ADMIN_PASSWORD || 'IYFJP@UDGAAR_Pledge';

export async function verifyPasswordAction(password: string): Promise<{ success: boolean; error?: string }> {
  if (password === correctPassword) {
    return { success: true };
  } else {
    return { success: false, error: 'Incorrect password.' };
  }
}

export async function clearPledgesAction(password: string): Promise<{ success: boolean; error?: string }> {
  const verification = await verifyPasswordAction(password);
  if (!verification.success) {
    return verification;
  }

  try {
    const pledgesRef = ref(database, 'pledges');
    await remove(pledgesRef);
    return { success: true };
  } catch (error) {
    console.error('Firebase clear error:', error);
    return { success: false, error: 'Failed to clear pledge records.' };
  }
}
