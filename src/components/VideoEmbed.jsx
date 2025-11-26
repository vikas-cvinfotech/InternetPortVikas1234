// components/VideoEmbed.jsx

import React from 'react';

const VideoEmbed = () => {
  const videoUrl =
    'https://iframe.mediadelivery.net/play/93105/c8cb823b-6f68-4b8f-ac02-ad3ed52d9a30';

  return (
    <section>
      {/* Video Container */}
      <div
        style={{
          maxWidth: '800px', // Optional: Constrain max width for better viewing
          margin: '0 auto',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <iframe
          src={videoUrl}
          title="Server Management Video Guide"
          // Set to a reasonable aspect ratio (e.g., 16:9 for a typical video)
          style={{ width: '100%', height: '450px', display: 'block' }}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </section>
  );
};

export default VideoEmbed;
