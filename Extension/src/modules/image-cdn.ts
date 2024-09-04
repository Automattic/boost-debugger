import type { StatusObject } from "../types/module";
import type { Module } from "./interface-module";

export class ImageCdn implements Module {
	public readonly identifier = 'image-cdn';

	public getStatus(): StatusObject {
		const images = document.querySelectorAll( 'img' );
		let cdnImageCount = 0;
		let nonCdnImages = 0;

		images.forEach( ( image ) => {
			try {
				const imageUrl = this.getImageUrl( image );

				const parts = new URL( imageUrl );

				if( parts.hostname === 'i0.wp.com' ) {
					cdnImageCount++;
				}
				else if( this.domainShouldHaveCdn( parts.hostname ) && !this.isStatsUrl( imageUrl ) ){
					nonCdnImages++;
					console.log( imageUrl, 'is not serving through cdn');
				}
			}
			catch {
				console.log( 'Skipped checking this image for CDN:', image );
				// Skip images that do not have a hostname
			}
		} );

		if ( cdnImageCount && !nonCdnImages ) {
			return {
				type: 'positive',
			};
		} else if ( ! cdnImageCount && nonCdnImages) {
			return {
				type: 'negative'
			}
		} else if ( cdnImageCount && nonCdnImages ) {
			return {
				type: 'warning',
				message: `CDN images: ${cdnImageCount}, non-CDN images: ${nonCdnImages}`,
			}
		}


		return {
			type: 'neutral',
			message: 'No images found'
		}
	}

	private getImageUrl( image: HTMLImageElement ): string {
		let imageUrl;

		if (image.currentSrc) {
			imageUrl = image.currentSrc;
		} else if (image.srcset) {
			const srcsetUrls = image.srcset.split(',').map((s) => s.trim().split(' ')[0]);
			imageUrl = srcsetUrls[0];
		}

		if( !imageUrl || imageUrl.startsWith( 'data:' ) ) {
			imageUrl = image.src;
		}

		return imageUrl;
	}

	private domainShouldHaveCdn( hostname: string ) {
		const noCdnDomains = [
			/^.*\.files\.wordpress\.com$/,
			/^secure\.gravatar\.com$/,
			/^chart\.googleapis\.com$/,
			/^chart\.apis\.google\.com$/,
			/^graph\.facebook\.com$/,
			/\.fbcdn\.net$/,
			/\.paypalobjects\.com$/,
			/\.dropbox\.com$/,
			/\.cdninstagram\.com$/,
			/^(commons|upload)\.wikimedia\.org$/,
			/\.wikipedia\.org$/,
		]

		for (const pattern of noCdnDomains) {
			if ( pattern.test(hostname)) {
				return false;
			}
		}
		
		return true;
	}

	private isStatsUrl( url: string ) {
		// Check if it's a wp-admin generated image which would usually be for stats
		return url.search( '/wp-admin/admin.php' ) !== -1;
	}
}