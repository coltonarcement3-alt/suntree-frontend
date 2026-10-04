/*
Ultraviolet (UV) Configuration
Docs: https://github.com/titaniumnetwork-dev/ultraviolet/tree/main/docs
*/

self.__uv$config = {
	prefix: '/uv/service/',
	encodeUrl: true,
	bareServers: ['http://localhost:8080/', 'https://localhost:8080/'],
	bypassHeaders: ['user-agent'],
	wispUrl: 'ws://localhost:8080/wisp/',
	secure: false,
	logLevel: 'debug',
};
