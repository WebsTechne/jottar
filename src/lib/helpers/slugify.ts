import slugify from "slugify";

export function Slugify(input: string): string {
  const slug = slugify(input, { lower: true, strict: true });
  return slug;
}
