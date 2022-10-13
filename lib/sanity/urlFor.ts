import imageUrlBuilder from "@sanity/image-url";
import { client } from "./client";

const builder = imageUrlBuilder(client());

export const urlFor = (source) => {
  const src = builder.image(source);

  return src;
};
