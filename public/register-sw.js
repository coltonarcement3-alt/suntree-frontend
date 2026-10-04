if (navigator.serviceWorker) {
	navigator.serviceWorker
		.register('/uv/sw.js', {
			scope: '/uv/service/',
		})
		.then((registration) => {
			console.log('Service worker registered:', registration);
		})
		.catch((error) => {
			console.error('Service worker registration failed:', error);
		});
} else {
	console.warn('Service workers are not supported in this browser');
}
