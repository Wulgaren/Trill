import {
  FaAmazon,
  FaBandcamp,
  FaBuildingColumns,
  FaDailymotion,
  FaDeezer,
  FaFacebook,
  FaInstagram,
  FaLastfm,
  FaLinkedin,
  FaNapster,
  FaSoundcloud,
  FaSpotify,
  FaTumblr,
  FaTwitch,
  FaTwitter,
  FaVimeo,
  FaWikipediaW,
  FaYoutube,
} from "react-icons/fa6";
import {
  SiApplemusic,
  SiImdb,
  SiItunes,
  SiMyspace,
  SiPandora,
  SiSongkick,
  SiTidal,
} from "react-icons/si";

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
    case url.includes("twitch"):
      return <FaTwitch size={size} />;
    case url.includes("archive.org"):
      return <FaBuildingColumns size={size} />;
    case url.includes("last.fm"):
      return <FaLastfm size={size} />;
    case url.includes("songkick"):
      return <SiSongkick size={size} />;
    case url.includes("imdb"):
      return <SiImdb size={size} />;
    case url.includes("spotify"):
      return <FaSpotify size={size} />;
    case url.includes("music.apple"):
      return <SiApplemusic size={size} />;
    case url.includes("tidal"):
      return <SiTidal size={size} />;
    case url.includes("itunes"):
      return <SiItunes size={size} />;
    case url.includes("amazon"):
      return <FaAmazon size={size} />;
    case url.includes("deezer"):
      return <FaDeezer size={size} />;
    case url.includes("pandora"):
      return <SiPandora size={size} />;
    case url.includes("napster"):
      return <FaNapster size={size} />;
  }

  return;
};

export default LinkIcon;
