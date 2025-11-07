'use client';

import { useState } from 'react';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

export default function Cart() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="ml-4 flow-root text-sm lg:relative lg:ml-8">
      <button
        type="button"
        className="group -m-2 flex items-center p-2"
        onClick={() => setCartOpen(!cartOpen)}
      >
        <ShoppingCartIcon
          aria-hidden="true"
          className="size-6 flex-shrink-0 text-secondary group-hover:text-accent"
        />
        <span className="ml-2 text-sm font-medium text-secondary group-hover:text-accent">0</span>
        <span className="sr-only">items in cart, view bag</span>
      </button>
    </div>
  );
}
