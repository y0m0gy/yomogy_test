import React from "react";

// https://www.npmjs.com/package/react-social-media-embed
import {
  FacebookEmbed,
  InstagramEmbed,
  LinkedInEmbed,
  PinterestEmbed,
  TikTokEmbed,
  TwitterEmbed,
  YouTubeEmbed,
} from "react-social-media-embed";

interface SNSCardProps {
  url: string;
}

const getPlatformFromUrl = (
  url: string
):
  | "facebook"
  | "instagram"
  | "linkedin"
  | "pinterest"
  | "tiktok"
  | "twitter"
  | "youtube"
  | null => {
  const hostname = new URL(url).hostname;

  if (hostname.includes("facebook")) return "facebook";
  if (hostname.includes("instagram")) return "instagram";
  if (hostname.includes("linkedin")) return "linkedin";
  if (hostname.includes("pinterest")) return "pinterest";
  if (hostname.includes("tiktok")) return "tiktok";
  if (hostname.includes("twitter")) return "twitter";
  if (hostname.includes("youtube")) return "youtube";

  return null;
};

interface SNSCardProps {
  url: string;
}

const SNSCard: React.FC<SNSCardProps> = ({ url }) => {
  const platform = getPlatformFromUrl(url);

  switch (platform) {
    case "facebook":
      return (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <FacebookEmbed url={url} />
        </div>
      );
    case "instagram":
      return (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <InstagramEmbed url={url} />
        </div>
      );
    case "linkedin":
      return (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <LinkedInEmbed url={url} />
        </div>
      );
    case "pinterest":
      return (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <PinterestEmbed url={url} />
        </div>
      );
    case "tiktok":
      return (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <TikTokEmbed url={url} />
        </div>
      );

    case "twitter":
      return (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <TwitterEmbed url={url} />
        </div>
      );

    case "youtube":
      return (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <YouTubeEmbed url={url} />
        </div>
      );
    default:
      return <p>Unsupported platform or invalid URL.</p>;
  }
};

export default SNSCard;
