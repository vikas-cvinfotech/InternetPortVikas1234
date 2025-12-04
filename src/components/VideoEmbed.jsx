'use client';

import React, { useState } from 'react';
import ReactPlayer from 'react-player';

const VideoEmbed = ({ url, poster }) => {
  const [error, setError] = useState(false);

  // Determine if the URL is an iframe/embed or a direct video
  const isEmbed = url.includes('iframe') || url.includes('mediadelivery.net');

  if (error) {
    return (
      <section className="w-full flex justify-center items-center py-8 bg-gray-100">
        <div className="w-full max-w-4xl aspect-video flex justify-center items-center bg-black text-white rounded-lg">
          <p>Video cannot be loaded. Please contact the site owner or check the URL.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full flex justify-center items-center py-8 bg-gray-100">
      <div className="w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
        {isEmbed ? (
          <iframe
            src={url}
            width="100%"
            height="100%"
            frameBorder="0"
            allow="autoplay; fullscreen"
            allowFullScreen
            title="Embedded Video"
            onError={() => setError(true)}
          />
        ) : (
          <ReactPlayer
            url={url}
            controls
            width="100%"
            height="100%"
            light={poster} // optional thumbnail
            onError={() => setError(true)}
          />
        )}
      </div>
    </section>
  );
};

export default VideoEmbed;
