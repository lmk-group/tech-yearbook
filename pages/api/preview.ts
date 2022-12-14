import groq from "groq";
import { NextApiRequest, NextApiResponse } from "next";
import { client } from "../../lib/sanity/client";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Check the secret and next parameters
  // This secret should only be known to this API route and the CMS
  if (req.query.secret !== "1337" || !req.query.slug) {
    return res.status(401).json({ message: "Invalid token" });
  }

  // Fetch the headless CMS to check if the provided `slug` exists
  // getPostBySlug would implement the required fetching logic to the headless CMS
  const post = await client({ preview: true }).fetch(
    groq`*[slug.current == $slug][0]`,
    { slug: req.query.slug }
  );

  // If the slug doesn't exist prevent preview mode from being enabled
  if (!post) {
    return res.status(401).json({ message: "Invalid slug" });
  }

  // Enable Preview Mode by setting the cookies
  res.setPreviewData({});

  // Redirect to the path from the fetched post
  // We don't redirect to req.query.slug as that might lead to open redirect vulnerabilities
  res.redirect(`/${post._type}/${post.slug.current}`);
};

export default handler;
