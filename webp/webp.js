import imagemin from 'imagemin'
import imageminWebp from 'imagemin-webp'
import imageminPngquant from 'imagemin-pngquant'

await imagemin(['images/*'], {
	destination: 'build/images',
	plugins: [
		imageminWebp({
			quality: 80
		}),
		imageminPngquant({
			quality: 0.8
		}),
	]
})

console.log('WebP Done!')
