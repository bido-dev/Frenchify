import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

const bookData = [
    {
        front: { title: "Explore France", subtitle: "A visual journey", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800", color: "bg-blue-900", text: "text-white", isCover: true },
        back: { title: "Introduction", content: "France is a country of timeless beauty, where every region tells a unique story. Dive in to start your adventure.", image: null, color: "bg-stone-50", text: "text-stone-900", isCover: false }
    },
    {
        front: { title: "Paris", content: "The iconic City of Light. From the Eiffel Tower to the cobblestone streets of Montmartre.", image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=800", color: "bg-white", text: "text-gray-900", isCover: false },
        back: { title: "Gastronomie", content: "World-class cuisine. Enjoy flaky croissants, exquisite wine, and rich artisanal cheeses.", image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=800", color: "bg-amber-50", text: "text-gray-900", isCover: false }
    },
    {
        front: { title: "La Provence", content: "Sun-drenched lavender fields, historic villages, and the sparkling Mediterranean coast.", image: "https://images.unsplash.com/photo-1504217051514-96afa06398be?auto=format&fit=crop&q=80&w=800", color: "bg-purple-50", text: "text-gray-900", isCover: false },
        back: { title: "Art & Culture", content: "The birthplace of impressionism. A global center for literature, fashion, and cinema.", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800", color: "bg-indigo-50", text: "text-gray-900", isCover: false }
    },
    {
        front: { title: "Architecture", content: "From Gothic cathedrals to magnificent Renaissance châteaux and modern marvels.", image: "https://images.unsplash.com/photo-1520939817895-060bdaf4fe1b?auto=format&fit=crop&q=80&w=800", color: "bg-stone-50", text: "text-gray-900", isCover: false },
        back: { title: "Fin", subtitle: "Join Frenchify", image: null, color: "bg-gray-900", text: "text-white", isCover: true }
    },
];

export const InteractiveBook: React.FC = () => {
    const [currentLeaf, setCurrentLeaf] = useState(0);
    const [flippingLeaf, setFlippingLeaf] = useState<number | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);

    const FLIP_DURATION = 800;

    const nextLeaf = () => {
        if (isAnimating || currentLeaf >= bookData.length) return;
        setIsAnimating(true);
        setFlippingLeaf(currentLeaf);
        setCurrentLeaf(currentLeaf + 1);
        setTimeout(() => { setFlippingLeaf(null); setIsAnimating(false); }, FLIP_DURATION + 50);
    };

    const prevLeaf = () => {
        if (isAnimating || currentLeaf <= 0) return;
        setIsAnimating(true);
        const leafToFlip = currentLeaf - 1;
        setFlippingLeaf(leafToFlip);
        setCurrentLeaf(leafToFlip);
        setTimeout(() => { setFlippingLeaf(null); setIsAnimating(false); }, FLIP_DURATION + 50);
    };

    return (
        <div className="flex flex-col items-center w-full py-8 md:py-16 overflow-hidden">
            {/* Controls Top */}
            <div className="flex gap-4 mb-8">
                <button
                    onClick={prevLeaf}
                    disabled={currentLeaf === 0 || isAnimating}
                    className="p-3 shadow-md rounded-full bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    <ChevronLeft size={24} />
                </button>
                <div className="flex items-center font-medium text-gray-500 bg-white/50 backdrop-blur-sm px-4 rounded-full shadow-sm">
                    Page {Math.min(currentLeaf * 2, bookData.length * 2)} of {bookData.length * 2}
                </div>
                <button
                    onClick={nextLeaf}
                    disabled={currentLeaf === bookData.length || isAnimating}
                    className="p-3 shadow-md rounded-full bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    <ChevronRight size={24} />
                </button>
            </div>

            {/* Book Container */}
            <div className="relative w-[340px] h-[260px] sm:w-[500px] sm:h-[350px] md:w-[800px] md:h-[500px]" style={{ perspective: '2000px' }}>

                {/* Book Base / Cover Shadow */}
                <div className="absolute inset-0 bg-black/15 rounded-xl blur-xl translate-y-4 md:translate-y-8 pointer-events-none"></div>

                {bookData.map((leaf, i) => {
                    const isFlipped = i < currentLeaf;
                    // The actively flipping leaf gets the highest z-index so it stays
                    // on top throughout the entire CSS transition (both directions).
                    let zIndex: number;
                    if (i === flippingLeaf) {
                        zIndex = bookData.length + 1;
                    } else if (isFlipped) {
                        zIndex = i + 1;
                    } else {
                        zIndex = bookData.length - i;
                    }

                    return (
                        <div
                            key={i}
                            className="absolute top-0 right-0 w-1/2 h-full cursor-pointer group"
                            style={{
                                zIndex,
                                transformOrigin: 'left center',
                                transform: isFlipped ? 'rotateY(-180deg)' : 'rotateY(0deg)',
                                transition: 'transform 0.8s cubic-bezier(0.645, 0.045, 0.355, 1)',
                                transformStyle: 'preserve-3d',
                            }}
                            onClick={() => {
                                if (isFlipped) prevLeaf();
                                else nextLeaf();
                            }}
                        >
                            {/* FRONT OF LEAF */}
                            <div
                                className={`absolute inset-0 rounded-r-xl border border-gray-200/50 shadow-sm overflow-hidden flex flex-col ${leaf.front.color} ${leaf.front.text} transition-shadow duration-300 group-hover:shadow-md`}
                                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(0deg)' }}
                            >
                                {/* Spine shadow */}
                                <div className="absolute top-0 left-0 w-8 h-full bg-gradient-to-r from-black/15 to-transparent z-20 pointer-events-none"></div>
                                {/* Shine effect */}
                                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-white/10 to-transparent z-20 pointer-events-none"></div>

                                {leaf.front.image && (
                                    <div className={`w-full ${leaf.front.isCover ? 'h-full absolute inset-0' : 'h-1/2'} relative`}>
                                        <div className="absolute inset-0 bg-black/20 z-10 transition-colors duration-300 group-hover:bg-black/10"></div>
                                        <img src={leaf.front.image} alt={leaf.front.title} className="w-full h-full object-cover" />
                                    </div>
                                )}

                                {leaf.front.isCover && (
                                    <div className={`absolute inset-0 z-20 flex flex-col items-center justify-center p-4 md:p-8 text-center ${leaf.front.image ? 'bg-black/30' : ''}`}>
                                        <BookOpen className="w-8 h-8 md:w-16 md:h-16 mb-4 md:mb-8 opacity-90 text-white" />
                                        <h3 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-2 md:mb-4 tracking-tight drop-shadow-lg">{leaf.front.title}</h3>
                                        {leaf.front.subtitle && <p className="text-sm border-t border-white/30 pt-4 sm:text-lg md:text-2xl opacity-90 tracking-wide">{leaf.front.subtitle}</p>}
                                    </div>
                                )}

                                {!leaf.front.isCover && (
                                    <div className={`p-4 sm:p-6 md:p-10 flex-1 flex flex-col justify-center ${leaf.front.image ? '' : 'h-full'} relative`}>
                                        <h3 className="text-lg sm:text-2xl md:text-3xl font-bold mb-2 md:mb-4 leading-tight">{leaf.front.title}</h3>
                                        <p className="text-[10px] sm:text-sm md:text-lg leading-relaxed opacity-80">
                                            {leaf.front.content}
                                        </p>
                                    </div>
                                )}

                                {!leaf.front.isCover && (
                                    <div className="absolute bottom-3 right-4 sm:bottom-4 sm:right-6 text-xs sm:text-sm font-medium opacity-40">
                                        {i * 2 + 1}
                                    </div>
                                )}
                            </div>

                            {/* BACK OF LEAF */}
                            <div
                                className={`absolute inset-0 rounded-l-xl border border-gray-200/50 shadow-sm overflow-hidden flex flex-col ${leaf.back.color} ${leaf.back.text} transition-shadow duration-300 group-hover:shadow-md`}
                                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                            >
                                {/* Spine shadow (on the right for back pages) */}
                                <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-black/20 to-transparent z-20 pointer-events-none"></div>
                                {/* Shine effect */}
                                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white/10 to-transparent z-20 pointer-events-none"></div>

                                {leaf.back.image && (
                                    <div className={`w-full ${leaf.back.isCover ? 'h-full absolute inset-0' : 'h-1/2'} relative`}>
                                        <div className="absolute inset-0 bg-black/20 z-10 transition-colors duration-300 group-hover:bg-black/10"></div>
                                        <img src={leaf.back.image} alt={leaf.back.title} className="w-full h-full object-cover" />
                                    </div>
                                )}

                                {leaf.back.isCover && (
                                    <div className={`absolute inset-0 z-20 flex flex-col items-center justify-center p-4 md:p-8 text-center ${leaf.back.image ? 'bg-black/40' : ''}`}>
                                        <div className="w-10 h-10 md:w-16 md:h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-4 md:mb-6 border border-white/20 text-white shadow-lg">
                                            <span className="font-bold text-lg md:text-2xl">F</span>
                                        </div>
                                        <h3 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-2 md:mb-4 text-white drop-shadow-lg">{leaf.back.title}</h3>
                                        {leaf.back.subtitle && <p className="text-sm border-t border-white/30 pt-4 sm:text-lg md:text-2xl opacity-90 tracking-wide text-white">{leaf.back.subtitle}</p>}
                                    </div>
                                )}

                                {!leaf.back.isCover && (
                                    <div className={`p-4 sm:p-6 md:p-10 flex-1 flex flex-col justify-center ${leaf.back.image ? '' : 'h-full'} relative`}>
                                        <h3 className="text-lg sm:text-2xl md:text-3xl font-bold mb-2 md:mb-4 leading-tight">{leaf.back.title}</h3>
                                        <p className="text-[10px] sm:text-sm md:text-lg leading-relaxed opacity-80">
                                            {leaf.back.content}
                                        </p>
                                    </div>
                                )}

                                {!leaf.back.isCover && (
                                    <div className="absolute bottom-3 left-4 sm:bottom-4 sm:left-6 text-xs sm:text-sm font-medium opacity-40">
                                        {i * 2 + 2}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-8 text-sm text-gray-400 bg-gray-100/50 backdrop-blur-sm px-4 py-1.5 rounded-full">
                Tap or click pages to flip
            </div>
        </div>
    );
};
