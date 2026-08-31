import React from 'react';

interface ProfileProps {
  isMember: boolean;
  username: string;
}

export const SanctuaryProfileBadge: React.FC<ProfileProps> = ({ isMember, username }) => {
  return (
    <div className="flex flex-col items-center p-4">
      <h3 className="text-[#E5C07B] font-serif text-lg mb-3">{username}'s Sanctuary</h3>
      
      {isMember ? (
        <div className="flex flex-col items-center">
          <img
            src="/assets/sanctuaryemb.jpg"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = './assets/sanctuaryemb.jpg'; }}
            alt="Sanctuary Member Emblem"
            className="w-48 h-48 aspect-square object-cover rounded-full drop-shadow-[0_0_15px_rgba(212,175,55,0.5)] border-2 border-amber-400"
          />
          <span className="text-[#D4AF37] text-xs tracking-widest mt-2 uppercase font-bold">
            Sanctuary Member
          </span>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <img
            src="/assets/freeseeker.jpg"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = './assets/freeseeker.jpg'; }}
            alt="Free Seeker Badge"
            className="w-48 h-48 object-contain rounded-2xl shadow-lg border border-purple-800/40"
          />
          <span className="text-purple-300 text-xs tracking-widest mt-2 uppercase font-bold">
            Free Seeker
          </span>
        </div>
      )}
    </div>
  );
};

export default SanctuaryProfileBadge;
