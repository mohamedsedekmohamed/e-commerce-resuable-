'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function AOSInit() {
  const pathname = usePathname();

  useEffect(() => {
    AOS.init({
      duration: 600,
      once: true,
      easing: 'ease-out-cubic',
      offset: 50,
      debounceDelay: 50,
      throttleDelay: 99,
      startEvent: 'DOMContentLoaded',
    });

    // Two refreshes: one early for above-fold, one late for async-loaded sections
    const t1 = setTimeout(() => AOS.refresh(), 300);
    const t2 = setTimeout(() => AOS.refresh(), 1200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    // On route change give dynamic content time to render before refresh
    const t1 = setTimeout(() => AOS.refresh(), 400);
    const t2 = setTimeout(() => AOS.refresh(), 1000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [pathname]);

  return null;
}
