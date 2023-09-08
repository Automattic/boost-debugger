type Status = 'positive'|'negative'|'warning'|'neutral';
type Modules = 'criticalCss'|'deferredJs'|'lazyLoading'|'concatenateJs'|'concatenateCss'|'imageCdn';

export type StatusObject= {
	status: Status,
	message?: string
};

export type ModuleStatusType = Record< Modules, StatusObject >;

export default class PageChecker {
	public getPageStatus(): ModuleStatusType {
		return {
			criticalCss: {
				status: this.hasCriticalCSS() ? "positive" : "negative"
			},
			deferredJs: {
				status: this.getNonDeferredJs().length === 0 ? "positive" : "negative",
				message: this.getNonDeferredJs().length === 0 ? undefined : `${this.getNonDeferredJs().length} files weren't deferred`
			},
			lazyLoading: {
				status: this.hasLazyLoading() ? "positive" : "negative"
			},
			imageCdn: {
				status: 'neutral',
				message: 'Not implemented'
			},
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

	private hasCriticalCSS() {
		return document.getElementById( 'jetpack-boost-critical-css' );
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
}