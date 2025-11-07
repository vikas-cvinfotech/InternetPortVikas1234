'use client';

import React from 'react';

export default function BroadbandProductTemplate({ product }) {
  if (!product) {
    return null;
  }

  return (
    <div className="bg-primary p-8">
      <h1 className="text-3xl font-bold text-accent mb-4">Broadband Product: {product.name}</h1>
      <p className="text-lg text-secondary">This is a special template for broadband products.</p>
      <div className="mt-4 text-secondary">
        <p><span className="font-semibold">Product ID:</span> {product.id}</p>
        <p><span className="font-semibold">Price:</span> {product.price}</p>
        <p><span className="font-semibold">Category:</span> {product.category}</p>
      </div>
    </div>
  );
}
