type Status = 'positive'|'negative'|'warning'|'neutral';
type Modules = 'criticalCss'|'deferredJs'|'lazyLoading'|'concatenateJs'|'concatenateCss'|'imageCdn';

export type StatusObject= {
	status: Status,
	message?: string
};

export type ModuleStatusType = Record< Modules, StatusObject >;

export default class PageChecker {
	public getPageStatus(): ModuleStatusType {
		this.getImageCdnStatus();

		return {
			criticalCss: {
				status: this.hasCriticalCSS() ? "positive" : "negative"
			},
			deferredJs: {
				status: this.getNonDeferredJs().length === 0 ? "positive" : "negative",
				message: this.getNonDeferredJs().length === 0 ? undefined : `${this.getNonDeferredJs().length} files weren't deferred`
			},
			lazyLoading: this.getLazyLoadingStatus(),
			imageCdn: this.getImageCdnStatus(),
			concatenateCss: this.getConcatenateCssStatus(),
			concatenateJs: this.getConcatenateJsStatus(),
		}
	}

	private getConcatenateCssStatus() : StatusObject {
		if( this.hasConcatenatedCss() ) {
			return { status: 'positive' };
		}

		if( this.hasComment( document.head, 'No Concat CSS' ) ) {
			return {
				status: 'warning',
				message: "Feature is enabled but all files are skipped"
			}
		}

		return { status: 'negative' };
	}

	private getConcatenateJsStatus() : StatusObject {
		if( this.hasConcatenatedJs() ) {
			return { status: 'positive' };
		}

		if( this.hasComment( document.head, 'No Concat JS' ) ) {
			return {
				status: 'warning',
				message: "Feature is enabled but all files are skipped"
			}
		}

		return { status: 'negative' };
	}

	private getLazyLoadingStatus() : StatusObject {
		if ( !this.hasImages() ) {
			return { status: "neutral", message: "No images found" };
		}

		if ( this.hasLazyLoading() ) {
			return { status: "positive" };
		}

		return { status: "negative" };
	}

	private hasCriticalCSS() {
		return document.getElementById( 'jetpack-boost-critical-css' );
	}

	private hasImages() {
		return document.querySelectorAll( 'img' ).length > 0;
	}
	
	private hasLazyLoading() {
		return document.getElementsByClassName( 'jetpack-lazy-image' ).length > 0;
	}
	
	private getNonDeferredJs() {
		return document.querySelectorAll( 'head script:not([data-jetpack-boost="ignore"])');
	}
	
	private hasConcatenatedCss() {
		const stylesheet = document.querySelector('link[rel="stylesheet"][data-handles][href*="_jb_static"]');
	
		// If there is a stylesheet which has the `data-handles` attribute and `_jb_static` in the URL, Concatenate CSS is at play.
		return stylesheet !== null;
	}
	
	private hasConcatenatedJs() {
		const script = document.querySelector('script[src][data-handles][src*="_jb_static"]');
	
		// If there is a script which has the `data-handles` attribute and `_jb_static` in the URL, Concatenate JS is at play.
		return script !== null;
	}
	
	/**
	 * Search the dom for comment that contains a string
	 */
	private hasComment( parentEl: HTMLElement, str: string ) {
		const walker = document.createTreeWalker(
			parentEl, 
			NodeFilter.SHOW_COMMENT, 
			null
		)
	
		while( walker.nextNode() ) {
			const comment = walker.currentNode.nodeValue || '';
			if( comment.search( str ) !== -1 ) {
				return true;
			}
		}
	
		return false;
	}

	private getImageCdnStatus( ) : StatusObject {
		const images = document.querySelectorAll( 'img' );
		let cdnImageCount = 0;
		let nonCdnImages = 0;

		images.forEach( ( image ) => {
			try {
				let imageUrl: string;

				if (image.currentSrc) {
					imageUrl = image.currentSrc;
				} else if (image.srcset) {
					const srcsetUrls = image.srcset.split(',').map((s) => s.trim().split(' ')[0]);
					imageUrl = srcsetUrls[0];
				} else {
					imageUrl = image.src;
				}

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
				status: 'positive',
			};
		} else if ( ! cdnImageCount && nonCdnImages) {
			return {
				status: 'negative'
			}
		} else if ( cdnImageCount && nonCdnImages ) {
			return {
				status: 'warning',
				message: `CDN images: ${cdnImageCount}, non-CDN images: ${nonCdnImages}`,
			}
		}


		return {
			status: 'neutral',
			message: 'No images found'
		}
	}

	private isStatsUrl( url: string ) {
		// Check if it's a wp-admin generated image which would usually be for stats
		return url.search( '/wp-admin/admin.php' ) !== -1;
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
}