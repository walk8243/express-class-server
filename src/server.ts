import { app } from './app';
import { AddressInfo } from 'net';

const server = app.listen(3000);
server
	.on('listening', () => {
		const address = server.address() as AddressInfo;
		if(address.family == 'IPv4') {
			console.log('access to', `localhost:${address.port}`, '.');
		} else if(address.family == 'IPv6') {
			console.log('access to', `[::1]:${address.port}`, '.');
		} else {
			console.log('listening');
		}
	})
	.on('error', (error) => {
		console.error(error);
	});
