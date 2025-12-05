'use client';

import React from 'react';

const VIDEO_PATH = '/videos/dediinternetort.mp4.mp4';
const POSTER_PATH = 'https://internetportcom.b-cdn.net/se/img/natverk-kablar-narbild.png';

const VideoEmbed = () => {
  return (
    <div className="rounded-md overflow-hidden lg:max-w-[80%] mx-auto">
      <video width="100%" height="auto" controls poster={POSTER_PATH}>
        <source src={VIDEO_PATH} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoEmbed;
