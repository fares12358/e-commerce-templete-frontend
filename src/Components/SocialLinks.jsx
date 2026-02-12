import {
    FaFacebookF,
    FaTwitter,
    FaInstagram,
    FaYoutube,
    FaTelegramPlane,
    FaTiktok,
} from "react-icons/fa";

const SOCIAL_ICONS = {
    facebook: FaFacebookF,
    twitter: FaTwitter,
    instagram: FaInstagram,
    youtube: FaYoutube,
    telegram: FaTelegramPlane,
    tiktok: FaTiktok,
};

export function SocialLinks({ links }) {
    if (!links) return null;

    return (
        <div className="flex gap-4 flex-wrap pt-6 w-full items-center justify-center">
            {Object.entries(links).map(([key, url]) => {
                if (!url) return null;

                const Icon = SOCIAL_ICONS[key];
                if (!Icon) return null;

                return (
                    <a
                        key={key}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="size-10 rounded-full border border-black flex items-center justify-center hover:bg-black hover:text-white transition"
                    >
                        <Icon size={18} />
                    </a>
                );
            })}
        </div>
    );
}
