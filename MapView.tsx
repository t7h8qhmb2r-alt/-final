'use client';
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { Shop } from '../types';

interface MapViewProps {
  shops: Shop[];
  userLocation: { lat: number; lng: number } | null;
  highlightedIds: string[];
  onShopClick: (shop: Shop) => void;
}

export default function MapView({ shops, userLocation, highlightedIds, onShopClick }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<mapboxgl.Map | null>(null);
  const markersRef   = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;
    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    if (!token) return;

    mapboxgl.accessToken = token;
    mapRef.current = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: userLocation ? [userLocation.lng, userLocation.lat] : [139.6917, 35.6895],
      zoom: 15,
      attributionControl: false,
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right');

    return () => { mapRef.current?.remove(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // User location dot
  useEffect(() => {
    if (!mapRef.current || !userLocation) return;
    const map = mapRef.current;

    const center: [number, number] = [userLocation.lng, userLocation.lat];

    if (map.isStyleLoaded()) {
      map.setCenter(center);
    } else {
      map.once('load', () => map.setCenter(center));
    }

    const el = document.createElement('div');
    el.style.cssText = `
      width:16px;height:16px;border-radius:50%;
      background:#4ecca3;border:3px solid #fff;
      box-shadow:0 0 0 6px rgba(78,204,163,0.25);
      animation:pulse 2s ease infinite;
    `;
    new mapboxgl.Marker(el).setLngLat(center).addTo(map);
  }, [userLocation]);

  // Shop markers
  useEffect(() => {
    if (!mapRef.current) return;
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    shops.forEach((shop, i) => {
      const lat = parseFloat(shop.lat);
      const lng = parseFloat(shop.lng);
      if (isNaN(lat) || isNaN(lng)) return;

      const rank  = highlightedIds.indexOf(shop.id);
      const isTop = rank >= 0;
      const rankNum = rank + 1;

      const el = document.createElement('div');
      const size = isTop ? 40 : 30;
      el.style.cssText = `
        width:${size}px;height:${size}px;
        border-radius:50%;
        background:${isTop ? (rankNum === 1 ? '#c96eff' : rankNum === 2 ? '#ff6b9d' : '#ffb347') : '#201d24'};
        border:2px solid ${isTop ? 'rgba(255,255,255,0.6)' : '#38333f'};
        cursor:pointer;
        display:flex;align-items:center;justify-content:center;
        color:white;font-size:${isTop ? '15px' : '11px'};
        font-weight:700;
        box-shadow:${isTop ? `0 0 20px ${rankNum === 1 ? 'rgba(201,110,255,0.7)' : 'rgba(255,107,157,0.5)'}` : '0 2px 8px rgba(0,0,0,0.6)'};
        z-index:${isTop ? 20 - rank : 1};
        transition:transform 0.2s;
      `;
      el.textContent = isTop ? ['🥇','🥈','🥉'][rank] : String(i + 1);
      el.addEventListener('mouseenter', () => { el.style.transform = 'scale(1.15)'; });
      el.addEventListener('mouseleave', () => { el.style.transform = 'scale(1)'; });
      el.addEventListener('click', () => onShopClick(shop));

      const popup = new mapboxgl.Popup({ offset: 18, closeButton: false, maxWidth: '220px' })
        .setHTML(`
          <div style="background:#18151a;color:#f2eef6;padding:10px 14px;border-radius:10px;font-family:'Zen Kaku Gothic New',sans-serif;">
            <div style="font-weight:700;font-size:13px;margin-bottom:4px;">${shop.name}</div>
            <div style="font-size:11px;color:#b0a8bc;">${shop.genre?.name || ''}</div>
            ${shop.online_reserve === '1' ? '<div style="font-size:11px;color:#4ecca3;margin-top:4px;">✓ オンライン予約可</div>' : ''}
          </div>
        `);

      const marker = new mapboxgl.Marker(el)
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(mapRef.current!);

      markersRef.current.push(marker);
    });
  }, [shops, highlightedIds, onShopClick]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}
