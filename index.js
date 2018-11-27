const app = require('./src');

const PORT = process.env.PORT || 9100;

app.listen(PORT, () => {
	console.log(`Referra API Server running on port ${PORT}!`);
});