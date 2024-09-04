	/**
	 * Search the dom for comment that contains a string
	 */
	export function hasComment( parentEl: HTMLElement, str: string ) {
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