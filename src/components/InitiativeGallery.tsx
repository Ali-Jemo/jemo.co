import Image from "next/image";
import { GalleryVerticalEnd, Play } from "lucide-react";

interface InitiativeGalleryProps {
  image?: string;
  gallery?: string[];
  title: string;
}

export default function InitiativeGallery({ image, gallery, title }: InitiativeGalleryProps) {
  if (!image && (!gallery || gallery.length === 0)) return null;

  const images = image ? [image, ...(gallery || [])] : gallery || [];

  return (
    <section className="mb-12">
      {/* Main hero image */}
      {image && (
        <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden border border-[var(--line)] mb-4">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-transparent to-transparent" />
        </div>
      )}

      {/* Gallery thumbnails */}
      {gallery && gallery.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {gallery.map((img, i) => (
            <div key={i} className="relative aspect-[16/10] rounded-xl overflow-hidden border border-[var(--line)] group cursor-pointer">
              <Image
                src={img}
                alt={`${title} - ${i + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <Play className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
