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
    heroImage: z.string().optional(),
    heroImageLabel: z.string().optional(),


    sections: z
      .array(
        z.object({
          eyebrow: z.string().optional(),
          title: z.string(),
          text: z.string(),
          image: z.string().optional(),
          imageLabel: z.string().optional(),
        })
      )
      .optional(),

    cards: z
      .array(
        z.object({
          title: z.string(),
          text: z.string(),
          image: z.string().optional(),
          imageLabel: z.string().optional(),
        })
      )
      .optional(),

    resources: z
      .array(
        z.object({
          title: z.string(),
          description: z.string(),
          fileType: z.string(),
          fileSize: z.string(),
          url: z.string(),
          thumbnail: z.string().optional(),
        })
      )
      .optional(),
  }),
});

export const collections = {
  pages,
};