import {
  FaBandcamp,
  FaDailymotion,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaSoundcloud,
  FaTumblr,
  FaTwitter,
  FaVimeo,
  FaWikipediaW,
  FaYoutube,
} from "react-icons/fa6";
import { SiMyspace } from "react-icons/si";

const LinkIcon = ({ url, size = 24 }: { url: string; size?: number }) => {
  if (!url) return;

  url = url.toLowerCase();

  switch (true) {
    case url.includes("twitter"):
    case url.includes("x."):
      return <FaTwitter size={size} />;
    case url.includes("facebook"):
      return <FaFacebook size={size} />;
    case url.includes("linkedin"):
      return <FaLinkedin size={size} />;
    case url.includes("bandcamp"):
      return <FaBandcamp size={size} />;
    case url.includes("instagram"):
      return <FaInstagram size={size} />;
    case url.includes("soundcloud"):
      return <FaSoundcloud size={size} />;
    case url.includes("wikipedia"):
      return <FaWikipediaW size={size} />;
    case url.includes("youtube"):
      return <FaYoutube size={size} />;
    case url.includes("vimeo"):
      return <FaVimeo size={size} />;
    case url.includes("tumblr"):
      return <FaTumblr size={size} />;
    case url.includes("dailymotion"):
      return <FaDailymotion size={size} />;
    case url.includes("myspace"):
      return <SiMyspace size={size} />;
  }

  return;
};

export default LinkIcon;
