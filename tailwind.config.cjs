/** @type {import('tailwindcss').Config}*/
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}', './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'],

	darkMode: 'class',
	theme: {
		colors: {
			'primary': {
				light: "#ffffff",
				DEFAULT: "#94c6f7",
				dark: "#0304f5",
			},
			'accent': "#ebc181",
			'secondary': {
				light: '#ffffff',
				DEFAULT: '#00000019',
				dark: '#10101010',
			}
			
		}
	},

	plugins: [require('flowbite/plugin')],
};

module.exports = config;
