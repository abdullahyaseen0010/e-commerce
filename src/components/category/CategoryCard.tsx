import Image from 'next/image';
import Link from 'next/link';

export interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  productCount?: number;
}

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const { name, slug, imageUrl, productCount } = category;

  return (
    <Link
      href={`/categories/${slug}`}
      className="group relative block aspect-[4/5] w-full overflow-hidden rounded-lg bg-slate-100"
    >
      <Image
        src={imageUrl}
        alt={name}
        fill
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
        className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent transition-opacity duration-300 group-hover:from-black/70" />

      <div className="absolute inset-x-0 bottom-0 p-4">
        <h3 className="text-lg font-semibold text-white">{name}</h3>
        {typeof productCount === 'number' && (
          <p className="mt-0.5 text-sm text-white/80">
            {productCount} {productCount === 1 ? 'item' : 'items'}
          </p>
        )}
      </div>
    </Link>
  );
}