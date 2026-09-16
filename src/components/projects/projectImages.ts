/**
 * Shared project image resolution for the static presentation assets and
 * database-backed project records.
 */

export interface ProjectImageSourceInput {
  id: string;
  image?: string | null;
}

export interface ProjectImageSources {
  imageDesktop: string;
  imageMobile: string;
}

export const VERSIONED_IMAGE_MAP: Record<string, string> = {
  "/projects/temporary/fresh-flow-desktop.jpg": "/projects/temporary/fresh-flow-desktop.v2.jpg",
  "/projects/temporary/fresh-flow-mobile.jpg": "/projects/temporary/fresh-flow-mobile.v2.jpg",
  "/projects/temporary/fresh-flow-placeholder.jpg": "/projects/temporary/fresh-flow-placeholder.v2.jpg",
  "/projects/temporary/sohail-shop-desktop.jpg": "/projects/temporary/sohail-shop-desktop.v2.jpg",
  "/projects/temporary/sohail-shop-mobile.jpg": "/projects/temporary/sohail-shop-mobile.v2.jpg",
  "/projects/temporary/sohail-shop-placeholder.jpg": "/projects/temporary/sohail-shop-placeholder.v2.jpg",
  "/projects/temporary/sohail-studio-desktop.jpg": "/projects/temporary/sohail-studio-desktop.v2.jpg",
  "/projects/temporary/sohail-studio-mobile.jpg": "/projects/temporary/sohail-studio-mobile.v2.jpg",
  "/projects/temporary/sohail-studio-placeholder.jpg": "/projects/temporary/sohail-studio-placeholder.v2.jpg",
  "/projects/temporary/wedding-desktop.jpg": "/projects/temporary/wedding-desktop.v2.jpg",
  "/projects/temporary/wedding-mobile.jpg": "/projects/temporary/wedding-mobile.v2.jpg",
  "/projects/temporary/wedding-placeholder.jpg": "/projects/temporary/wedding-placeholder.v2.jpg",
  "/projects/temporary/new-chapter-desktop.jpg": "/projects/temporary/new-chapter-desktop.v2.jpg",
  "/projects/temporary/new-chapter-mobile.jpg": "/projects/temporary/new-chapter-mobile.v2.jpg",
  "/projects/temporary/new-chapter-placeholder.jpg": "/projects/temporary/new-chapter-placeholder.v2.jpg",
};

export function resolveVersionedProjectImageUrl(url?: string | null): string {
  if (!url) return "";
  const trimmed = url.trim();
  return VERSIONED_IMAGE_MAP[trimmed] || trimmed;
}

export const TEMPORARY_PROJECT_IMAGE_MAP: Record<string, ProjectImageSources> = {
  "sohail-shop": {
    imageDesktop: "/projects/temporary/sohail-shop-desktop.v2.jpg",
    imageMobile: "/projects/temporary/sohail-shop-mobile.v2.jpg",
  },
  "sohail-studio": {
    imageDesktop: "/projects/temporary/sohail-studio-desktop.v2.jpg",
    imageMobile: "/projects/temporary/sohail-studio-mobile.v2.jpg",
  },
  "fresh-flow": {
    imageDesktop: "/projects/temporary/fresh-flow-desktop.v2.jpg",
    imageMobile: "/projects/temporary/fresh-flow-mobile.v2.jpg",
  },
  wedding: {
    imageDesktop: "/projects/temporary/wedding-desktop.v2.jpg",
    imageMobile: "/projects/temporary/wedding-mobile.v2.jpg",
  },
  "new-chapter": {
    imageDesktop: "/projects/temporary/new-chapter-desktop.v2.jpg",
    imageMobile: "/projects/temporary/new-chapter-mobile.v2.jpg",
  },
};

export function resolveProjectImages(project: ProjectImageSourceInput): ProjectImageSources {
  if (project.image && project.image.trim()) {
    const trimmed = project.image.trim();
    return {
      imageDesktop: trimmed,
      imageMobile: trimmed,
    };
  }

  const custom = TEMPORARY_PROJECT_IMAGE_MAP[project.id];
  if (custom) return custom;

  return {
    imageDesktop: "",
    imageMobile: "",
  };
}

export function resolveProjectImage(project: ProjectImageSourceInput): string {
  return resolveProjectImages(project).imageDesktop;
}
