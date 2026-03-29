import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite';

export default defineConfig({
	test: {
		include: ['src/**/*.test.js'],
		environment: 'node',
		reporters: ['default', ['junit', { outputFile: 'test-results/junit.xml' }]]
	},
	plugins: [
		tailwindcss(),
		sveltekit(),
		VitePWA({
			registerType: 'autoUpdate',
			injectRegister: null,
			workbox: {
				navigateFallback: null,
				globPatterns: ['**/*.{js,css,ico,png,svg,csv}'],
				runtimeCaching: [
					{
						urlPattern: ({ request }) => request.mode === 'navigate',
						handler: 'NetworkFirst',
						options: {
							cacheName: 'pages-cache',
							networkTimeoutSeconds: 3,
							expiration: {
								maxEntries: 20,
								maxAgeSeconds: 60 * 60 * 24 * 14
							}
						}
					}
				]
			},
			manifest: {
				name: 'Bhutan Infectious Disease Guidelines',
				short_name: 'Menlam',
				description: 'Medical reference for Bhutanese doctors — available offline.',
				theme_color: '#059669',
				background_color: '#ffffff',
				display: 'standalone',
				start_url: '/',
				icons: [
					{ src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
					{
						src: '/android-chrome-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'any maskable'
					},
					{ src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
				]
			}
		})
	]
});
