import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ArrowRight } from 'lucide-react';

const CardProject = ({ Img, Title, Description, Link: ProjectLink, id }) => {
  const [imageError, setImageError] = React.useState(false);
  
  const handleLiveDemo = (e) => {
    if (!ProjectLink) {
      e.preventDefault();
      alert("Live demo link is not available");
    }
  };
  
  const handleDetails = (e) => {
    if (!id) {
      e.preventDefault();
      alert("Project details are not available");
    }
  };

  return (
    <div className="group relative w-full h-[380px] sm:h-[400px] overflow-hidden rounded-2xl bg-[#08080c] border border-white/10 group-hover:border-white/25 shadow-[0_12px_36px_rgba(0,0,0,0.7)] transition-all duration-500">
      {/* Background Image */}
      {Img && !imageError ? (
        <img
          src={Img}
          alt={Title}
          onError={() => setImageError(true)}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-90 group-hover:brightness-100"
        />
      ) : (
        <div className="absolute inset-0 w-full h-full bg-[#0d0d12] flex items-center justify-center">
          <div className="text-zinc-600 text-5xl">🖼️</div>
        </div>
      )}
      
      {/* Cinematic Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-300"></div>
      
      {/* Content */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        <div className="transform transition-transform duration-300 group-hover:translate-y-[-4px]">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 tracking-tight group-hover:text-zinc-100 transition-colors">
            {Title || 'Untitled Project'}
          </h3>
          
          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed line-clamp-2 mb-4 opacity-80 group-hover:opacity-100 transition-opacity duration-300 font-light">
            {Description || 'No description available'}
          </p>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-3 opacity-90 group-hover:opacity-100 transition-all duration-300">
            {ProjectLink ? (
              <a
                href={ProjectLink || "#"}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleLiveDemo}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black hover:bg-zinc-200 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 hover:scale-105 shadow-[0_2px_12px_rgba(255,255,255,0.15)]"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                VIEW APP
              </a>
            ) : (
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 text-zinc-500 text-xs sm:text-sm font-semibold rounded-xl cursor-not-allowed">
                <ExternalLink className="w-3.5 h-3.5" />
                VIEW APP
              </span>
            )}

            {id ? (
              <Link
                to={`/project/${id}`}
                onClick={handleDetails}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.06] hover:bg-white/[0.12] backdrop-blur-md text-zinc-200 hover:text-white text-xs sm:text-sm font-medium rounded-xl transition-all duration-200 hover:scale-105 border border-white/10 hover:border-white/20"
              >
                Details
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.02] text-zinc-600 text-xs sm:text-sm font-medium rounded-xl cursor-not-allowed border border-white/5">
                Details
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardProject;
