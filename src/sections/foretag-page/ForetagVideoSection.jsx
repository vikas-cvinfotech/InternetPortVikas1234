'use client';

export default function ForetagVideoSection() {
  return (
    <section className="w-full flex justify-center">
      <div className="w-full max-w-4xl">
        <iframe
          className="w-full h-[400px] md:h-[550px] rounded-xl"
          src="https://www.youtube.com/embed/ZlL-bIyJJA0"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </section>
  );
}
