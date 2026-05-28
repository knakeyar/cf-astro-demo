import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const pages = defineCollection({
  loader: glob({
    base: "./src/content/pages",
    pattern: "**/*.{md,mdx}",
  }),

  schema: z.object({
    title: z.string(),
    description: z.string(),
    heroTitle: z.string(),
    heroText: z.string(),

    resources: z
      .array(
        z.object({
          title: z.string(),
          description: z.string(),
          fileType: z.string(),
          fileSize: z.string(),
          url: z.string(),
        })
      )
      .optional(),
  }),
});

export const collections = {
  pages,
};