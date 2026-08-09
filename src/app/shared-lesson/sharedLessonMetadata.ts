const tokenKey = "px-vj-shared-lesson-v1";
const compactTokenKey = "px-vj-short-lesson-v1";
const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://thepxgroup.co.th"
).replace(/\/$/, "");
const uploadsBaseUrl = (
  process.env.NEXT_PUBLIC_BASE_UPLOADS ||
  "https://px-spaces.sgp1.cdn.digitaloceanspaces.com"
).replace(/\/$/, "");
const digitalOceanSpacesHosts = new Set([
  "px-spaces.sgp1.digitaloceanspaces.com",
  "px-spaces.sgp1.cdn.digitaloceanspaces.com",
]);

type SearchParamValue = string | string[] | undefined;
export type SharedLessonSearchParams = Record<string, SearchParamValue>;

type SharedLessonIds = {
  organizationId: string;
  vdoId: string;
  title?: string;
  coverUrl?: string;
  playbackId?: string;
};

export type SharedLessonMetadata = {
  title: string;
  description: string;
  image: string;
};

type VdoResponseItem = {
  vdo_id?: string;
  title?: string;
  vdo_title?: string;
  cover_image?: string;
  coverImage?: string;
  cover_url?: string;
  coverUrl?: string;
  thumbnail?: string;
  playback_id?: string;
};

const fallbackMetadata: SharedLessonMetadata = {
  title: "เปิดบทเรียนในแอป PX VJ",
  description:
    "เปิดบทเรียน PX VJ พร้อมตรวจสอบสิทธิ์สมาชิก สังกัด และสถานะปลดล็อกก่อนเข้าชมวิดีโอ",
  image: `${siteUrl}/assets/image/cover_lading.png`,
};

export async function resolveSharedLessonMetadata(
  params: SharedLessonSearchParams,
): Promise<SharedLessonMetadata> {
  const ids = resolveSharedLessonIds(params);
  if (!ids) return fallbackMetadata;

  const tokenMetadata = metadataFromToken(ids);
  if (tokenMetadata) return tokenMetadata;

  const video = await fetchSharedLessonVideo(ids);
  if (!video) return fallbackMetadata;

  const title =
    normalizeString(video.title) ||
    normalizeString(video.vdo_title) ||
    fallbackMetadata.title;
  const image = resolveCoverImage(video) || fallbackMetadata.image;

  return {
    title: `เปิดบทเรียนในแอป PX VJ | ${title}`,
    description: title,
    image: toPreviewImageUrl(image),
  };
}

export function createSharedLessonUrl(params: SharedLessonSearchParams) {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    const normalizedValue = firstParamValue(value);
    if (normalizedValue) searchParams.set(key, normalizedValue);
  }

  const query = searchParams.toString();
  return `${siteUrl}/shared-lesson${query ? `?${query}` : ""}`;
}

function resolveSharedLessonIds(
  params: SharedLessonSearchParams,
): SharedLessonIds | null {
  const token =
    firstParamValue(params.lesson_token) ||
    firstParamValue(params.token) ||
    firstParamValue(params.data) ||
    firstParamValue(params.d);
  const decodedIds = token ? decodeSharedLessonToken(token) : null;
  if (decodedIds) return decodedIds;

  const organizationId =
    firstParamValue(params.organization_id) ||
    firstParamValue(params.organizationId) ||
    firstParamValue(params.orgId);
  const vdoId =
    firstParamValue(params.vdo_id) ||
    firstParamValue(params.vdoId) ||
    firstParamValue(params.lessonId);

  if (!organizationId || !vdoId) return null;
  return { organizationId, vdoId };
}

function decodeSharedLessonToken(token: string): SharedLessonIds | null {
  const compactIds = decodeCompactSharedLessonToken(token);
  if (compactIds) return compactIds;

  try {
    const cleanToken = token.trim();
    if (!cleanToken) return null;

    const padLength = (4 - (cleanToken.length % 4)) % 4;
    const paddedToken = cleanToken.padEnd(cleanToken.length + padLength, "=");
    const encryptedBytes = Buffer.from(
      paddedToken.replace(/-/g, "+").replace(/_/g, "/"),
      "base64",
    );
    const keyBytes = Buffer.from(tokenKey, "utf8");
    const decodedBytes = Buffer.from(
      encryptedBytes.map((byte, index) => byte ^ keyBytes[index % keyBytes.length]),
    );
    const payload = JSON.parse(decodedBytes.toString("utf8"));
    const organizationId = normalizeString(
      payload.o ?? payload.organization_id ?? payload.organizationId,
    );
    const vdoId = normalizeString(payload.v ?? payload.vdo_id ?? payload.vdoId);
    const title = normalizeString(payload.t ?? payload.title);
    const coverUrl = normalizeString(
      payload.c ?? payload.cover_url ?? payload.coverUrl,
    );
    const playbackId = normalizeString(
      payload.p ?? payload.playback_id ?? payload.playbackId,
    );

    if (!organizationId || !vdoId) return null;
    return { organizationId, vdoId, title, coverUrl, playbackId };
  } catch {
    return null;
  }
}

function decodeCompactSharedLessonToken(token: string): SharedLessonIds | null {
  try {
    const cleanToken = token.trim();
    if (!cleanToken) return null;

    const padLength = (4 - (cleanToken.length % 4)) % 4;
    const paddedToken = cleanToken.padEnd(cleanToken.length + padLength, "=");
    const encryptedBytes = Buffer.from(
      paddedToken.replace(/-/g, "+").replace(/_/g, "/"),
      "base64",
    );
    const keyBytes = Buffer.from(compactTokenKey, "utf8");
    const decodedBytes = Buffer.from(
      encryptedBytes.map((byte, index) => byte ^ keyBytes[index % keyBytes.length]),
    );

    if (decodedBytes.length < 33) return null;
    if (decodedBytes[0] !== 1 && decodedBytes[0] !== 2) return null;
    if (decodedBytes[0] === 1 && decodedBytes.length !== 33) return null;

    const coverUrl =
      decodedBytes[0] === 2 && decodedBytes.length > 33
        ? normalizeString(decodedBytes.subarray(33).toString("utf8"))
        : "";

    return {
      organizationId: bytesToUuid(decodedBytes.subarray(1, 17)),
      vdoId: bytesToUuid(decodedBytes.subarray(17, 33)),
      coverUrl,
    };
  } catch {
    return null;
  }
}

function bytesToUuid(bytes: Buffer) {
  const hex = bytes.toString("hex");
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32),
  ].join("-");
}

function metadataFromToken(ids: SharedLessonIds): SharedLessonMetadata | null {
  const title = normalizeString(ids.title);
  const image =
    (ids.coverUrl ? toAbsoluteMediaUrl(ids.coverUrl) : "") ||
    (ids.playbackId
      ? `https://image.mux.com/${ids.playbackId}/thumbnail.png`
      : "");

  if (!title && !image) return null;

  const displayTitle = title || fallbackMetadata.title;
  return {
    title: `เปิดบทเรียนในแอป PX VJ | ${displayTitle}`,
    description: displayTitle,
    image: toPreviewImageUrl(image || fallbackMetadata.image),
  };
}

async function fetchSharedLessonVideo({
  organizationId,
  vdoId,
}: SharedLessonIds): Promise<VdoResponseItem | null> {
  const baseApiUrl = (
    process.env.NEXT_PUBLIC_BASE_API ||
    process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API ||
    ""
  ).replace(/\/$/, "");
  if (!baseApiUrl) return null;

  try {
    const response = await fetch(
      `${baseApiUrl}/shared-lesson/metadata?organization_id=${encodeURIComponent(
        organizationId,
      )}&vdo_id=${encodeURIComponent(vdoId)}`,
      {
        headers: { Accept: "application/json" },
        next: { revalidate: 300 },
      },
    );
    if (!response.ok) return null;

    const root = await response.json();
    const video = root?.data;
    if (!video || normalizeString(video.vdo_id) !== vdoId) return null;
    return video;
  } catch {
    return null;
  }
}

function resolveCoverImage(video: VdoResponseItem) {
  const cover =
    normalizeString(video.cover_image) ||
    normalizeString(video.coverImage) ||
    normalizeString(video.cover_url) ||
    normalizeString(video.coverUrl) ||
    normalizeString(video.thumbnail);
  if (cover) return toAbsoluteMediaUrl(cover);

  const playbackId = normalizeString(video.playback_id);
  if (!playbackId) return "";
  return `https://image.mux.com/${playbackId}/thumbnail.png`;
}

function toAbsoluteMediaUrl(rawUrl: string) {
  if (/^(https?:)?\/\//.test(rawUrl)) return normalizeSpacesMediaUrl(rawUrl);
  return `${uploadsBaseUrl}/${rawUrl.replace(/^\/+/, "")}`;
}

function toPreviewImageUrl(rawUrl: string) {
  const imageUrl = normalizeString(rawUrl);
  if (!imageUrl) return fallbackMetadata.image;
  return imageUrl;
}

function normalizeSpacesMediaUrl(rawUrl: string) {
  try {
    const url = new URL(rawUrl.startsWith("//") ? `https:${rawUrl}` : rawUrl);
    if (!digitalOceanSpacesHosts.has(url.hostname)) return url.toString();

    const path = `${url.pathname.replace(/^\/+/, "")}${url.search}`;
    return `${uploadsBaseUrl}/${path}`;
  } catch {
    return rawUrl;
  }
}

function firstParamValue(value: SearchParamValue) {
  return normalizeString(Array.isArray(value) ? value[0] : value);
}

function normalizeString(value: unknown) {
  return String(value ?? "").trim();
}
