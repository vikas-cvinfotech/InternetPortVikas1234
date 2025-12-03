'use client';

export default function ForetagVideoSection() {
  return (
    <section className="w-full flex justify-center">
      <div className="w-full max-w-4xl">
        <iframe
          width="560"
          height="315"
          className="w-full h-[400px] md:h-[550px] rounded-lg"
          src="https://www.youtube.com/embed/4jFYXhgGC8M?si=m6_dsijNpKV9VtIg"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
        ></iframe>
      </div>
    </section>
  );
}
