/**
 * Custom component for BlockDropZone for being able to position inner blocks via drag and drop.
 * Parts of this are taken from the original BlockDropZone component.
 */

/**
 * WordPress dependencies
 */
import {
	DropZone,
} from '@wordpress/components';
import { Component } from '@wordpress/element';
import { withDispatch } from '@wordpress/data';
import {
	MediaUploadCheck,
} from '@wordpress/editor';

/**
 * Internal dependencies
 */
import { STORY_PAGE_INNER_HEIGHT, STORY_PAGE_INNER_WIDTH } from './../constants';

const wrapperElSelector = 'div[data-amp-selected="parent"] .editor-inner-blocks';

class BlockDropZone extends Component {
	constructor() {
		super( ...arguments );

		this.onDrop = this.onDrop.bind( this );
	}

	getDragDropPercentagePosition( axis, srcValue, dstValue ) {
		const positionInPx = dstValue - srcValue;
		if ( 'x' === axis ) {
			return Math.round( ( positionInPx / STORY_PAGE_INNER_WIDTH ) * 100 );
		} else if ( 'y' === axis ) {
			return Math.round( ( positionInPx / STORY_PAGE_INNER_HEIGHT ) * 100 );
		}
		return 0;
	}

	onDrop( event ) {
		const { updateBlockAttributes, srcClientId } = this.props;

		const elementId = `block-${ srcClientId }`;
		const cloneElementId = `clone-block-${ srcClientId }`;
		const element = document.getElementById( elementId );
		const clone = document.getElementById( cloneElementId );

		// Get the editor wrapper element for calculating the width and height.
		const wrapperEl = document.querySelector( wrapperElSelector );
		if ( ! element || ! clone || ! wrapperEl ) {
			event.preventDefault();
			return;
		}

		// Get the current position of the clone.
		const clonePosition = clone.getBoundingClientRect();

		const wrapperPosition = wrapperEl.getBoundingClientRect();

		// We will set the new position based on where the clone was moved to, with reference being the wrapper element.
		// Lets take the % based on the wrapper for top and left.

		updateBlockAttributes( srcClientId, {
			positionLeft: this.getDragDropPercentagePosition( 'x', wrapperPosition.left, clonePosition.left ),
			positionTop: this.getDragDropPercentagePosition( 'y', wrapperPosition.top, clonePosition.top ),
		} );
	}

	render() {
		return (
			<MediaUploadCheck>
				<DropZone
					className="editor-block-drop-zone"
					onDrop={ this.onDrop }
				/>
			</MediaUploadCheck>
		);
	}
}
export default withDispatch( ( dispatch ) => {
	const { updateBlockAttributes } = dispatch( 'core/block-editor' );

	return {
		updateBlockAttributes( ...args ) {
			updateBlockAttributes( ...args );
		},
	};
} )( BlockDropZone );
