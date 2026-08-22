/**
 * Service de Publication Directe Meta Graph API (Instagram Pro & Pages Facebook)
 * CMFlow — Social Media Publishing Engine
 */

export interface InstagramPublishParams {
  igUserId?: string;
  accessToken: string;
  mediaUrl: string;
  caption: string;
  mediaType?: 'image' | 'video' | 'carousel' | string;
  isReel?: boolean;
}

export interface FacebookPublishParams {
  pageId?: string;
  pageAccessToken: string;
  mediaUrl?: string;
  caption: string;
  mediaType?: 'image' | 'video' | 'carousel' | string;
}

export interface PublishResult {
  platform: 'instagram' | 'facebook';
  success: boolean;
  postId?: string;
  permalink?: string;
  error?: string;
  simulated?: boolean;
}

const META_GRAPH_VERSION = 'v19.0';
const GRAPH_API_BASE = `https://graph.facebook.com/${META_GRAPH_VERSION}`;

/**
 * 1. Publication sur Instagram Pro via Meta Content Publishing API
 */
export async function publishToInstagram({
  igUserId,
  accessToken,
  mediaUrl,
  caption,
  mediaType = 'image',
  isReel = false,
}: InstagramPublishParams): Promise<PublishResult> {
  // Mode Simulation si pas de token réel configuré
  if (!accessToken || accessToken.startsWith('demo_') || !igUserId || igUserId === 'mock') {
    const mockId = `ig_post_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    return {
      platform: 'instagram',
      success: true,
      postId: mockId,
      permalink: `https://www.instagram.com/p/${Math.random().toString(36).substring(2, 10)}/`,
      simulated: true,
    };
  }

  try {
    const isVideo = mediaType === 'video' || isReel || mediaUrl.endsWith('.mp4');

    // Étape 1 : Création du Media Container
    const containerParams: Record<string, string> = {
      caption,
      access_token: accessToken,
    };

    if (isVideo) {
      containerParams.media_type = 'REELS';
      containerParams.video_url = mediaUrl;
    } else {
      containerParams.image_url = mediaUrl;
    }

    const containerResponse = await fetch(`${GRAPH_API_BASE}/${igUserId}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(containerParams),
    });

    const containerData = await containerResponse.json();

    if (!containerResponse.ok || !containerData.id) {
      throw new Error(
        containerData?.error?.message ||
          `Échec création container Instagram (${containerResponse.status})`
      );
    }

    const creationId = containerData.id;

    // Étape 2 : Vérification du statut de traitement si Vidéo / Reel
    if (isVideo) {
      let isReady = false;
      let attempts = 0;
      const maxAttempts = 15; // 30 secondes max

      while (!isReady && attempts < maxAttempts) {
        attempts++;
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const statusResponse = await fetch(
          `${GRAPH_API_BASE}/${creationId}?fields=status_code&access_token=${accessToken}`
        );
        const statusData = await statusResponse.json();

        if (statusData.status_code === 'FINISHED') {
          isReady = true;
        } else if (statusData.status_code === 'ERROR' || statusData.status_code === 'EXPIRED') {
          throw new Error(`Traitement vidéo Instagram échoué : ${statusData.status_code}`);
        }
      }

      if (!isReady) {
        throw new Error('Délai dépassé pour le transcodage de la vidéo Instagram.');
      }
    }

    // Étape 3 : Diffusion Publique (media_publish)
    const publishResponse = await fetch(`${GRAPH_API_BASE}/${igUserId}/media_publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        creation_id: creationId,
        access_token: accessToken,
      }),
    });

    const publishData = await publishResponse.json();

    if (!publishResponse.ok || !publishData.id) {
      throw new Error(
        publishData?.error?.message || `Échec publication Instagram (${publishResponse.status})`
      );
    }

    return {
      platform: 'instagram',
      success: true,
      postId: publishData.id,
      permalink: `https://www.instagram.com/p/${publishData.id}/`,
    };
  } catch (error: any) {
    console.error('❌ Erreur publishToInstagram :', error);
    return {
      platform: 'instagram',
      success: false,
      error: error?.message || 'Erreur inconnue publication Instagram',
    };
  }
}

/**
 * 2. Publication sur Page Facebook via Graph API
 */
export async function publishToFacebook({
  pageId,
  pageAccessToken,
  mediaUrl,
  caption,
  mediaType = 'image',
}: FacebookPublishParams): Promise<PublishResult> {
  // Mode Simulation si pas de token réel configuré
  if (!pageAccessToken || pageAccessToken.startsWith('demo_') || !pageId || pageId === 'mock') {
    const mockId = `fb_post_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    return {
      platform: 'facebook',
      success: true,
      postId: mockId,
      permalink: `https://www.facebook.com/${mockId}`,
      simulated: true,
    };
  }

  try {
    const isVideo = mediaType === 'video' || (mediaUrl && mediaUrl.endsWith('.mp4'));
    let endpoint = `${GRAPH_API_BASE}/${pageId}/feed`;
    const payload: Record<string, string> = {
      access_token: pageAccessToken,
    };

    if (mediaUrl && isVideo) {
      endpoint = `${GRAPH_API_BASE}/${pageId}/videos`;
      payload.file_url = mediaUrl;
      payload.description = caption;
    } else if (mediaUrl) {
      endpoint = `${GRAPH_API_BASE}/${pageId}/photos`;
      payload.url = mediaUrl;
      payload.caption = caption;
    } else {
      payload.message = caption;
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok || (!data.id && !data.post_id)) {
      throw new Error(data?.error?.message || `Échec publication Facebook (${response.status})`);
    }

    const fbPostId = data.post_id || data.id;

    return {
      platform: 'facebook',
      success: true,
      postId: fbPostId,
      permalink: `https://www.facebook.com/${fbPostId}`,
    };
  } catch (error: any) {
    console.error('❌ Erreur publishToFacebook :', error);
    return {
      platform: 'facebook',
      success: false,
      error: error?.message || 'Erreur inconnue publication Facebook',
    };
  }
}

/**
 * 3. Orchestrateur Global : Diffusion d'un Post sur l'ensemble de ses Réseaux Cibles
 */
export async function publishPostToPlatforms({
  post,
  workspace,
}: {
  post: {
    id: string;
    caption: string;
    mediaUrl: string;
    mediaType?: string;
    platforms?: string[];
    network?: string;
  };
  workspace?: {
    id?: string;
    name?: string;
    socialAccounts?: {
      instagram?: { igUserId?: string; accessToken?: string; connected?: boolean };
      facebook?: { pageId?: string; accessToken?: string; connected?: boolean };
    };
  };
}): Promise<{
  allSuccess: boolean;
  results: PublishResult[];
  externalPostIds: Record<string, string | null>;
  errors: string[];
}> {
  const targetPlatforms = Array.isArray(post.platforms) && post.platforms.length > 0
    ? post.platforms
    : [post.network || 'instagram'];

  const results: PublishResult[] = [];
  const externalPostIds: Record<string, string | null> = {
    instagram: null,
    facebook: null,
    tiktok: null,
    linkedin: null,
  };
  const errors: string[] = [];

  for (const platform of targetPlatforms) {
    const normalized = platform.toLowerCase();

    if (normalized === 'instagram') {
      const igConfig = workspace?.socialAccounts?.instagram;
      const res = await publishToInstagram({
        igUserId: igConfig?.igUserId || process.env.META_DEFAULT_IG_USER_ID || 'mock',
        accessToken: igConfig?.accessToken || process.env.META_ACCESS_TOKEN || 'demo_token',
        mediaUrl: post.mediaUrl,
        caption: post.caption,
        mediaType: post.mediaType || 'image',
      });
      results.push(res);
      if (res.success && res.postId) {
        externalPostIds.instagram = res.postId;
      } else if (!res.success && res.error) {
        errors.push(`Instagram: ${res.error}`);
      }
    } else if (normalized === 'facebook') {
      const fbConfig = workspace?.socialAccounts?.facebook;
      const res = await publishToFacebook({
        pageId: fbConfig?.pageId || process.env.META_DEFAULT_FB_PAGE_ID || 'mock',
        pageAccessToken: fbConfig?.accessToken || process.env.META_ACCESS_TOKEN || 'demo_token',
        mediaUrl: post.mediaUrl,
        caption: post.caption,
        mediaType: post.mediaType || 'image',
      });
      results.push(res);
      if (res.success && res.postId) {
        externalPostIds.facebook = res.postId;
      } else if (!res.success && res.error) {
        errors.push(`Facebook: ${res.error}`);
      }
    } else {
      // Pour TikTok et LinkedIn : Simulation ou Bridge Direct
      const genericId = `${normalized}_${Date.now()}`;
      results.push({
        platform: normalized as any,
        success: true,
        postId: genericId,
        simulated: true,
      });
      externalPostIds[normalized] = genericId;
    }
  }

  const allSuccess = results.length > 0 && results.every((r) => r.success);

  return {
    allSuccess,
    results,
    externalPostIds,
    errors,
  };
}

export default publishPostToPlatforms;
